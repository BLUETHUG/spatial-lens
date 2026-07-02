"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { locations, type Location } from "@/components/locations";
import GlassPanel from "@/components/GlassPanel";
import LayersPanel, { type LayerCategory } from "@/components/LayersPanel";
import TimeTravel from "@/components/TimeTravel";
import { CAMERA_MODES, type CameraMode } from "@/components/MapView";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [cameraMode, setCameraMode] = useState<CameraMode>("drone");
  const [activeLayers, setActiveLayers] = useState<string[]>(["safety", "traffic"]);
  const [showLayers, setShowLayers] = useState(false);
  const [timePeriod, setTimePeriod] = useState(2025);
  const [showTimeTravel, setShowTimeTravel] = useState(false);

  const toggleLayer = useCallback((layerId: string) => {
    setActiveLayers(prev => 
      prev.includes(layerId) 
        ? prev.filter(l => l !== layerId)
        : [...prev, layerId]
    );
  }, []);

  return (
    <main className="relative w-full h-screen bg-black overflow-hidden">
      <MapView
        locations={locations}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        cameraMode={cameraMode}
        onCameraModeChange={setCameraMode}
        activeLayers={activeLayers}
        timePeriod={timePeriod}
      />
      
      <GlassPanel
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />

      {/* Camera Mode Indicator */}
      <div className="absolute top-6 right-6 z-30">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-3 py-2 rounded-xl backdrop-blur-xl bg-black/40 border border-white/10 flex items-center gap-2"
        >
          <span className="text-xl">{CAMERA_MODES[cameraMode].icon}</span>
          <span className="text-sm font-medium text-white/90">{CAMERA_MODES[cameraMode].name}</span>
        </motion.div>
      </div>

      {/* Layers Panel Toggle */}
      <div className="absolute top-6 left-6 z-30">
        <button
          onClick={() => setShowLayers(!showLayers)}
          className={`px-3 py-2 rounded-xl backdrop-blur-xl border transition-all ${
            showLayers
              ? "bg-white/20 text-white border-white/30"
              : "bg-black/40 text-white/70 border-white/10 hover:bg-white/10"
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-xl">🗂️</span>
            <span className="text-sm font-medium">Layers</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </span>
        </button>
      </div>

      {/* Time Travel Toggle */}
      <div className="absolute top-6 right-6 z-30 mt-16">
        <button
          onClick={() => setShowTimeTravel(!showTimeTravel)}
          className={`px-3 py-2 rounded-xl backdrop-blur-xl border transition-all ${
            showTimeTravel
              ? "bg-white/20 text-white border-white/30"
              : "bg-black/40 text-white/70 border-white/10 hover:bg-white/10"
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-xl">⏳</span>
            <span className="text-sm font-medium">{timePeriod}</span>
          </span>
        </button>
      </div>

      {/* Layers Panel */}
      {showLayers && (
        <LayersPanel
          activeLayers={activeLayers}
          onToggleLayer={toggleLayer}
          onClose={() => setShowLayers(false)}
        />
      )}

      {/* Time Travel Panel */}
      {showTimeTravel && (
        <TimeTravel
          currentYear={timePeriod}
          onYearChange={setTimePeriod}
          onClose={() => setShowTimeTravel(false)}
        />
      )}
    </main>
  );
}