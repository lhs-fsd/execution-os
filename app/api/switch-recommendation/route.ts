import { NextRequest, NextResponse } from 'next/server';
import { inMemoryStore } from '@/lib/supabase';
import { switchRecommendation } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { userId, newRecommendation } = data;

    if (!userId || !newRecommendation) {
      return NextResponse.json(
        { success: false, error: 'User ID and new recommendation are required' },
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

    // Find the interview data for this user
    let interviewData = null;
    const interviewsArray = Array.from(inMemoryStore.interviews.values());
    for (const interview of interviewsArray) {
      if (interview.user_id === userId) {
        interviewData = interview;
        break;
      }
    }

    // Get the new recommendation with reasoning
    const result = await switchRecommendation(
      userId,
      interviewData,
      user.ai_recommendation
    );

    // Update user with new recommendation
    user.ai_recommendation = result.recommendation;
    inMemoryStore.users.set(userId, user);

    return NextResponse.json({
      success: true,
      recommendation: result.recommendation,
      reasoning: result.reasoning,
    });
  } catch (error) {
    console.error('Error in switch-recommendation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to switch recommendation' },
      { status: 500 }
    );
  }
}