"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface LayerCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  sublayers: string[];
}

export const LAYER_CATEGORIES: LayerCategory[] = [
  {
    id: "safety",
    name: "Safety",
    icon: "🛡️",
    description: "Crime incidents, police presence, emergency response",
    color: "#22c55e",
    sublayers: ["crime-heatmap", "police-stations", "emergency-response", "safe-routes"]
  },
  {
    id: "traffic",
    name: "Traffic",
    icon: "🚦",
    description: "Live congestion, incidents, roadworks, transit",
    color: "#f59e0b",
    sublayers: ["congestion", "incidents", "roadworks", "public-transit", "parking"]
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    icon: "🏗️",
    description: "Roads, utilities, construction, development",
    color: "#6366f1",
    sublayers: ["roads", "power-grid", "water", "fiber", "construction"]
  },
  {
    id: "environment",
    name: "Environment",
    icon: "🌿",
    description: "Air quality, green spaces, flood risk, noise",
    color: "#10b981",
    sublayers: ["air-quality", "green-cover", "flood-risk", "noise", "temperature"]
  },
  {
    id: "population",
    name: "Population",
    icon: "👥",
    description: "Density, demographics, movement patterns",
    color: "#ec4899",
    sublayers: ["density", "age-groups", "income", "movement", "day-night"]
  },
  {
    id: "economy",
    name: "Economy",
    icon: "💰",
    description: "Business activity, employment, prices, investment",
    color: "#f97316",
    sublayers: ["business-density", "employment", "commodity-prices", "rent", "investment"]
  },
  {
    id: "government",
    name: "Government",
    icon: "🏛️",
    description: "Administrative boundaries, services, representatives",
    color: "#8b5cf6",
    sublayers: ["wards", "constituencies", "county-facilities", "services", "reps"]
  },
  {
    id: "health",
    name: "Healthcare",
    icon: "🏥",
    description: "Facilities, disease surveillance, capacity",
    color: "#ef4444",
    sublayers: ["hospitals", "clinics", "pharmacies", "disease-alerts", "capacity"]
  },
  {
    id: "education",
    name: "Education",
    icon: "🎓",
    description: "Schools, enrollment, performance, access",
    color: "#06b6d4",
    sublayers: ["schools", "universities", "enrollment", "performance", "access"]
  },
  {
    id: "weather",
    name: "Weather",
    icon: "🌤️",
    description: "Current conditions, forecasts, alerts",
    color: "#22d3ee",
    sublayers: ["current", "forecast", "alerts", "radar", "satellite"]
  }
];

export const VISUAL_LAYERS: LayerCategory[] = [
  {
    id: "heatmap",
    name: "Heatmaps",
    icon: "🔥",
    description: "Density visualizations",
    color: "#ef4444",
    sublayers: ["safety", "traffic", "events", "construction"]
  },
  {
    id: "3d",
    name: "3D Extrusions",
    icon: "🏙️",
    description: "Building heights, population towers",
    color: "#a855f7",
    sublayers: ["building-height", "population-towers", "economic-towers"]
  },
  {
    id: "choropleth",
    name: "Choropleth",
    icon: "🗺️",
    description: "Boundary-based coloring",
    color: "#3b82f6",
    sublayers: ["ward-metrics", "constituency-data", "county-stats"]
  }
];

interface LayersPanelProps {
  activeLayers: string[];
  onToggleLayer: (layerId: string) => void;
  onClose: () => void;
}

