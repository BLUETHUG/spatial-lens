"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TIME_PERIODS = [
  {
    year: 1899,
    label: "Railway Era",
    description: "Uganda Railway reaches Nairobi, transforming a swamp into a depot town.",
    population: "~5,000",
    color: "#8b4513",
    events: ["Railway depot established", "First Indian traders arrive", "Tent city forms"]
  },
  {
    year: 1963,
    label: "Independence",
    description: "Kenya gains independence; Nairobi becomes capital of a new nation.",
    population: "~350,000",
    color: "#006400",
    events: ["Uhuru celebrations", "Kenyatta becomes PM", "Africanization begins"]
  },
  {
    year: 1985,
    label: "Growth Decade",
    description: "Rapid urbanization and infrastructure expansion under Moi era.",
    population: "~1.2M",
    color: "#1a5c2e",
    events: ["KICC completed", "Uhuru Highway built", "Informal settlements grow"]
  },
  {
    year: 2000,
    label: "Millennium",
    description: "Economic liberalization brings new investment and challenges.",
    population: "~2.5M",
    color: "#2e8b57",
    events: ["Mobile phones arrive", "Real estate boom", "Traffic congestion worsens"]
  },
  {
    year: 2010,
    label: "Constitution Era",
    description: "New constitution devolves power; Nairobi becomes county capital.",
    population: "~3.5M",
    color: "#3cb371",
    events: ["2010 Constitution", "Devolution starts", "Thika Superhighway opens"]
  },
  {
    year: 2025,
    label: "Smart City",
    description: "Digital transformation, BRT, expressways redefine mobility.",
    population: "~5.2M",
    color: "#6366f1",
    events: ["Nairobi Expressway", "BRT launches", "Digital govt services", "Green city plan"]
  },
  {
    year: 2050,
    label: "Future Projection",
    description: "Projected megacity with 10M+ residents and green corridors.",
    population: "~10M+",
    color: "#8b5cf6",
    events: ["Metro rail complete", "Carbon-neutral goal", "Vertical farming", "AI governance"]
  }
];

interface TimeTravelProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  onClose: () => void;
}

export default function TimeTravel({ currentYear, onYearChange, onClose }: TimeTravelProps) {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const period = TIME_PERIODS.find(p => p.year === currentYear) || TIME_PERIODS[5];

  const getLeftPercent = (i: number) => (i / (TIME_PERIODS.length - 1)) * 100 + "%";
  const getBoxShadow = (year: number) => currentYear === year ? "0 0 12px " + TIME_PERIODS.find(p => p.year === year)?.color : "none";

  return (
    <AnimatePresence>
      <motion.div
        key="time-travel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
      >
        <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-2xl bg-black/40">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/[0.02] pointer-events-none" />
          
          <div className="relative p-4">
            {/* Current Period Display */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-4"
            >
              <div>
                <div className="text-xs text-white/40 uppercase tracking-widest">Time Period</div>
                <div className="flex items-center gap-3 mt-1">
                  <motion.span
                    key={currentYear}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-3xl font-bold tabular-nums"
                    style={{ color: period.color }}
                  >
                    {currentYear}
                  </motion.span>
                  <div>
                    <div className="text-sm font-medium text-white">{period.label}</div>
                    <div className="text-xs text-white/50">{period.population}</div>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white/90 transition-all"
              >
                ✕
              </button>
            </motion.div>

            {/* Timeline Slider */}
            <div className="relative">
              <div className="h-1 bg-gradient-to-r via-white/10 rounded-full relative overflow-hidden">
                {TIME_PERIODS.map((p, i) => (
                  <motion.button
                    key={p.year}
                    onClick={() => onYearChange(p.year)}
                    onMouseEnter={() => setHoveredYear(p.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300"
                    style={{ 
                      left: getLeftPercent(i),
                      zIndex: currentYear === p.year ? 10 : 1
                    }}
                  >
                    <motion.div
                      className="w-3 h-3 rounded-full border-2 transition-all"
                      style={{ 
                        borderColor: currentYear === p.year ? p.color : "rgba(255,255,255,0.3)",
                        background: currentYear === p.year ? p.color : "transparent",
                        transform: hoveredYear === p.year || currentYear === p.year ? "scale(1.5)" : "scale(1)",
                        boxShadow: getBoxShadow(p.year)
                      }}
                      animate={{ scale: currentYear === p.year ? 1.3 : 1 }}
                    />
                    <AnimatePresence>
                      {(hoveredYear === p.year || currentYear === p.year) && (
                        <motion.div
                          key={p.year}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded bg-black/80 backdrop-blur text-[10px] text-white/80 border border-white/10"
                        >
                          {p.year} — {p.label}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Period Details on Hover */}
            <AnimatePresence>
              {hoveredYear && (
                <motion.div
                  key={hoveredYear}
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10"
                >
                  {(() => {
                    const p = TIME_PERIODS.find(t => t.year === hoveredYear);
                    if (!p) return null;
                    return (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span style={{ color: p.color }}>{p.year}</span>
                          <span className="font-medium text-white">{p.label}</span>
                          <span className="text-white/40 ml-auto">{p.population}</span>
                        </div>
                        <div className="text-xs text-white/60">{p.description}</div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.events.slice(0, 3).map((e, i) => (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                              className="px-2 py-0.5 text-[10px] rounded bg-white/10 text-white/70"
                            >
                              {e}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}