import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { StatisticsData } from '../types';

interface HeatMapProps {
  statistics: StatisticsData;
}

interface MapPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  cases: number;
  severeCases: number;
}

const HeatMap: React.FC<HeatMapProps> = ({ statistics }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Simplified Pakistan map locations for simulation purposes
  const locations: Record<string, { lat: number, lng: number }> = {
    'Swat': { lat: 35.2227, lng: 72.4258 },
    'Mingora': { lat: 34.7795, lng: 72.3612 },
    'Lahore': { lat: 31.5204, lng: 74.3587 },
    'Karachi': { lat: 24.8607, lng: 67.0011 },
    'Islamabad': { lat: 33.6844, lng: 73.0479 },
    'Peshawar': { lat: 34.0151, lng: 71.5249 },
    'Quetta': { lat: 30.1798, lng: 66.9750 },
    'Multan': { lat: 30.1575, lng: 71.5249 },
    'Faisalabad': { lat: 31.4187, lng: 73.0791 },
    'Rawalpindi': { lat: 33.6007, lng: 73.0679 }
  };
  
  useEffect(() => {
    if (!svgRef.current || !statistics.geographicClusters) return;
    
    const width = 600;
    const height = 400;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    // Create map data
    const mapData: MapPoint[] = statistics.geographicClusters.map(cluster => {
      const location = locations[cluster.location] || { lat: 0, lng: 0 };
      return {
        id: cluster.location,
        name: cluster.location,
        lat: location.lat,
        lng: location.lng,
        cases: cluster.count,
        severeCases: cluster.severeCases
      };
    });
    
    // Simple projection for Pakistan
    const projection = d3.geoMercator()
      .center([70, 30])
      .scale(1000)
      .translate([width / 2, height / 2]);
    
    // Draw map background
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#f0f9ff");
    
    // Draw points
    const circles = svg.selectAll("circle")
      .data(mapData)
      .enter()
      .append("circle")
      .attr("cx", d => projection([d.lng, d.lat])[0])
      .attr("cy", d => projection([d.lng, d.lat])[1])
      .attr("r", d => Math.sqrt(d.cases) * 3)
      .attr("fill", d => d.severeCases > d.cases * 0.3 ? "#ef4444" : 
                        d.severeCases > d.cases * 0.15 ? "#f97316" : "#10b981")
      .attr("fill-opacity", 0.7)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1);
    
    // Add labels
    svg.selectAll("text")
      .data(mapData)
      .enter()
      .append("text")
      .attr("x", d => projection([d.lng, d.lat])[0])
      .attr("y", d => projection([d.lng, d.lat])[1] - Math.sqrt(d.cases) * 3 - 5)
      .text(d => d.name)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("fill", "#4b5563");
    
    // Add tooltips
    circles.append("title")
      .text(d => `${d.name}: ${d.cases} cases (${d.severeCases} severe)`);
    
    // Add legend
    const legend = svg.append("g")
      .attr("transform", `translate(20, ${height - 80})`);
    
    // Legend title
    legend.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .text("Case Severity")
      .attr("font-size", "12px")
      .attr("font-weight", "bold");
    
    // Legend items
    const legendItems = [
      { color: "#10b981", label: "Low" },
      { color: "#f97316", label: "Medium" },
      { color: "#ef4444", label: "High" }
    ];
    
    legendItems.forEach((item, i) => {
      legend.append("circle")
        .attr("cx", 10)
        .attr("cy", 20 + i * 20)
        .attr("r", 6)
        .attr("fill", item.color)
        .attr("fill-opacity", 0.7)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1);
      
      legend.append("text")
        .attr("x", 25)
        .attr("y", 24 + i * 20)
        .text(item.label)
        .attr("font-size", "10px");
    });
  }, [statistics]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Geographic Distribution</h3>
      <div className="overflow-x-auto">
        <svg ref={svgRef} width="100%" height="400" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet"></svg>
      </div>
    </div>
  );
};

export default HeatMap;