export default function LayersPanel({ activeLayers, onToggleLayer, onClose }: LayersPanelProps) {
  const [activeCategory, setActiveCategory] = useState<"data" | "visual" | "all">("all");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["safety", "traffic"]);

  const allLayers = [...LAYER_CATEGORIES, ...VISUAL_LAYERS];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const isLayerActive = (layerId: string) => activeLayers.includes(layerId);

  return (
    <AnimatePresence>
      <motion.div
        key="layers-panel"
        initial={{ opacity: 0, x: -40, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -40, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-16 left-6 bottom-16 z-40 w-[320px]"
      >
        <div className="relative h-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-2xl bg-black/40">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/[0.02] pointer-events-none" />
          
          <div className="relative h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 pb-2 border-b border-white/10">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-white/40 uppercase tracking-widest"
                >
                  Information Layers
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="text-lg font-semibold text-white mt-0.5"
                >
                  {activeLayers.length} active
                </motion.div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white/90 transition-all"
              >
                ✕
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1 px-3 pb-3 overflow-x-auto scrollbar-none">
              {[
                { id: "all", label: "All", count: LAYER_CATEGORIES.length + VISUAL_LAYERS.length },
                { id: "data", label: "Data", count: LAYER_CATEGORIES.length },
                { id: "visual", label: "Visual", count: VISUAL_LAYERS.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`shrink-0 px-3 py-1.5 text-xs rounded-full transition-all ${
                    activeCategory === tab.id
                      ? "bg-white/20 text-white border border-white/20"
                      : "text-white/40 hover:text-white/70 bg-white/5 border border-transparent"
                  }`}
                >
                  {tab.label}
                  <span className="ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full bg-white/10 text-white/50">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Layer List */}
            <div className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin scrollbar-thumb-white/10">
              {allLayers
                .filter(cat => 
                  activeCategory === "all" || 
                  (activeCategory === "data" && LAYER_CATEGORIES.includes(cat)) ||
                  (activeCategory === "visual" && VISUAL_LAYERS.includes(cat))
                )
                .map((category) => (
                  <LayerCategoryAccordion
                    key={category.id}
                    category={category}
                    activeLayers={activeLayers}
                    onToggleLayer={onToggleLayer}
                    isExpanded={expandedCategories.includes(category.id)}
                    onToggleExpand={toggleCategory}
                  />
                ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function LayerCategoryAccordion({
  category,
  activeLayers,
  onToggleLayer,
  isExpanded,
  onToggleExpand
}: {
  category: LayerCategory;
  activeLayers: string[];
  onToggleLayer: (layerId: string) => void;
  isExpanded: boolean;
  onToggleExpand: (categoryId: string) => void;
}) {
  const activeSublayers = category.sublayers.filter(l => activeLayers.includes(l));
  const hasActive = activeSublayers.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="mb-2"
    >
      <button
        onClick={() => onToggleExpand(category.id)}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{category.icon}</span>
          <div>
            <div className="text-sm font-medium text-white">{category.name}</div>
            <div className="text-[10px] text-white/40">{category.description}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasActive && (
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-green-500/20 text-green-400 font-medium">
              {activeSublayers.length}
            </span>
          )}
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="text-white/40 text-sm"
          >
            ▼
          </motion.span>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 ml-7 pl-2 border-l border-white/10"
          >
            {category.sublayers.map((sublayer) => (
              <LayerToggle
                key={sublayer}
                id={sublayer}
                label={sublayer.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                active={activeLayers.includes(sublayer)}
                onToggle={onToggleLayer}
                color={category.color}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LayerToggle({ id, label, active, onToggle, color }: {
  id: string;
  label: string;
  active: boolean;
  onToggle: (id: string) => void;
  color: string;
}) {
  return (
    <button
      onClick={() => onToggle(id)}
      className={`w-full flex items-center justify-between py-2 px-2 rounded-lg transition-all ${
        active ? "bg-white/10" : "hover:bg-white/5"
      }`}
      style={{ borderColor: active ? color + "80" : "transparent" }}
    >
      <span className="text-sm text-white/80">{label}</span>
      <div className="relative w-10 h-6 rounded-full transition-all" style={{ background: active ? color : "rgba(255,255,255,0.1)" }}>
        <motion.div
          animate={{ x: active ? 24 : 2 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md"
        />
      </div>
    </button>
  );
}