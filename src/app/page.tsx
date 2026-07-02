"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { locations, type Location } from "@/components/locations";
import GlassPanel from "@/components/GlassPanel";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  return (
    <main className="relative w-full h-screen bg-black overflow-hidden">
      <MapView
        locations={locations}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
      />
      <GlassPanel
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />
    </main>
  );
}
