"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Html, useGLTF } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

interface BuildingData {
  id: string;
  name: string;
  type: string;
  height: number;
  position: [number, number];
  status: "open" | "closed" | "emergency";
  visitors?: number;
  events?: string[];
  alerts?: string[];
}

const BUILDINGS: BuildingData[] = [
  {
    id: "kicc",
    name: "KICC",
    type: "Convention Centre",
    height: 105,
    position: [36.8215, -1.2883],
    status: "open",
    visitors: 2400,
    events: ["Tech Summit 2025", "Trade Expo"],
    alerts: []
  },
  {
    id: "times-tower",
    name: "Times Tower",
    type: "Government Office",
    height: 140,
    position: [36.8235, -1.2901],
    status: "open",
    visitors: 5200,
    events: [],
    alerts: []
  },
  {
    id: "nhif",
    name: "NHIF Building",
    type: "Healthcare HQ",
    height: 85,
    position: [36.8198, -1.2920],
    status: "open",
    visitors: 1800,
    events: [],
    alerts: ["System maintenance today"]
  },
  {
    id: "cbk",
    name: "Central Bank",
    type: "Financial Institution",
    height: 75,
    position: [36.8210, -1.2895],
    status: "open",
    visitors: 800,
    events: ["Monetary Policy Meeting"],
    alerts: []
  }
];

// Hologram particle system
function HologramParticles({ position, color, intensity }: { 
  position: THREE.Vector3; 
  color: string; 
  intensity: number 
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const { scene } = useThree();
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0005 * intensity;
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
      
      const positions = pointsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.getElapsedTime() * 2 + i) * 0.001;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const geometry = useRef<THREE.BufferGeometry>(null);
  if (!geometry.current) {
    geometry.current = new THREE.BufferGeometry();
    const count = 500;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const alphas = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const radius = 15 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      sizes[i] = Math.random() * 2 + 0.5;
      alphas[i] = Math.random() * 0.5 + 0.2;
    }
    
    geometry.current.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.current.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.current.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
  }

  const material = useRef<THREE.PointsMaterial>(null);
  if (!material.current) {
    material.current = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: false,
      transparent: true,
      opacity: 0.6 * intensity,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: new THREE.Color(color)
    });
  }

  return (
    <points
      ref={pointsRef}
      geometry={geometry.current}
      material={material.current}
      position={position}
    />
  );
}

// Hologram ring
function HologramRing({ position, color, scale }: { 
  position: THREE.Vector3; 
  color: string; 
  scale: number 
}) {
  const { scene } = useThree();
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.001;
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.3 + Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
    }
  });

  const geometry = useRef<THREE.RingGeometry>(null);
  if (!geometry.current) {
    geometry.current = new THREE.RingGeometry(10, 12, 64);
  }

  const material = useRef<THREE.MeshBasicMaterial>(null);
  if (!material.current) {
    material.current = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }

  return (
    <mesh
      ref={ringRef}
      geometry={geometry.current}
      material={material.current}
      position={position}
      scale={scale}
      rotation-x={-Math.PI / 2}
    />
  );
}

// Scan line effect
function ScanLine({ position, color, height }: { 
  position: THREE.Vector3; 
  color: string; 
  height: number 
}) {
  const lineRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (lineRef.current) {
      const time = state.clock.getElapsedTime() * 2;
      lineRef.current.position.y = position.y + (Math.sin(time) * 0.5 + 0.5) * height;
      const mat = lineRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.5 + Math.sin(time * 4) * 0.3;
    }
  });

  const geometry = useRef<THREE.PlaneGeometry>(null);
  if (!geometry.current) {
    geometry.current = new THREE.PlaneGeometry(25, 0.5);
  }

  const material = useRef<THREE.MeshBasicMaterial>(null);
  if (!material.current) {
    material.current = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }

  return (
    <mesh
      ref={lineRef}
      geometry={geometry.current}
      material={material.current}
      position={position}
      rotation-x={-Math.PI / 2}
    />
  );
}

