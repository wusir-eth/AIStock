import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { secondMeClient } from '@/lib/secondme';

// 获取当前辩论状态
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const round = searchParams.get('round');

    const debate = round
      ? await prisma.debate.findFirst({
          where: { round: parseInt(round) },
          include: {
            arguments: {
              include: { agent: true },
              orderBy: { createdAt: 'asc' },
            },
            votes: {
              include: { agent: true },
            },
          },
        })
      : await prisma.debate.findFirst({
          where: { status: { in: ['sensing', 'debating', 'trading'] } },
          orderBy: { startedAt: 'desc' },
          include: {
            arguments: {
              include: { agent: true },
              orderBy: { createdAt: 'asc' },
            },
            votes: {
              include: { agent: true },
            },
          },
        });

    if (!debate) {
      return NextResponse.json({ debate: null });
    }

    return NextResponse.json({ debate });
  } catch (error) {
    console.error('Get debate error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch debate' },
      { status: 500 }
    );
  }
}

// 创建新的辩论轮次
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // 获取最新的轮次号
    const lastDebate = await prisma.debate.findFirst({
      orderBy: { round: 'desc' },
    });

    const newRound = (lastDebate?.round ?? 0) + 1;

    // 创建新辩论
    const debate = await prisma.debate.create({
      data: {
        round: newRound,
        status: 'sensing',
        createdBy: session?.user?.id,
      },
      include: {
        arguments: {
          include: { agent: true },
        },
        votes: {
          include: { agent: true },
        },
      },
    });

    // 触发感知阶段 - 模拟数据
    await triggerSensingPhase(debate.id);

    return NextResponse.json({ debate });
  } catch (error) {
    console.error('Create debate error:', error);
    return NextResponse.json(
      { error: 'Failed to create debate' },
      { status: 500 }
    );
  }
}

// 触发感知阶段（模拟）
async function triggerSensingPhase(debateId: string) {
  // 模拟：2分钟后进入辩论阶段
  setTimeout(async () => {
    await prisma.debate.update({
      where: { id: debateId },
      data: { status: 'debating' },
    });

    // 触发 AI 辩论
    await triggerAgentDebate(debateId);
  }, 2 * 60 * 1000); // 2 分钟
}

// 触发 AI 辩论（模拟）
async function triggerAgentDebate(debateId: string) {
  const agents = await prisma.agent.findMany();

  // 模拟辩论过程
  for (const agent of agents) {
    if (agent.source === 'secondme') {
      // 调用 SecondMe Chat API
      try {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/secondme/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `作为${agent.role}(${agent.style})，请分析当前市场并推荐一只30分钟内有爆发力的股票。`,
            context: { debateId, agentId: agent.id },
          }),
        });
        const data = await response.json();
        // 保存论点
        await prisma.argument.create({
          data: {
            debateId,
            agentId: agent.id,
            content: data.reply,
            sentiment: 'bullish',
            stock: 'TBD',
            confidence: 0.7,
          },
        });
      } catch (error) {
        console.error('SecondMe agent debate error:', error);
      }
    } else {
      // 本地 Agent - 模拟论点
      await prisma.argument.create({
        data: {
          debateId,
          agentId: agent.id,
          content: `作为${agent.role}，我认为当前市场${agent.role === '哨兵' ? '存在较大风险' : '有机会'}...`,
          sentiment: agent.role === '哨兵' ? 'bearish' : 'bullish',
          stock: 'STOCK' + Math.floor(Math.random() * 1000),
          confidence: Math.random() * 0.5 + 0.5,
        },
      });
    }
    // 模拟辩论间隔
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // 8分钟后进入实战阶段
  setTimeout(async () => {
    await prisma.debate.update({
      where: { id: debateId },
      data: { status: 'trading' },
    });
  }, 8 * 60 * 1000);
}
