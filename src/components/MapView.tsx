"use client";

import { useRef, useCallback, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { motion } from "framer-motion";
import type { Location } from "./locations";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface MapViewProps {
  locations: Location[];
  selectedLocation: Location | null;
  onSelectLocation: (location: Location | null) => void;
}

export default function MapView({
  locations,
  selectedLocation,
  onSelectLocation,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

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
      antialias: true,
    });

    m.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    m.on("load", () => {
      m.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      m.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

      m.addLayer({
        id: "3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        minzoom: 15,
        paint: {
          "fill-extrusion-color": "#a0a0a0",
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": ["get", "min_height"],
          "fill-extrusion-opacity": 0.6,
        },
      });

      m.setFog({
        color: "rgba(10, 10, 20, 0.8)",
        "high-color": "rgba(20, 20, 40, 0.6)",
        "space-color": "rgba(10, 10, 20, 0.4)",
        "horizon-blend": 0.1,
      });
    });

    map.current = m;

    return () => {
      m.remove();
      map.current = null;
    };
  }, []);

  const flyTo = useCallback((loc: Location) => {
    if (!map.current) return;
    map.current.flyTo({
      center: loc.coordinates,
      zoom: loc.zoom,
      pitch: loc.pitch ?? 50,
      bearing: loc.bearing ?? 0,
      duration: 2500,
      curve: 1.5,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
  }, []);

  useEffect(() => {
    if (!map.current || !selectedLocation) return;
    flyTo(selectedLocation);
  }, [selectedLocation, flyTo]);

  useEffect(() => {
    if (!map.current) return;

    markers.current.forEach((m) => m.remove());
    markers.current = [];

    locations.forEach((loc) => {
      const el = document.createElement("div");
      el.className =
        "w-3 h-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-150";
      el.style.background = loc.color;
      el.style.boxShadow = `0 0 12px ${loc.color}66, 0 0 24px ${loc.color}33`;
      el.dataset.locationId = loc.id;

      el.addEventListener("click", () => {
        if (selectedLocation?.id === loc.id) {
          onSelectLocation(null);
        } else {
          onSelectLocation(loc);
          flyTo(loc);
        }
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(loc.coordinates)
        .addTo(map.current!);

      markers.current.push(marker);
    });
  }, [locations, selectedLocation, onSelectLocation, flyTo]);

  return (
    <div className="fixed inset-0">
      <div ref={mapContainer} className="w-full h-full" />

      <div className="absolute top-6 left-6 z-40">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-2 rounded-2xl backdrop-blur-xl bg-black/40 border border-white/10"
        >
          <h1 className="text-sm font-semibold text-white/90">
            Spatial Lens
          </h1>
          <p className="text-[10px] text-white/40">
            Explore the city&apos;s intelligence
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2 px-3 py-2 rounded-2xl backdrop-blur-xl bg-black/40 border border-white/10"
        >
          {["drone", "orbit", "satellite", "street"].map((mode) => (
            <button
              key={mode}
              className="px-3 py-1.5 text-xs rounded-xl bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/90 transition-all capitalize"
            >
              {mode}
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
