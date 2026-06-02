import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { cloudMetricsByYear } from "./cloudData";

const METRICS = [
  { key: "revenue", label: "Revenue Index" }, 
  { key: "marketShare", label: "Market Share %" },
  { key: "regions", label: "Regions Index" },
  { key: "services", label: "Services Index" },
  { key: "customers", label: "Customers Index" },
  { key: "aiMl", label: "AI & ML Index" },
  { key: "devTools", label: "Dev Tools Index" }
];

const PROVIDERS = [
  { prefix: "aws", name: "AWS", color: "#ff9900" },
  { prefix: "azure", name: "Azure", color: "#0078d4" },
  { prefix: "gcp", name: "GCP", color: "#ea4335" }
];

// Beautiful Dynamic Tooltip Pop-up Component
const CustomTitleTooltip = ({ active, payload, label, viewMode, activeKey }) => {
  if (!active || !payload || !payload.length) return null;

  // Filter out any empty lines that are packed into the data array
  const visiblePayload = payload.filter(p => p.value !== undefined && p.value !== null && p.name !== "HIDDEN");
  if (!visiblePayload.length) return null;

  const titleHeader = viewMode === "metric"
    ? `Metric: ${METRICS.find(m => m.key === activeKey)?.label}`
    : `Platform Profile: ${PROVIDERS.find(p => p.prefix === activeKey)?.name} (All Metrics)`;

  return (
    <div style={{
      backgroundColor: "rgba(255, 255, 255, 0.98)",
      border: "1px solid #b5b5b5",
      padding: "12px",
      borderRadius: "8px",
      boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
      fontFamily: "system-ui, sans-serif",
      minWidth: "250px"
    }}>
      <div style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "4px", color: "#111" }}>
        📅 Year: {label}
      </div>
      <div style={{ fontSize: "11px", color: "#666", marginBottom: "8px", fontWeight: "bold" }}>
        {titleHeader}
      </div>
      <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "13px" }}>
        <thead>
          <tr style={{ color: "#777", borderBottom: "1px solid #ddd", textAlign: "left" }}>
            <th style={{ padding: "2px 10px 2px 0" }}>
              {viewMode === "metric" ? "Cloud Provider" : "Index Metric"}
            </th>
            <th style={{ padding: "2px 5px", textAlign: "right" }}>Value</th>
          </tr>
        </thead>
        <tbody>
          {visiblePayload.map((p) => (
            <tr key={p.dataKey} style={{ borderBottom: "1px solid #f5f5f5" }}>
              <td style={{ padding: "6px 10px 6px 0", color: p.color, fontWeight: "bold" }}>
                ■ {p.name}
              </td>
              <td style={{ padding: "6px 5px", textAlign: "right", fontWeight: "bold", color: "#333" }}>
                {p.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function CloudMultiLineChart() {
  const [viewMode, setViewMode] = useState("metric"); 
  const [activeKey, setActiveKey] = useState("revenue"); 

  // 🔥 THE SMOOTH TRANSITION ENGINE: Maps raw data cleanly into 7 permanent visual tracks
  const dynamicChartData = useMemo(() => {
    return cloudMetricsByYear.map((row) => {
      const outputRow = { year: row.year };

      if (viewMode === "metric") {
        // Mode 1: Compare 3 providers on Track 0, 1, 2. Set remaining tracks to equal Track 0 for smooth morphing.
        PROVIDERS.forEach((provider, index) => {
          outputRow[`track_${index}`] = row[`${provider.prefix}_${activeKey}`];
        });
        // Keeps tracks 3-6 aligned with the base data to prevent graph distortion drops
        for (let i = 3; i < 7; i++) {
          outputRow[`track_${i}`] = row[`aws_${activeKey}`];
        }
      } else {
        // Mode 2: Map all 7 metrics for ONE provider across all 7 channels
        METRICS.forEach((metric, index) => {
          outputRow[`track_${index}`] = row[`${activeKey}_${metric.key}`];
        });
      }
      return outputRow;
    });
  }, [viewMode, activeKey]);

  // Dynamically shifts colors, labels, and styles smoothly without breaking DOM keys
  const getTrackConfiguration = (index) => {
    if (viewMode === "metric") {
      if (index < 3) {
        const p = PROVIDERS[index];
        return { name: p.name, color: p.color, dash: "0", opacity: 1 };
      }
      return { name: "HIDDEN", color: "transparent", dash: "0", opacity: 0 };
    } else {
      const m = METRICS[index];
      // Pick a provider brand color palette to style the profile lines beautifully
      const activeProvider = PROVIDERS.find(p => p.prefix === activeKey);
      const colors = ["#ff9900", "#0078d4", "#ea4335", "#2ecc71", "#9b59b6", "#34495e", "#1abc9c"];
      const dashes = ["0", "2 2", "4 4", "6 2", "1 1", "4 1 1 1", "8 2"];
      
      return { 
        name: m.label, 
        color: index === 0 ? activeProvider?.color : colors[index], 
        dash: dashes[index],
        opacity: 1 
      };
    }
  };

  const currentMetricLabel = viewMode === "metric" 
    ? METRICS.find(m => m.key === activeKey)?.label 
    : `${PROVIDERS.find(p => p.prefix === activeKey)?.name} Complete Profile`;

  return (
    <div style={{ width: "100%", fontFamily: "system-ui, sans-serif", padding: "15px", boxSizing: "border-box" }}>
      
      {/* HEADER SECTION */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: "0 0 6px 0", color: "#1a1a1a" }}>Cloud Chart  </h2>
      </div>

      {/* UPPER METRIC FILTER BUTTONS */}
      <div style={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: "10px", 
        marginBottom: "25px",
        backgroundColor: "#f9f9f9",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #e9e9e9"
      }}>
        {METRICS.map((metric) => {
          const isActive = viewMode === "metric" && activeKey === metric.key;
          return (
            <button
              key={metric.key}
              onClick={() => {
                setViewMode("metric");
                setActiveKey(metric.key);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "14px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                border: isActive ? "1px solid #222" : "1px solid #dcdcdc",
                backgroundColor: isActive ? "#222" : "#ffffff",
                color: isActive ? "#ffffff" : "#444",
                boxShadow: isActive ? "0 2px 6px rgba(0,0,0,0.15)" : "0 1px 3px rgba(0,0,0,0.05)",
                transition: "all 0.15s ease-in-out"
              }}
            >
              <span>📈</span> {metric.label}
            </button>
          );
        })}
      </div>

      {/* GRAPH HOUSING BASE */}
      <div style={{ 
        width: "100%", 
        height: 410, 
        backgroundColor: "#fff", 
        border: "1px solid #e2e2e2", 
        borderRadius: "8px", 
        padding: "20px 15px 5px 0" 
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dynamicChartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d7cece" />
            <XAxis dataKey="year" padding={{ left: 30, right: 30 }} tick={{ fill: "#444", fontWeight: 600 }} />
            <YAxis domain={[0, 100]} label={{ value: `${currentMetricLabel} Value`, angle: -90, position: "insideLeft", offset: -5 }} />
            
            {/* Pop-up fires flawlessly since line paths are always healthy and present */}
            <Tooltip content={<CustomTitleTooltip viewMode={viewMode} activeKey={activeKey} />} />
            
            {/* 7 Immutable lines acting as hardware-accelerated morph targets */}
            {[0, 1, 2, 3, 4, 5, 6].map((index) => {
              const config = getTrackConfiguration(index);
              const isVisible = config.name !== "HIDDEN";

              return (
                <Line
                  key={`track_${index}`} // Stable keys ensure flawless up/down animations
                  type="monotone" // Fluid wave curve interpolations
                  dataKey={`track_${index}`}
                  stroke={config.color}
                  strokeDasharray={config.dash}
                  strokeWidth={isVisible ? 3 : 0}
                  
                  // Native animation controller configurations
                  isAnimationActive={true}
                  animationDuration={650}
                  animationEasing="ease-in-out"
                  
                  dot={isVisible ? { r: 4, strokeWidth: 1 } : false}
                  activeDot={isVisible ? { r: 6 } : false}
                  name={config.name}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* LOWER INTERACTIVE CLOUD SEPARATED SPAN BUTTONS */}
      <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginTop: "20px" }}>
        {PROVIDERS.map((provider) => {
          const isActive = viewMode === "provider" && activeKey === provider.prefix;
          return (
            <button
              key={provider.prefix}
              onClick={() => {
                setViewMode("provider");
                setActiveKey(provider.prefix);
              }}
              style={{
                backgroundColor: isActive ? provider.color : "#ffffff",
                padding: "8px 20px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                borderRadius: "20px",
                border: `2px solid ${provider.color}`,
                color: isActive ? "#ffffff" : provider.color,
                boxShadow: isActive ? "0 4px 10px rgba(0,0,0,0.15)" : "0 1px 3px rgba(0,0,0,0.05)",
                transform: isActive ? "scale(1.05)" : "scale(1)",
                transition: "all 0.15s ease-in-out"
              }}
            >
              ☁️ {provider.name} Profile
            </button>
          );
        })}
      </div>
      
    </div>
  );
}