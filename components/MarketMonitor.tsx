'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MarketMonitorProps {
  className?: string;
}

interface HotStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  turnoverRate: number;
  reason: string;
}

// Mock data for demo
const MOCK_HOT_STOCKS: HotStock[] = [
  {
    symbol: 'STK001',
    name: '智能科技',
    price: 28.45,
    change: 2.35,
    changePercent: 9.01,
    volume: '125.6万',
    turnoverRate: 15.2,
    reason: '放量突破',
  },
  {
    symbol: 'STK002',
    name: '新能源股份',
    price: 42.18,
    change: 3.28,
    changePercent: 8.43,
    volume: '89.2万',
    turnoverRate: 12.8,
    reason: '板块龙头',
  },
  {
    symbol: 'STK003',
    name: '半导体材料',
    price: 35.67,
    change: -1.23,
    changePercent: -3.34,
    volume: '203.1万',
    turnoverRate: 18.5,
    reason: '高位震荡',
  },
  {
    symbol: 'STK004',
    name: '生物医药',
    price: 56.89,
    change: 4.56,
    changePercent: 8.72,
    volume: '67.8万',
    turnoverRate: 9.3,
    reason: '利好消息',
  },
  {
    symbol: 'STK005',
    name: '云计算',
    price: 31.25,
    change: 1.87,
    changePercent: 6.37,
    volume: '145.3万',
    turnoverRate: 13.7,
    reason: '资金流入',
  },
];

export function MarketMonitor({ className }: MarketMonitorProps) {
  const [hotStocks, setHotStocks] = useState<HotStock[]>(MOCK_HOT_STOCKS);
  const [targetStock, setTargetStock] = useState<typeof MOCK_HOT_STOCKS[0] | null>(null);
  const [entryPrice, setEntryPrice] = useState<number | null>(null);

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHotStocks((prev) =>
        prev.map((stock) => ({
          ...stock,
          price: stock.price + (Math.random() - 0.5) * 0.2,
          changePercent: stock.changePercent + (Math.random() - 0.5) * 0.1,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Simulate target stock selection
  useEffect(() => {
    const timeout = setTimeout(() => {
      setTargetStock(hotStocks[0]);
      setEntryPrice(hotStocks[0].price);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={cn('card', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            行情监控
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">热门板块与个股</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs text-slate-500">实时</span>
        </div>
      </div>

      {/* Target Stock Card */}
      {targetStock && (
        <div className="bg-gradient-to-r from-sky-50 to-slate-50 rounded-lg p-4 mb-4 border border-sky-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="badge badge-primary">当前目标</span>
              <span className="text-xs text-slate-400">AI 选股结果</span>
            </div>
            <span className="text-xs text-slate-400">
              {new Date().toLocaleTimeString('zh-CN')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {targetStock.symbol}
              </div>
              <div className="text-sm text-slate-500">{targetStock.name}</div>
            </div>
            <div className="text-right">
              <div className={cn(
                'text-xl font-semibold tabular-nums',
                targetStock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {'¥'}{targetStock.price.toFixed(2)}
              </div>
              <div className={cn(
                'text-sm tabular-nums',
                targetStock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {targetStock.changePercent >= 0 ? '+' : ''}{targetStock.changePercent.toFixed(2)}{'%'}
              </div>
            </div>
          </div>

          {/* Price Levels */}
          {entryPrice && (
            <div className="mt-3 pt-3 border-t border-sky-200/50">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[10px] text-slate-400">入场价</div>
                  <div className="text-sm font-medium text-slate-700 tabular-nums">
                    {'¥'}{entryPrice.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">目标价</div>
                  <div className="text-sm font-medium text-green-600 tabular-nums">
                    {'¥'}{(entryPrice * 1.05).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">止损价</div>
                  <div className="text-sm font-medium text-red-600 tabular-nums">
                    {'¥'}{(entryPrice * 0.97).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hot Stocks List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>热门标的</span>
          <span>换手率</span>
          <span className="text-right">涨跌幅</span>
        </div>

        {hotStocks.map((stock, index) => (
          <div
            key={stock.symbol}
            className={cn(
              'flex items-center justify-between py-2.5 px-3 rounded-lg transition-all duration-200',
              'hover:bg-slate-50 cursor-pointer',
              targetStock?.symbol === stock.symbol && 'bg-sky-50 border border-sky-200'
            )}
            onClick={() => {
              setTargetStock(stock);
              setEntryPrice(stock.price);
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-500">
                {index + 1}
              </div>
              <div>
                <div className="text-sm font-medium text-slate-900">{stock.symbol}</div>
                <div className="text-xs text-slate-400">{stock.name}</div>
              </div>
              <span className="badge badge-warning text-[10px]">{stock.reason}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center w-16">
                <div className="text-xs text-slate-400">{stock.turnoverRate.toFixed(1)}{'%'}</div>
              </div>

              <div className={cn(
                'text-right w-20 py-1 px-2 rounded-lg',
                stock.changePercent >= 0 ? 'bg-green-50' : 'bg-red-50'
              )}>
                <div className={cn(
                  'text-sm font-semibold tabular-nums',
                  stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}{'%'}
                </div>
                <div className="text-[10px] text-slate-400 tabular-nums">
                  ¥{stock.price.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
