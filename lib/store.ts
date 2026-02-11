import { create } from 'zustand';
import { Debate, Agent, Argument, LoopPhase } from '@/types';

interface AppState {
  // 当前用户
  user: any | null;
  setUser: (user: any) => void;

  // 当前辩论
  currentDebate: Debate | null;
  setCurrentDebate: (debate: Debate | null) => void;

  // AI Agents
  agents: Agent[];
  setAgents: (agents: Agent[]) => void;

  // 循环进度
  loopPhase: LoopPhase;
  loopMinute: number;
  setLoopPhase: (phase: LoopPhase) => void;
  setLoopMinute: (minute: number) => void;

  // 论点实时更新
  arguments: Argument[];
  setArguments: (args: Argument[]) => void;
  addArgument: (arg: Argument) => void;

  // 收益数据
  profitCurve: { round: number; return: number }[];
  setProfitCurve: (data: { round: number; return: number }[]) => void;
}

export const useStore = create<AppState>((set) => ({
  // 用户
  user: null,
  setUser: (user) => set({ user }),

  // 辩论
  currentDebate: null,
  setCurrentDebate: (debate) => set({ currentDebate: debate }),

  // Agents
  agents: [
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
  ],
  setAgents: (agents) => set({ agents }),

  // 循环
  loopPhase: 'sensing',
  loopMinute: 0,
  setLoopPhase: (phase) => set({ loopPhase: phase }),
  setLoopMinute: (minute) => set({ loopMinute: minute }),

  // 论点
  arguments: [],
  setArguments: (args) => set({ arguments: args }),
  addArgument: (arg) => set((state) => ({ arguments: [...state.arguments, arg] })),

  // 收益
  profitCurve: [],
  setProfitCurve: (data) => set({ profitCurve: data }),
}));
