import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { secondMeClient } from '@/lib/secondme';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    secondMeClient.setAccessToken(session.user.accessToken);
    const userId = (session.user as any).secondMeId || session.user.id;

    const notes = await secondMeClient.getNotes(userId);

    return NextResponse.json({ notes });
  } catch (error) {
    console.error('SecondMe notes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes from SecondMe' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content } = await request.json();

    secondMeClient.setAccessToken(session.user.accessToken);
    const userId = (session.user as any).secondMeId || session.user.id;

    const noteId = await secondMeClient.saveNote(userId, title, content);

    return NextResponse.json({ id: noteId });
  } catch (error) {
    console.error('SecondMe save note error:', error);
    return NextResponse.json(
      { error: 'Failed to save note to SecondMe' },
      { status: 500 }
    );
  }
}
