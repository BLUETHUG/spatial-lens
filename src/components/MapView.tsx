"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { motion, AnimatePresence } from "framer-motion";
import { DeckGL } from "@deck.gl/react";
import { HeatmapLayer, HexagonLayer, ScreenGridLayer } from "@deck.gl/aggregation-layers";
import { ScatterplotLayer, GeoJsonLayer } from "@deck.gl/layers";
import type { Location } from "@/components/locations";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export type CameraMode = 
  | "drone" 
  | "orbit" 
  | "satellite" 
  | "street" 
  | "pedestrian" 
  | "helicopter";

interface CameraModeConfig {
  name: string;
  icon: string;
  pitch: number;
  zoomOffset: number;
  speed: number;
  fov: number;
  description: string;
}

export const CAMERA_MODES: Record<CameraMode, CameraModeConfig> = {
  drone: {
    name: "Drone",
    icon: "🚁",
    pitch: 45,
    zoomOffset: 0,
    speed: 1,
    fov: 50,
    description: "Low altitude, dynamic angles"
  },
  orbit: {
    name: "Orbit",
    icon: "🔄",
    pitch: 60,
    zoomOffset: -0.5,
    speed: 0.3,
    fov: 60,
    description: "Circular cinematic rotation"
  },
  satellite: {
    name: "Satellite",
    icon: "🛰️",
    pitch: 0,
    zoomOffset: -3,
    speed: 0.5,
    fov: 30,
    description: "Top-down orbital view"
  },
  street: {
    name: "Street",
    icon: "🚶",
    pitch: 0,
    zoomOffset: 2,
    speed: 0.8,
    fov: 70,
    description: "Ground-level street view"
  },
  pedestrian: {
    name: "Pedestrian",
    icon: "👣",
    pitch: 10,
    zoomOffset: 3,
    speed: 1.2,
    fov: 80,
    description: "Human eye level walkthrough"
  },
  helicopter: {
    name: "Helicopter",
    icon: "🚁",
    pitch: 30,
    zoomOffset: -1,
    speed: 0.6,
    fov: 55,
    description: "High altitude, smooth pans"
  }
};

interface MapViewProps {
  locations: Location[];
  selectedLocation: Location | null;
  onSelectLocation: (location: Location | null) => void;
  cameraMode: CameraMode;
  onCameraModeChange: (mode: CameraMode) => void;
  activeLayers: string[];
  timePeriod: number;
}