// Building hologram on hover
export function BuildingHologram({ building, onClose }: { 
  building: BuildingData | null; 
  onClose: () => void 
}) {
  if (!building) return null;
  
  const color = building.status === "emergency" ? "#ef4444" : building.status === "open" ? "#22c55e" : "#f59e0b";
  const position = new THREE.Vector3(
    (building.position[0] - 36.82) * 100000,
    building.height,
    (building.position[1] + 1.29) * 100000
  );

  return (
    <group position={position}>
      <HologramRing position={new THREE.Vector3(0, 0, 0)} color={color} scale={1} />
      <HologramRing position={new THREE.Vector3(0, building.height * 0.5, 0)} color={color} scale={0.7} />
      <HologramRing position={new THREE.Vector3(0, building.height, 0)} color={color} scale={0.5} />
      <ScanLine position={new THREE.Vector3(0, 0, 0)} color={color} height={building.height} />
      <HologramParticles position={new THREE.Vector3(0, building.height * 0.5, 0)} color={color} intensity={1} />
    </group>
  );
}

// Holographic info card using HTML overlay
interface HolographicCardProps {
  building: BuildingData | null;
  screenPosition: { x: number; y: number } | null;
  onClose: () => void;
}

export function HolographicCard({ building, screenPosition, onClose }: HolographicCardProps) {
  if (!building || !screenPosition) return null;

  const color = building.status === "emergency" ? "#ef4444" : building.status === "open" ? "#22c55e" : "#f59e0b";

  return (
    <AnimatePresence>
      <motion.div
        key={building.id}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed z-50 pointer-events-none"
        style={{
          left: screenPosition.x + 20,
          top: screenPosition.y - 200,
          transform: "translateX(0) translateY(0)"
        }}
      >
        <div 
          className="relative w-80 rounded-2xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-2xl bg-black/50"
          style={{ 
            boxShadow: `0 0 40px ${color}44, 0 0 80px ${color}22`,
            borderColor: color + "66"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/[0.02] pointer-events-none" />
          
          {/* Header */}
          <div className="relative p-4 pb-2 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{building.type === "Convention Centre" ? "🏛️" : building.type === "Government Office" ? "🏢" : building.type === "Healthcare HQ" ? "🏥" : "🏦"}</span>
                <span className="text-xs text-white/40 uppercase tracking-widest">{building.type}</span>
              </div>
              <div className="font-semibold text-white text-lg">{building.name}</div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white/90 transition-all text-sm"
            >
              ✕
            </button>
          </div>

          {/* Status */}
          <div className="relative px-4 pb-2 flex items-center gap-3">
            <motion.div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: color }}
              animate={{ boxShadow: `0 0 8px ${color}, 0 0 16px ${color}` }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-sm text-white/80 capitalize">{building.status}</span>
            {building.visitors && (
              <span className="text-xs text-white/50 ml-auto">👥 {building.visitors.toLocaleString()}</span>
            )}
          </div>

          {/* Events */}
          {building.events && building.events.length > 0 && (
            <div className="relative px-4 pb-3 border-t border-white/10">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Today's Events</div>
              <div className="space-y-1">
                {building.events.map((event, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-2 text-sm text-white/80"
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                    <span>{event}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts */}
          {building.alerts && building.alerts.length > 0 && (
            <div className="relative px-4 pb-4 border-t border-white/10">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Active Alerts</div>
              <div className="space-y-1">
                {building.alerts.map((alert, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-2 text-sm text-amber-300 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20"
                  >
                    <span className="text-lg">⚠️</span>
                    <span>{alert}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="relative px-4 py-3 border-t border-white/10 flex gap-2">
            <button className="flex-1 px-3 py-2 text-xs rounded-xl bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all">
              Details
            </button>
            <button className="flex-1 px-3 py-2 text-xs rounded-xl bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all">
              Navigate
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Main Three.js scene for holograms
interface HologramSceneProps {
  hoveredBuilding: BuildingData | null;
  onHoverBuilding: (building: BuildingData | null) => void;
}

export function HologramScene({ hoveredBuilding, onHoverBuilding }: HologramSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  return (
    <Canvas
      ref={canvasRef}
      camera={{ position: [0, 100, 200], fov: 50 }}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 10 }}
      gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false }}
    >
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#0a0a14", 50, 500]} />
      
      {/* Ambient light */}
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight position={[100, 200, 100]} intensity={1} color="#ffffff" />
      <pointLight position={[0, 100, 0]} intensity={2} color="#6366f1" distance={500} decay={2} />
      
      {/* Building holograms */}
      {BUILDINGS.map((building) => (
        <BuildingHologram
          key={building.id}
          building={hoveredBuilding?.id === building.id ? building : null}
          onClose={() => onHoverBuilding(null)}
        />
      ))}
    </Canvas>
  );
}

// Export the Three.js components
export { BUILDINGS };