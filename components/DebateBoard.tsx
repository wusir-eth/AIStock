'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Argument, Agent } from '@/types';

interface DebateBoardProps {
  className?: string;
}

// Agent configurations
const AGENTS: Agent[] = [
  {
    id: 'agent-1',
    name: '激进派',
    role: '激进派',
    style: '追逐妖股',
    source: 'local',
    weight: 1.0,
  },
  {
    id: 'agent-2',
    name: '稳健派',
    role: '稳健派',
    style: '风险厌恶',
    source: 'local',
    weight: 1.0,
  },
  {
    id: 'agent-3',
    name: '哨兵',
    role: '哨兵',
    style: '质疑一切',
    source: 'local',
    weight: 1.0,
  },
  {
    id: 'agent-4',
    name: 'SecondMe AI-1',
    role: 'SecondMe AI-1',
    style: '自主决策',
    source: 'secondme',
    weight: 1.0,
  },
  {
    id: 'agent-5',
    name: 'SecondMe AI-2',
    role: 'SecondMe AI-2',
    style: '自主决策',
    source: 'secondme',
    weight: 1.0,
  },
];

// Mock arguments for demo
const MOCK_ARGUMENTS: Argument[] = [
  {
    id: 'arg-1',
    debateId: 'demo',
    agentId: 'agent-1',
    content: '检测到 STOCK123 换手率达到 15.2%，量比 3.2，即将突破前高。建议关注入场时机。',
    sentiment: 'bullish',
    stock: 'STOCK123',
    confidence: 0.85,
    createdAt: new Date(Date.now() - 120000),
    agent: AGENTS[0],
  },
  {
    id: 'arg-2',
    debateId: 'demo',
    agentId: 'agent-2',
    content: '当前市场波动较大，建议等待回踩 20 日均线后再做决策。STOCK456 支撑位在 28.50。',
    sentiment: 'neutral',
    stock: 'STOCK456',
    confidence: 0.72,
    createdAt: new Date(Date.now() - 90000),
    agent: AGENTS[1],
  },
  {
    id: 'arg-3',
    debateId: 'demo',
    agentId: 'agent-3',
    content: '警告！STOCK789 大单流出明显，可能是主力出货。建议回避，当前存在诱多风险。',
    sentiment: 'bearish',
    stock: 'STOCK789',
    confidence: 0.91,
    createdAt: new Date(Date.now() - 60000),
    agent: AGENTS[2],
  },
];

const AGENT_COLORS: Record<string, string> = {
  'agent-1': 'bg-orange-500',
  'agent-2': 'bg-blue-500',
  'agent-3': 'bg-slate-700',
  'agent-4': 'bg-sky-600',
  'agent-5': 'bg-sky-600',
};

const AGENT_AVATARS: Record<string, string> = {
  'agent-1': '🎯',
  'agent-2': '🛡️',
  'agent-3': '🔍',
  'agent-4': '🤖',
  'agent-5': '🤖',
};

export function DebateBoard({ className }: DebateBoardProps) {
  const [argList, setArgList] = useState<Argument[]>(MOCK_ARGUMENTS);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new arguments arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [argList]);

  // Simulate new arguments coming in
  useEffect(() => {
    const interval = setInterval(() => {
      const randomAgent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
      const stocks = ['STOCK001', 'STOCK002', 'STOCK003', 'STOCK004'];
      const sentiments: ('bullish' | 'bearish' | 'neutral')[] = ['bullish', 'bearish', 'neutral'];

      const newArg: Argument = {
        id: `arg-${Date.now()}`,
        debateId: 'demo',
        agentId: randomAgent.id,
        content: `作为${randomAgent.name}，我认为 ${stocks[Math.floor(Math.random() * stocks.length)]} ${Math.random() > 0.5 ? '值得关注' : '存在风险'}...`,
        sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
        stock: stocks[Math.floor(Math.random() * stocks.length)],
        confidence: Math.random() * 0.4 + 0.5,
        createdAt: new Date(),
        agent: randomAgent,
      };

      setArgList((prev) => [...prev, newArg]);
    }, 8000); // New argument every 8 seconds for demo

    return () => clearInterval(interval);
  }, []);

  const getSentimentIcon = (sentiment: Argument['sentiment']) => {
    switch (sentiment) {
      case 'bullish':
        return <span className="text-green-500">▲</span>;
      case 'bearish':
        return <span className="text-red-500">▼</span>;
      default:
        return <span className="text-slate-400">◆</span>;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return '刚刚';
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={cn('card flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            AI 辩论看板
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">实时多空博弈</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
          <span className="text-xs text-slate-500">实时</span>
        </div>
      </div>

      {/* Agent Avatars */}
      <div className="flex items-center justify-center gap-3 mb-4 p-3 bg-slate-50 rounded-lg">
        {AGENTS.map((agent) => (
          <div
            key={agent.id}
            className="relative group cursor-pointer"
            onMouseEnter={() => setActiveAgent(agent.id)}
            onMouseLeave={() => setActiveAgent(null)}
          >
            <div
              className={cn(
                'w-11 h-11 rounded-full flex items-center justify-center text-lg transition-all duration-200',
                agent.source === 'secondme'
                  ? 'bg-gradient-to-br from-sky-400 to-sky-600'
                  : AGENT_COLORS[agent.id]
              )}
            >
              {AGENT_AVATARS[agent.id]}
            </div>
            {/* Tooltip */}
            {activeAgent === agent.id && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap z-10 animate-fade-in">
                <div className="font-medium">{agent.name}</div>
                <div className="text-slate-400 text-[10px]">{agent.style}</div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
              </div>
            )}
            {/* Status dot */}
            {agent.source === 'secondme' && (
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-sky-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-[6px] text-white font-bold">SM</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Arguments Stream */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin space-y-3 pr-1"
      >
        {argList.map((arg, index) => (
          <div
            key={arg.id}
            className="animate-slide-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-2.5">
              {/* Agent Avatar */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0',
                  arg.agent?.source === 'secondme'
                    ? 'bg-gradient-to-br from-sky-400 to-sky-600'
                    : AGENT_COLORS[arg.agentId] || 'bg-slate-500'
                )}
              >
                {AGENT_AVATARS[arg.agentId] || '🤖'}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-slate-700">
                    {arg.agent?.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatTime(arg.createdAt)}
                  </span>
                  <div className="flex items-center gap-1 ml-auto">
                    {getSentimentIcon(arg.sentiment)}
                    <span className="text-xs text-slate-500">
                      {Math.round(arg.confidence * 100)}{'%'}
                    </span>
                  </div>
                </div>

                <div className="message-bubble agent">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {arg.content}
                  </p>

                  {/* Stock Tag */}
                  {arg.stock && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="badge badge-primary text-[10px]">
                        {arg.stock}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-medium',
                          arg.sentiment === 'bullish' && 'text-green-600',
                          arg.sentiment === 'bearish' && 'text-red-600',
                          arg.sentiment === 'neutral' && 'text-slate-500'
                        )}
                      >
                        {arg.sentiment === 'bullish' && '看多'}
                        {arg.sentiment === 'bearish' && '看空'}
                        {arg.sentiment === 'neutral' && '中性'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Indicator */}
      <div className="mt-4 pt-3 border-t border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
          <span>AI 正在分析市场数据...</span>
        </div>
      </div>
    </div>
  );
}
