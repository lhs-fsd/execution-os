import { NextRequest, NextResponse } from 'next/server';
import { saveUser, saveInterview, saveReport, inMemoryStore } from '@/lib/supabase';
import { generateExecutionReport } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      fullName,
      email,
      phone,
      budget,
      budgetTier,
      occupation,
      goals,
      struggles,
      routine,
      inconsistencyReason,
      timeAvailable,
      toolsUsed,
    } = data;

    // Validate required fields
    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Create user
    const user = await saveUser({
      full_name: fullName,
      email,
      phone,
      budget_tier: budgetTier,
      ai_recommendation: '',
      execution_score: 0,
    });

    // Save interview
    await saveInterview({
      user_id: user.id,
      budget,
      budget_tier: budgetTier,
      occupation,
      goals,
      struggles,
      routine,
      inconsistency_reason: inconsistencyReason,
      time_available: timeAvailable,
      tools_used: toolsUsed,
    });

    // Generate AI report
    const reportData = await generateExecutionReport({
      budget,
      budget_tier: budgetTier,
      occupation,
      goals,
      struggles,
      routine,
      inconsistency_reason: inconsistencyReason,
      time_available: timeAvailable,
      tools_used: toolsUsed,
    });

    // Save report
    const report = await saveReport({
      user_id: user.id,
      execution_score: reportData.execution_score,
      primary_bottleneck: reportData.primary_bottleneck,
      secondary_bottlenecks: reportData.secondary_bottlenecks,
      behavioral_pattern: reportData.behavioral_pattern,
      psychological_root: reportData.psychological_root,
      risk_level: reportData.risk_level,
      fix_plan: reportData.fix_plan,
    });

    // Update user with recommendation and score
    const userRecord = inMemoryStore.users.get(user.id);
    if (userRecord) {
      userRecord.execution_score = reportData.execution_score;
      userRecord.ai_recommendation = reportData.ai_recommendation;
      inMemoryStore.users.set(user.id, userRecord);
    }

    // Store report data in memory for the report page to retrieve
    inMemoryStore.reports.set(report.id, {
      ...report,
      ...reportData,
    });

    return NextResponse.json({
      success: true,
      userId: user.id,
      report: {
        ...report,
        ...reportData,
      },
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        budget_tier: user.budget_tier,
        execution_score: reportData.execution_score,
        ai_recommendation: reportData.ai_recommendation,
      },
      recommendation: reportData.ai_recommendation,
    });
  } catch (error) {
    console.error('Error in submit-interview:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process interview' },
      { status: 500 }
    );
  }
}