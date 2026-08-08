import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Activity, Clock } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AttackTimelineChartProps {
  data?: {
    labels: string[];
    datasets: any[];
  };
}

export const AttackTimelineChart: React.FC<AttackTimelineChartProps> = ({ data }) => {
  const [timeframe, setTimeframe] = useState<'1H' | '6H' | '24H' | '7D'>('24H');

  const defaultLabels = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  const chartData = {
    labels: data?.labels || defaultLabels,
    datasets: [
      {
        label: 'Brute Force SSH/RDP',
        data: data?.datasets?.[0]?.data || [12, 19, 3, 5, 2, 20, 35, 42, 28, 15, 10, 8],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.12)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#06b6d4'
      },
      {
        label: 'SQL Injection Attacks',
        data: data?.datasets?.[1]?.data || [1, 5, 10, 2, 0, 4, 12, 18, 9, 4, 2, 1],
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.12)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#f43f5e'
      },
      {
        label: 'Port Scan Sweeps',
        data: data?.datasets?.[2]?.data || [45, 60, 52, 30, 25, 40, 75, 90, 110, 85, 60, 45],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.08)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#f59e0b'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#94a3b8',
          font: { size: 11, family: 'Inter' },
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#38bdf8',
        bodyColor: '#f8fafc',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.25)' },
        ticks: { color: '#64748b', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(51, 65, 85, 0.25)' },
        ticks: { color: '#64748b', font: { size: 10 } }
      }
    }
  };

  return (
    <GlassCard className="h-full flex flex-col justify-between p-5 border border-slate-800/80">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Adversary Attack Velocity Telemetry</h3>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
          {(['1H', '6H', '24H', '7D'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono transition ${
                timeframe === tf ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full">
        <Line data={chartData} options={options} />
      </div>
    </GlassCard>
  );
};