export default function MapView({
  locations,
  selectedLocation,
  onSelectLocation,
  cameraMode,
  onCameraModeChange,
  activeLayers,
  timePeriod
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const orbitAnimation = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Camera mode transitions
  const applyCameraMode = useCallback((mode: CameraMode, targetLocation?: Location) => {
    if (!map.current) return;
    const config = CAMERA_MODES[mode];
    const center = targetLocation?.coordinates ?? map.current.getCenter().toArray();
    const zoom = (targetLocation?.zoom ?? map.current.getZoom()) + config.zoomOffset;
    
    map.current.flyTo({
      center,
      zoom,
      pitch: config.pitch,
      bearing: targetLocation?.bearing ?? map.current.getBearing(),
      duration: 2000 / config.speed,
      curve: 1.5,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      essential: true
    });
  }, []);

  // Orbit animation
  const startOrbit = useCallback(() => {
    if (!map.current || cameraMode !== "orbit") return;
    const animate = () => {
      if (!map.current || cameraMode !== "orbit") return;
      map.current.rotateTo(map.current.getBearing() + 0.1, { duration: 0 });
      orbitAnimation.current = requestAnimationFrame(animate);
    };
    animate();
  }, [cameraMode]);

  const stopOrbit = useCallback(() => {
    if (orbitAnimation.current) {
      cancelAnimationFrame(orbitAnimation.current);
      orbitAnimation.current = null;
    }
  }, []);

  useEffect(() => {
    if (cameraMode === "orbit") startOrbit();
    else stopOrbit();
    return stopOrbit;
  }, [cameraMode, startOrbit, stopOrbit]);

  // Map initialization
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [36.8172, -1.2864],
      zoom: 11,
      pitch: 45,
      bearing: 0,
      attributionControl: false,
      antialias: true
    });

    m.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");

    m.on("load", () => {
      m.setFog({
        color: "rgba(10, 10, 20, 0.8)",
        "high-color": "rgba(20, 20, 40, 0.6)",
        "space-color": "rgba(10, 10, 20, 0.4)",
        "horizon-blend": 0.1
      });
      
      // Add terrain
      m.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14
      });
      m.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

      // 3D buildings
      m.addLayer({
        id: "3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        minzoom: 15,
        paint: {
          "fill-extrusion-color": [
            "interpolate", ["linear"], ["get", "height"],
            0, "#2a2a3a",
            50, "#3a3a4a",
            100, "#4a4a5a",
            200, "#5a5a6a"
          ],
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": ["get", "min_height"],
          "fill-extrusion-opacity": 0.7
        }
      });

      setIsLoaded(true);
    });

    map.current = m;
    return () => {
      stopOrbit();
      m.remove();
      map.current = null;
    };
  }, [stopOrbit]);

  // Sync selected location
  useEffect(() => {
    if (!map.current || !selectedLocation) return;
    applyCameraMode(cameraMode, selectedLocation);
  }, [selectedLocation, cameraMode, applyCameraMode]);

  // Markers
  useEffect(() => {
    if (!map.current) return;
    markers.current.forEach((m) => m.remove());
    markers.current = [];

    locations.forEach((loc) => {
      const el = document.createElement("div");
      el.className = "location-marker";
      el.dataset.locationId = loc.id;
      el.style.cssText = `
        width: 14px; height: 14px; border-radius: 50%;
        background: ${loc.color};
        box-shadow: 0 0 16px ${loc.color}99, 0 0 32px ${loc.color}66;
        cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
        border: 2px solid rgba(255,255,255,0.2);
      `;
      el.onmouseenter = () => {
        el.style.transform = "scale(1.8)";
        el.style.boxShadow = `0 0 24px ${loc.color}cc, 0 0 48px ${loc.color}88`;
      };
      el.onmouseleave = () => {
        el.style.transform = "scale(1)";
        el.style.boxShadow = `0 0 16px ${loc.color}99, 0 0 32px ${loc.color}66`;
      };
      el.onclick = () => {
        if (selectedLocation?.id === loc.id) {
          onSelectLocation(null);
        } else {
          onSelectLocation(loc);
          applyCameraMode(cameraMode, loc);
        }
      };

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(loc.coordinates)
        .addTo(map.current!);
      markers.current.push(marker);
    });
  }, [locations, selectedLocation, onSelectLocation, cameraMode, applyCameraMode]);

  // Deck.gl layers for active data layers
  const deckLayers = activeLayers.map((layerId) => {
    // Generate mock data for demonstration
    const generateMockData = () => {
      const data = [];
      for (let i = 0; i < 100; i++) {
        data.push({
          position: [
            36.7 + Math.random() * 0.3,
            -1.35 + Math.random() * 0.15
          ],
          weight: Math.random(),
          category: ["safety", "traffic", "events", "construction"][Math.floor(Math.random() * 4)]
        });
      }
      return data;
    };

    switch (layerId) {
      case "safety":
        return new HeatmapLayer({
          id: "safety-heatmap",
          data: generateMockData(),
          getPosition: (d: any) => d.position,
          getWeight: (d: any) => d.weight * (d.category === "safety" ? 1 : 0.1),
          radiusPixels: 60,
          intensity: 1,
          threshold: 0.05,
          colorRange: [
            [0, 255, 100, 50],
            [255, 255, 0, 100],
            [255, 100, 0, 150],
            [255, 0, 0, 200]
          ]
        });
      case "traffic":
        return new HexagonLayer({
          id: "traffic-hex",
          data: generateMockData(),
          getPosition: (d: any) => d.position,
          radius: 200,
          elevationScale: 100,
          extruded: true,
          coverage: 0.8,
          getColor: (d: any) => d.category === "traffic" ? [255, 165, 0, 180] : [100, 100, 100, 50]
        });
      case "events":
        return new ScatterplotLayer({
          id: "events-scatter",
          data: generateMockData().filter((d: any) => d.category === "events"),
          getPosition: (d: any) => d.position,
          getRadius: 150,
          getFillColor: [100, 200, 255, 200],
          pickable: true
        });
      case "construction":
        return new ScreenGridLayer({
          id: "construction-grid",
          data: generateMockData().filter((d: any) => d.category === "construction"),
          getPosition: (d: any) => d.position,
          getWeight: (d: any) => d.weight,
          cellSizePixels: 50,
          colorRange: [
            [255, 200, 0, 50],
            [255, 150, 0, 100],
            [255, 100, 0, 150],
            [255, 50, 0, 200]
          ]
        });
      default:
        return null;
    }
  }).filter(Boolean);

  return (
    <div className="fixed inset-0">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Deck.gl overlay for data layers */}
      {deckLayers.length > 0 && isLoaded && (
        <DeckGL
          initialViewState={{
            longitude: 36.8172,
            latitude: -1.2864,
            zoom: 11,
            pitch: 45,
            bearing: 0
          }}
          controller={true}
          layers={deckLayers as any}
          style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", pointerEvents: "none" }}
        />
      )}

      {/* Camera Mode Selector */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-1 px-2 py-2 rounded-2xl backdrop-blur-2xl bg-black/40 border border-white/10 shadow-2xl"
        >
          {(Object.entries(CAMERA_MODES) as [CameraMode, CameraModeConfig][]).map(([mode, config]) => (
            <button
              key={mode}
              onClick={() => onCameraModeChange(mode)}
              className={`relative px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                cameraMode === mode
                  ? "bg-white/20 text-white border border-white/30"
                  : "text-white/50 hover:text-white/80 hover:bg-white/10"
              }`}
              title={config.description}
            >
              <span className="flex items-center gap-1">
                <span>{config.icon}</span>
                <span>{config.name}</span>
              </span>
              {cameraMode === mode && (
                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: locations[0]?.color || "#6366f1" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                />
              )}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Mode Description Tooltip */}
      <AnimatePresence>
        {cameraMode && (
          <motion.div
            key={cameraMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-xl backdrop-blur-xl bg-black/60 border border-white/10 text-white/70 text-sm"
          >
            {CAMERA_MODES[cameraMode].description}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <div className="absolute top-6 left-6 z-40">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-2 rounded-2xl backdrop-blur-xl bg-black/40 border border-white/10"
        >
          <h1 className="text-sm font-semibold text-white/90">Spatial Lens</h1>
          <p className="text-[10px] text-white/40">Nairobi • {timePeriod}</p>
        </motion.div>
      </div>
    </div>
  );
}