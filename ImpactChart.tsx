import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ImpactChartProps {
  data: {
    name: string;
    ai: number;
    traditional: number;
  }[];
  dataKey?: string;
}

const ImpactChart: React.FC<ImpactChartProps> = ({ data, dataKey = 'name' }) => {
  return (
    <div className="w-full h-96 bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">AI vs Traditional Diagnosis</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={dataKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="ai" name="AI-assisted" fill="#6366f1" />
          <Bar dataKey="traditional" name="Traditional" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ImpactChart;