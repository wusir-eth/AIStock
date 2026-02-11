// Agent types
export interface Agent {
  id: string;
  name: string;
  role: '激进派' | '稳健派' | '哨兵' | 'SecondMe AI-1' | 'SecondMe AI-2';
  style: string;
  source: 'local' | 'secondme';
  secondMeId?: string;
  weight: number;
}

export interface Argument {
  id: string;
  debateId: string;
  agentId: string;
  content: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  stock: string;
  confidence: number;
  createdAt: Date;
  agent?: Agent;
}

export interface Vote {
  id: string;
  debateId: string;
  agentId: string;
  stock: string;
  weight: number;
  reason?: string;
  agent?: Agent;
}

export interface Debate {
  id: string;
  round: number;
  status: 'sensing' | 'debating' | 'trading' | 'reviewing';
  startedAt: Date;
  completedAt?: Date;
  targetStock?: string;
  entryPrice?: number;
  targetPrice?: number;
  stopLoss?: number;
  actualReturn?: number;
  arguments?: Argument[];
  votes?: Vote[];
}

export interface AgentPerformance {
  id: string;
  agentId: string;
  debateId: string;
  correct: boolean;
  returnRate?: number;
  weightChange: number;
}

// Loop phase types
export type LoopPhase = 'sensing' | 'debating' | 'trading' | 'reviewing';

export interface LoopProgress {
  phase: LoopPhase;
  currentMinute: number;
  totalMinutes: number;
  progressPercent: number;
  remainingTime: number;
}

// Stock data types
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  turnover: number;
}

export interface MarketHotStock {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  volume: number;
  turnoverRate: number;
  reason: string;
}
