import { NextRequest, NextResponse } from 'next/server';
import { getReportByUserId, inMemoryStore } from '@/lib/supabase';

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

    // Find the report for this user
    let report = null;
    for (const r of inMemoryStore.reports.values()) {
      if (r.user_id === userId) {
        report = {
          execution_score: r.execution_score,
          primary_bottleneck: r.primary_bottleneck,
          secondary_bottlenecks: r.secondary_bottlenecks,
          behavioral_pattern: r.behavioral_pattern,
          psychological_root: r.psychological_root,
          risk_level: r.risk_level,
          fix_plan: r.fix_plan,
        };
        break;
      }
    }

    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // Get user for additional context
    const user = inMemoryStore.users.get(userId);

    return NextResponse.json({
      success: true,
      report,
      user,
    });
  } catch (error) {
    console.error('Error in get-report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve report' },
      { status: 500 }
    );
  }
}