import { useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import { useTheme } from "../../context/ThemeContext";

const STATUS_COLORS = {
  healthy: "#2dd4bf",
  warning: "#fbbf24",
  critical: "#f87171",
};

function clampScore(value) {
  const parsed = Number.parseInt(String(value).replace(/[^0-9]/g, ""), 10);
  if (Number.isNaN(parsed)) return 72;
  return Math.max(0, Math.min(100, parsed));
}

export default function OceanGlobe({ markers = [], selectedRegion, onSelectRegion }) {
  const globeRef = useRef(null);
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { theme } = useTheme();

  const selectedKey = selectedRegion?.id ?? null;

  const pointsData = useMemo(() => {
    return markers.map((marker) => ({
      ...marker,
      score: clampScore(marker.healthScore),
      isSelected: marker.id === selectedKey,
    }));
  }, [markers, selectedKey]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      setSize({
        width: Math.max(320, Math.floor(rect.width)),
        height: Math.max(360, Math.floor(rect.height)),
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || !selectedRegion) return;

    globe.pointOfView(
      {
        lat: selectedRegion.lat,
        lng: selectedRegion.lng,
        altitude: 1.65,
      },
      900
    );
  }, [selectedRegion]);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
    controls.enableZoom = true;
    controls.enablePan = false;
  }, []);

  const pointColor = (point) => {
    if (point.isSelected) return "#ffffff";
    return STATUS_COLORS[point.status] || "#06b6d4";
  };

  const pointRadius = (point) => (point.isSelected ? 0.38 : 0.22 + point.score / 300);

  const pointLabel = (point) => `
    <div style="
      padding:10px 12px;
      border-radius:14px;
      background:rgba(7, 13, 27, 0.92);
      border:1px solid rgba(125, 211, 252, 0.28);
      color:#e2e8f0;
      max-width:220px;
      box-shadow:0 12px 30px rgba(0,0,0,0.35);
    ">
      <div style="font-size:12px;font-weight:700;color:#ffffff;margin-bottom:4px;">${point.label}</div>
      <div style="font-size:10px;opacity:0.85;margin-bottom:4px;">${point.location || point.category || "Ocean region"}</div>
      <div style="font-size:10px;color:${point.isSelected ? "#ffffff" : STATUS_COLORS[point.status] || "#06b6d4"};font-weight:700;">Health ${point.healthScore}</div>
    </div>
  `;

  return (
    <div ref={containerRef} className={`relative h-full min-h-[380px] rounded-b-2xl overflow-hidden ${theme === "light" ? "bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100" : "bg-[#04111f]"}`}>
      <div className={`absolute top-4 left-4 z-10 max-w-[280px] border rounded-2xl px-3 py-2 backdrop-blur-xl ${theme === "light" ? "bg-white/90 border-cyan-200/70 shadow-lg shadow-cyan-100/30" : "glass-light border border-ocean-400/15"}`}>
        <p className={`text-[11px] font-semibold uppercase tracking-widest ${theme === "light" ? "text-cyan-700" : "text-ocean-300"}`}>Ocean Digital Twin</p>
        <p className={`text-xs mt-1 ${theme === "light" ? "text-slate-700" : "text-slate-400"}`}>
          Click a region to focus the dashboard and inspect its station metrics.
        </p>
      </div>

      <Globe
        ref={globeRef}
        width={size.width}
        height={size.height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl={theme === "light" ? "https://unpkg.com/three-globe/example/img/earth-day.jpg" : "https://unpkg.com/three-globe/example/img/earth-night.jpg"}
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        showAtmosphere
        atmosphereColor="#5eead4"
        atmosphereAltitude={0.2}
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.03}
        pointRadius={pointRadius}
        pointColor={pointColor}
        pointLabel={pointLabel}
        onPointClick={(point) => onSelectRegion?.(point)}
        onGlobeClick={() => onSelectRegion?.(null)}
      />

      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pointer-events-none">
        <div className={`rounded-2xl px-3 py-2 border pointer-events-auto ${theme === "light" ? "bg-white/92 border-cyan-200/70 shadow-lg shadow-cyan-100/30" : "glass border-ocean-800/50"}`}>
          <p className={`text-[10px] uppercase tracking-widest font-semibold ${theme === "light" ? "text-slate-500" : "text-slate-500"}`}>Selected region</p>
          <p className={`text-sm font-semibold mt-0.5 ${theme === "light" ? "text-slate-900" : "text-white"}`}>
            {selectedRegion?.label || "Global view"}
          </p>
          <p className={`text-[11px] ${theme === "light" ? "text-slate-700" : "text-slate-400"}`}>
            {selectedRegion?.location || "Choose a hotspot to update the dashboard"}
          </p>
        </div>

        {selectedRegion && (
          <button
            type="button"
            onClick={() => onSelectRegion?.(null)}
            className={`pointer-events-auto self-start sm:self-auto px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${theme === "light" ? "text-slate-700 bg-white/90 border-cyan-200/70 hover:border-cyan-400 hover:text-slate-900" : "text-slate-200 border-ocean-800/60 bg-ocean-900/60 hover:border-ocean-300/40 hover:text-white"}`}
          >
            Clear region focus
          </button>
        )}
      </div>
    </div>
  );
}
