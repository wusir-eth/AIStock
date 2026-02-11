'use client';

import { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { LoopMonitor } from '@/components/LoopMonitor';
import { DebateBoard } from '@/components/DebateBoard';
import { ProfitCurve } from '@/components/ProfitCurve';
import { MarketMonitor } from '@/components/MarketMonitor';

export default function HomePage() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-sky-50 p-4">
        <div className="max-w-md w-full">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl mb-4 shadow-lg">
              <span className="text-3xl">🤖</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              AgentConsensus
            </h1>
            <p className="text-slate-500">AC 30m 高频博弈舱</p>
            <p className="text-sm text-slate-400 mt-2">
              基于 A2A 协议的多 AI 节点对抗式投资决策系统
            </p>
          </div>

          {/* Login Card */}
          <div className="card bg-white/80 backdrop-blur-sm p-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">登录系统</h2>
            <p className="text-sm text-slate-500 mb-6">
              使用 SecondMe 账号登录，体验 AI 聚众决策
            </p>

            <button
              onClick={() => signIn('secondme')}
              className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              SecondMe 登录
            </button>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-400 text-center">
                登录即表示您同意我们的服务条款和隐私政策
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <span className="text-lg">🎯</span>
              </div>
              <div className="text-xs font-medium text-slate-700">激进派</div>
              <div className="text-[10px] text-slate-400">追逐妖股</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <span className="text-lg">🛡️</span>
              </div>
              <div className="text-xs font-medium text-slate-700">稳健派</div>
              <div className="text-[10px] text-slate-400">风险厌恶</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center mx-auto mb-2">
                <span className="text-lg">🔍</span>
              </div>
              <div className="text-xs font-medium text-slate-700">哨兵</div>
              <div className="text-[10px] text-slate-400">质疑一切</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  AgentConsensus
                </h1>
                <p className="text-xs text-slate-400">AC 30m 高频博弈舱</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-slate-700">
                  {session.user?.name || '用户'}
                </div>
                <div className="text-xs text-slate-400">SecondMe 已连接</div>
              </div>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                退出
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Loop Monitor & Profit */}
          <div className="space-y-6">
            <LoopMonitor />
            <ProfitCurve />
          </div>

          {/* Center Column - Debate Board */}
          <div className="lg:col-span-1">
            <div className="h-full">
              <DebateBoard className="h-full" />
            </div>
          </div>

          {/* Right Column - Market Monitor */}
          <div>
            <MarketMonitor />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div>
              <span className="inline-flex items-center gap-1.5 mr-4">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                系统运行正常
              </span>
              <span>上次更新: {new Date().toLocaleTimeString('zh-CN')}</span>
            </div>
            <div>AgentConsensus v0.1.0</div>
          </div>
        </div>
      </main>
    </div>
  );
}
