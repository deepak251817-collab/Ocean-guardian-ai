// src/components/map/OceanMap.jsx

import { useEffect, useRef, useState, useCallback } from "react";
import { mapMarkers } from "../../data/mockData";
import OceanDetailsDrawer from "../drawer/OceanDetailsDrawer";
import ErrorState from "../ui/ErrorState";

const categories = ["All", "Pollution", "Biodiversity", "Coral Reef", "Water Quality"];

export default function OceanMap() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isError, setIsError] = useState(false);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const leafletRef = useRef(null);

  const filteredMarkers = selectedCategory === "All"
    ? mapMarkers
    : mapMarkers.filter((m) => m.category === selectedCategory);

  const renderMarkers = useCallback(() => {
    const L = leafletRef.current;
    if (!L || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();

    const statusColors = {
      healthy: "#2dd4bf",
      warning: "#fbbf24",
      critical: "#f87171",
    };

    filteredMarkers.forEach((marker) => {
      const color = statusColors[marker.status] || "#06b6d4";

      const icon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div style="position:relative;width:32px;height:32px;cursor:pointer;" aria-label="${marker.label}">
            <div style="
              position:absolute;inset:0;
              border-radius:50%;
              background:${color}33;
              border:1.5px solid ${color}88;
              animation:pulseGlow 2s ease-in-out infinite;
            "></div>
            <div style="
              position:absolute;top:50%;left:50%;
              transform:translate(-50%,-50%);
              width:12px;height:12px;
              border-radius:50%;
              background:${color};
              box-shadow:0 0 12px ${color};
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker([marker.lat, marker.lng], { icon })
        .addTo(layerGroupRef.current)
        .on("click", () => {
          setSelectedMarker(marker);
          setIsDrawerOpen(true);
        });
    });
  }, [filteredMarkers]);

  // Initialise map
  useEffect(() => {
    import("leaflet")
      .then((L) => {
        leafletRef.current = L.default;
        if (mapInstanceRef.current || !mapRef.current) return;

        const map = L.default.map(mapRef.current, {
          center: [10, 0],
          zoom: 2,
          zoomControl: true,
          attributionControl: false,
          maxBounds: [[-90, -200], [90, 200]],
          minZoom: 1,
          maxZoom: 8,
        });

        L.default.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          { attribution: "" }
        ).addTo(map);

        layerGroupRef.current = L.default.layerGroup().addTo(map);
        mapInstanceRef.current = map;

        renderMarkers();
      })
      .catch(() => {
        setIsError(true);
      });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [renderMarkers]);

  // Update markers when filter changes
  useEffect(() => {
    if (mapInstanceRef.current && leafletRef.current && layerGroupRef.current) {
      renderMarkers();
    }
  }, [renderMarkers]);

  const handleRetry = () => {
    setIsError(false);
    if (mapInstanceRef.current && leafletRef.current) {
      renderMarkers();
    }
  };

  if (isError) {
    return (
      <ErrorState
        title="Map Tile Feed Error"
        description="Could not load satellite network tiles for ocean markers."
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Filter chips & legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 pt-4 pb-3 border-b border-ocean-800/40">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none" role="group" aria-label="Map filter categories">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={isActive}
                aria-label={`Filter by ${cat}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-ocean-400/20 text-ocean-300 border border-ocean-300/40 shadow-glow-sm"
                    : "glass-light text-slate-400 hover:text-slate-200 hover:bg-ocean-800/40 border border-ocean-800/40"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {[
            { status: "healthy", label: "Healthy", color: "bg-teal-400" },
            { status: "warning", label: "Warning", color: "bg-amber-400" },
            { status: "critical", label: "Critical", color: "bg-red-400" },
          ].map(({ status, label, color }) => (
            <div key={status} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${color} animate-pulse-slow`} />
              <span className="text-xs text-slate-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={mapRef}
        className="flex-1 rounded-b-2xl overflow-hidden"
        style={{ minHeight: 340 }}
        aria-label="Interactive ocean monitoring map"
        role="region"
      />

      {/* Drawer */}
      <OceanDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        data={selectedMarker}
      />
    </div>
  );
}
