import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { inMemoryStore } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = inMemoryStore.users.get(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        budget_tier: user.budget_tier,
        execution_score: user.execution_score,
        ai_recommendation: user.ai_recommendation,
      },
    });
  } catch (error) {
    console.error('Error in get-recommendation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve recommendation' },
      { status: 500 }
    );
  }
}
