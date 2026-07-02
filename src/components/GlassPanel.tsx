"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { Location } from "./locations";

interface GlassPanelProps {
  location: Location | null;
  onClose: () => void;
}

type Tab = "overview" | "history" | "government" | "live" | "economy" | "community";

const tabs: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "history", label: "History" },
  { id: "government", label: "Government" },
  { id: "live", label: "Live News" },
  { id: "economy", label: "Economy" },
  { id: "community", label: "Community" },
];

function OverviewTab({ location }: { location: Location }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {location.population && (
          <GlassCard label="Population" value={location.population} />
        )}
        {location.area && (
          <GlassCard label="Area" value={location.area} />
        )}
        {location.elevation && (
          <GlassCard label="Elevation" value={location.elevation} />
        )}
        <GlassCard
          label="Coordinates"
          value={`${location.coordinates[1].toFixed(4)}, ${location.coordinates[0].toFixed(4)}`}
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <MiniMetric label="Safety" value="94%" color="#22c55e" />
        <MiniMetric label="Traffic" value="Heavy" color="#f59e0b" />
        <MiniMetric label="Weather" value="22°C" color="#06b6d4" />
      </div>
      <p className="text-sm text-white/60 leading-relaxed">{location.description}</p>
    </div>
  );
}

function HistoryTab() {
  const events = [
    { year: "1899", event: "Railway arrives" },
    { year: "1963", event: "Independence" },
    { year: "1982", event: "Urban expansion" },
    { year: "2026", event: "Population 5.2M" },
  ];
  return (
    <div className="space-y-0">
      {events.map((e, i) => (
        <motion.div
          key={e.year}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="relative pl-6 pb-4 border-l border-white/10 last:border-0 last:pb-0"
        >
          <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-white/30" />
          <div className="text-xs text-white/40">{e.year}</div>
          <div className="text-sm text-white/80">{e.event}</div>
        </motion.div>
      ))}
    </div>
  );
}

function GovernmentTab() {
  const officials = [
    { name: "Johnson Sakaja", title: "Governor", color: "#6366f1" },
    { name: "Edwin Sifuna", title: "Senator", color: "#8b5cf6" },
    { name: "Esther Passaris", title: "Women Rep", color: "#ec4899" },
  ];
  return (
    <div className="space-y-3">
      {officials.map((o, i) => (
        <motion.div
          key={o.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: `${o.color}33`, color: o.color }}
          >
            {o.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <div className="text-sm text-white/90">{o.name}</div>
            <div className="text-xs text-white/40">{o.title}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function LiveNewsTab() {
  const categories = ["Politics", "Business", "Crime", "Sports", "Weather", "Tech"];
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <span
            key={cat}
            className="px-2.5 py-1 text-xs rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/90 transition-all cursor-pointer"
          >
            {cat}
          </span>
        ))}
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="h-2 w-24 rounded-full bg-white/10 mb-2" />
            <div className="h-2 w-full rounded-full bg-white/5" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EconomyTab() {
  const items = [
    { label: "Fuel", value: "KES 194/L", trend: "up" },
    { label: "Electricity", value: "KES 24.5/kWh", trend: "up" },
    { label: "Food Basket", value: "KES 8,500", trend: "down" },
    { label: "Rent (1BR)", value: "KES 25,000", trend: "stable" },
  ];
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10"
        >
          <span className="text-sm text-white/60">{item.label}</span>
          <span className="text-sm text-white/90 font-mono">{item.value}</span>
        </motion.div>
      ))}
    </div>
  );
}

function CommunityTab() {
  const metrics = [
    { label: "Safety", value: "94%", color: "#22c55e" },
    { label: "Traffic", value: "Heavy", color: "#f59e0b" },
    { label: "Community Reports", value: "21", color: "#6366f1" },
    { label: "Events Today", value: "7", color: "#06b6d4" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="p-3 rounded-xl bg-white/5 border border-white/10 text-center"
        >
          <div className="text-2xl font-bold" style={{ color: m.color }}>
            {m.value}
          </div>
          <div className="text-xs text-white/40 mt-0.5">{m.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

function GlassCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
      <div className="text-xs text-white/40">{label}</div>
      <div className="text-sm text-white/90 mt-0.5">{value}</div>
    </div>
  );
}

function MiniMetric({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
      <div className="text-xs font-semibold" style={{ color }}>
        {value}
      </div>
      <div className="text-[10px] text-white/40 mt-0.5">{label}</div>
    </div>
  );
}

export default function GlassPanel({ location, onClose }: GlassPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const renderTab = () => {
    if (!location) return null;
    switch (activeTab) {
      case "overview":
        return <OverviewTab location={location} />;
      case "history":
        return <HistoryTab />;
      case "government":
        return <GovernmentTab />;
      case "live":
        return <LiveNewsTab />;
      case "economy":
        return <EconomyTab />;
      case "community":
        return <CommunityTab />;
    }
  };

  return (
    <AnimatePresence>
      {location && (
        <motion.div
          key={location.id}
          initial={{ opacity: 0, x: 80, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed right-6 top-6 bottom-6 w-[380px] z-50"
        >
          <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-2xl bg-black/40">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/[0.02] pointer-events-none" />
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 pointer-events-none" />

            <div className="relative h-full flex flex-col">
              <div className="flex items-center justify-between p-4 pb-2">
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-white/40 uppercase tracking-widest"
                  >
                    {location.type}
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="text-xl font-semibold text-white mt-0.5"
                  >
                    {location.name}
                  </motion.h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white/90 transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="flex gap-1 px-4 overflow-x-auto pb-2 scrollbar-none">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 px-3 py-1.5 text-xs rounded-full transition-all ${
                      activeTab === tab.id
                        ? "bg-white/20 text-white border border-white/20"
                        : "text-white/40 hover:text-white/70 bg-white/5 border border-transparent"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-thumb-white/10">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderTab()}
                </motion.div>

                <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                  <div className="text-[10px] text-indigo-300/60 uppercase tracking-wider mb-1">
                    AI Summary
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Today this area is experiencing normal activity. Weather is
                    clear at 22°C with light winds. Community reports indicate
                    stable conditions across all metrics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
