'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface ProfitCurveProps {
  className?: string;
}

// Mock data for demo
const generateData = () => {
  const data = [];
  let cumulativeReturn = 0;
  for (let i = 1; i <= 20; i++) {
    const returnRate = (Math.random() - 0.4) * 8;
    cumulativeReturn += returnRate;
    data.push({
      round: i,
      return: Number(returnRate.toFixed(2)),
      cumulative: Number(cumulativeReturn.toFixed(2)),
    });
  }
  return data;
};

export function ProfitCurve({ className }: ProfitCurveProps) {
  const [data] = useState(generateData());

  const stats = useMemo(() => {
    const totalRounds = data.length;
    const winningRounds = data.filter((d) => d.return > 0).length;
    const winRate = (winningRounds / totalRounds) * 100;
    const totalReturn = data[data.length - 1].cumulative;
    const avgReturn = data.reduce((sum, d) => sum + d.return, 0) / totalRounds;

    return { winRate, totalReturn, avgReturn, totalRounds };
  }, [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload) {
      return (
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-3">
          <div className="text-xs text-slate-500">第 {payload.round} 轮</div>
          <div className={cn(
            'text-sm font-medium',
            payload.return >= 0 ? 'text-green-600' : 'text-red-600'
          )}>
            {payload.return >= 0 ? '+' : ''}{payload.return}{'%'}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            累计: {payload.cumulative >= 0 ? '+' : ''}{payload.cumulative}{'%'}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn('card', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            收益曲线
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">历史表现统计</p>
        </div>
        <div className="text-right">
          <div className={cn(
            'text-2xl font-semibold tabular-nums',
            stats.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
          )}>
            {stats.totalReturn >= 0 ? '+' : ''}{stats.totalReturn}{'%'}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">累计收益</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">胜率</div>
          <div className="text-lg font-semibold text-slate-900 tabular-nums" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {stats.winRate.toFixed(0)}{'%'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {Math.round(stats.winRate * stats.totalRounds / 100)} / {stats.totalRounds} 轮
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">平均收益</div>
          <div className={cn(
            'text-lg font-semibold tabular-nums',
            stats.avgReturn >= 0 ? 'text-emerald-600' : 'text-red-600'
          )}>
            {stats.avgReturn >= 0 ? '+' : ''}{stats.avgReturn.toFixed(2)}{'%'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">每轮平均</div>
        </div>

        <div className="bg-slate-50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">总轮次</div>
          <div className="text-lg font-semibold text-slate-900 tabular-nums" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {stats.totalRounds}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">已完成</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="round"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              tickFormatter={(value) => `#${value}`}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              tickFormatter={(value) => `${value}%`}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="#0ea5e9"
              strokeWidth={2}
              fill="url(#colorPositive)"
              dot={false}
              activeDot={{ r: 4, fill: '#0ea5e9' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-200">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-0.5 bg-sky-500 rounded-full" />
          <span className="text-xs text-slate-500">累计收益</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-slate-500">盈利轮次</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-xs text-slate-500">亏损轮次</span>
        </div>
      </div>
    </div>
  );
}
