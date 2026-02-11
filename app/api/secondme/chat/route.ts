import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { secondMeClient } from '@/lib/secondme';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, context } = await request.json();

    secondMeClient.setAccessToken(session.user.accessToken);
    const userId = (session.user as any).secondMeId || session.user.id;

    const reply = await secondMeClient.chat(userId, message, context);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('SecondMe chat error:', error);
    return NextResponse.json(
      { error: 'Failed to communicate with SecondMe AI' },
      { status: 500 }
    );
  }
}
