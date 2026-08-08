import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Activity } from 'lucide-react';
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
  const defaultLabels = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  const chartData = {
    labels: data?.labels || defaultLabels,
    datasets: [
      {
        label: 'Brute Force SSH/RDP',
        data: data?.datasets?.[0]?.data || [12, 19, 3, 5, 2, 20, 35, 42, 28, 15, 10, 8],
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.15)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'SQL Injection Attacks',
        data: data?.datasets?.[1]?.data || [1, 5, 10, 2, 0, 4, 12, 18, 9, 4, 2, 1],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Port Scan Sweeps',
        data: data?.datasets?.[2]?.data || [45, 60, 52, 30, 25, 40, 75, 90, 110, 85, 60, 45],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true
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
          font: { size: 11, family: 'Inter' }
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#38bdf8',
        bodyColor: '#f8fafc',
        borderColor: '#334155',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#64748b', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#64748b', font: { size: 10 } }
      }
    }
  };

  return (
    <GlassCard className="h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Adversary Attack Velocity Timeline</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">24H Real-Time Stream</span>
      </div>

      <div className="h-64 w-full">
        <Line data={chartData} options={options} />
      </div>
    </GlassCard>
  );
};
