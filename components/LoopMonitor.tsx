'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { LoopPhase } from '@/types';

interface LoopMonitorProps {
  className?: string;
}

const PHASES: { key: LoopPhase; label: string; duration: number; color: string }[] = [
  { key: 'sensing', label: '感知', duration: 2, color: 'bg-slate-400' },
  { key: 'debating', label: '博弈', duration: 8, color: 'bg-sky-500' },
  { key: 'trading', label: '实战', duration: 30, color: 'bg-emerald-500' },
  { key: 'reviewing', label: '复盘', duration: 0, color: 'bg-violet-500' },
];

export function LoopMonitor({ className }: LoopMonitorProps) {
  const [currentPhase, setCurrentPhase] = useState<LoopPhase>('sensing');
  const [currentMinute, setCurrentMinute] = useState(0);
  const [round, setRound] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 1;
        const totalMinutes = Math.floor(newTime / 60);

        if (totalMinutes < 2) {
          setCurrentPhase('sensing');
          setCurrentMinute(totalMinutes);
        } else if (totalMinutes < 10) {
          setCurrentPhase('debating');
          setCurrentMinute(totalMinutes);
        } else if (totalMinutes < 40) {
          setCurrentPhase('trading');
          setCurrentMinute(totalMinutes);
        } else {
          setCurrentPhase('reviewing');
          setCurrentMinute(40);
          setRound((r) => r + 1);
          return 0; // Reset for next round
        }
        return newTime;
      });
    }, 1000); // 1 second = 1 second for demo

    return () => clearInterval(interval);
  }, []);

  const phaseIndex = PHASES.findIndex((p) => p.key === currentPhase);
  const phaseProgress = phaseIndex >= 0
    ? ((currentMinute - PHASES.slice(0, phaseIndex).reduce((sum, p) => sum + p.duration, 0)) /
        PHASES[phaseIndex].duration) * 100
    : 0;

  const totalProgress = (currentMinute / 40) * 100;
  const remainingSeconds = (40 - currentMinute) * 60 - (elapsedTime % 60);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn('card', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            循环进度
          </h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-semibold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
              第 {round} 轮
            </span>
            <span className="text-sm text-slate-400">/ 40分钟循环</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-semibold text-slate-900 tabular-nums" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {formatTime(remainingSeconds)}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">剩余时间</div>
        </div>
      </div>

      {/* Phase Timeline */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          {PHASES.map((phase, index) => (
            <div key={phase.key} className="flex items-center flex-1">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    phase.color,
                    index < phaseIndex && 'opacity-30',
                    index === phaseIndex && 'opacity-100'
                  )}
                  style={{
                    width: index === phaseIndex ? `${phaseProgress}%` : '100%',
                  }}
                />
              </div>
              {index < PHASES.length - 1 && (
                <div className="w-2 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Phase Labels */}
        <div className="flex items-center justify-between text-xs">
          {PHASES.map((phase) => (
            <div
              key={phase.key}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all duration-300',
                currentPhase === phase.key
                  ? 'bg-slate-100 text-slate-900 font-medium'
                  : 'text-slate-400'
              )}
            >
              <span
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-all duration-300',
                  currentPhase === phase.key
                    ? 'bg-sky-500 animate-pulse'
                    : 'bg-slate-300'
                )}
              />
              <span>{phase.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Phase Details */}
      <div className="bg-slate-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'w-2.5 h-2.5 rounded-full',
                PHASES[phaseIndex]?.color
              )}
            />
            <span className="text-sm font-medium text-slate-700">
              当前阶段: {PHASES[phaseIndex]?.label}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            {currentMinute} / 40 分钟
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              PHASES[phaseIndex]?.color
            )}
            style={{ width: `${totalProgress}%` }}
          />
        </div>

        {/* Phase Description */}
        <div className="mt-3 text-xs text-slate-500">
          {currentPhase === 'sensing' && '正在抓取热门板块、放量个股、社交媒体情绪...'}
          {currentPhase === 'debating' && 'AI Agents 正在进行多空辩论，分析目标标的...'}
          {currentPhase === 'trading' && '模拟/实盘执行中，实时监控股价走势...'}
          {currentPhase === 'reviewing' && '本轮结束，统计胜率并调整 Agent 权重...'}
        </div>
      </div>
    </div>
  );
}
