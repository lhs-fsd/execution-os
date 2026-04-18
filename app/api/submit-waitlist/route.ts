import { NextRequest, NextResponse } from 'next/server';
import { saveWaitlistEntry, inMemoryStore } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      userId,
      selectedPlan,
      recommendedPlan,
      budgetTier,
      executionScore,
      fullName,
      email,
      phone,
    } = data;

    if (!userId || !selectedPlan || !fullName || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Get user for additional context
    const user = inMemoryStore.users.get(userId);
    
    // Generate final AI reasoning based on the selection
    let finalAiReasoning = '';
    
    if (selectedPlan === recommendedPlan) {
      finalAiReasoning = `This selection aligns with our AI recommendation based on your budget tier (${budgetTier}) and execution score (${executionScore}). The ${selectedPlan === 'premium' ? 'Premium ExecutionOS' : 'Blueprint Plan'} is optimally suited to address your specific execution challenges.`;
    } else {
      finalAiReasoning = `You've chosen to override our recommendation. Despite your ${budgetTier} budget and score of ${executionScore}, you've selected the ${selectedPlan === 'premium' ? 'Premium ExecutionOS' : 'Blueprint Plan'}. This choice reflects your personal preference and assessment of your needs.`;
    }

    // Save waitlist entry
    const entry = await saveWaitlistEntry({
      user_id: userId,
      selected_plan: selectedPlan,
      recommended_plan: recommendedPlan,
      budget_tier: budgetTier,
      execution_score: executionScore,
      final_ai_reasoning: finalAiReasoning,
    });

    // Update user with full name if not set
    if (user) {
      user.full_name = fullName;
      user.email = email;
      user.phone = phone;
      inMemoryStore.users.set(userId, user);
    }

    return NextResponse.json({
      success: true,
      entryId: entry.id,
      reasoning: finalAiReasoning,
    });
  } catch (error) {
    console.error('Error in submit-waitlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit to waitlist' },
      { status: 500 }
    );
  }
}