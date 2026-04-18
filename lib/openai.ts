import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key',
});

export interface ReportData {
  execution_score: number;
  primary_bottleneck: string;
  secondary_bottlenecks: string[];
  behavioral_pattern: string;
  psychological_root: string;
  risk_level: 'low' | 'medium' | 'high';
  fix_plan: string[];
  ai_recommendation: 'blueprint' | 'premium';
}

export async function generateExecutionReport(interviewData: any): Promise<ReportData> {
  // Use demo algorithm (no OpenAI key needed)
  return generateDemoReport(interviewData);
}

// Main algorithm that generates personalized reports based on user input
function generateDemoReport(interviewData: any): ReportData {
  const budget = interviewData.budget_tier || interviewData.budget || 'medium';
  const struggles = interviewData.struggles || '';
  const goals = interviewData.goals || '';
  const routine = interviewData.routine || '';
  const inconsistencyReason = interviewData.inconsistency_reason || '';
  const timeAvailable = interviewData.time_available || '';
  
  // Analyze quality of input
  const strugglesQuality = analyzeTextQuality(struggles);
  const goalsQuality = analyzeTextQuality(goals);
  const inconsistencyQuality = analyzeTextQuality(inconsistencyReason);
  
  // If input is too short or gibberish, flag it
  const totalQuality = strugglesQuality + goalsQuality + inconsistencyQuality;
  
  // Calculate base score
  let score = 50;
  
  // Analyze struggles - look for specific keywords
  const s = struggles.toLowerCase();
  const hasStruggle = s.length > 10;
  
  if (hasStruggle) {
    if (s.includes('procrastin') || s.includes('delay') || s.includes('postpone')) {
      score -= 18;
    }
    if (s.includes('distract') || s.includes('social media') || s.includes('phone') || s.includes('scroll')) {
      score -= 15;
    }
    if (s.includes('focus') || s.includes('concentrat') || s.includes('attention')) {
      score -= 14;
    }
    if (s.includes('motivat') || s.includes('drive') || s.includes('want') || s.includes('feel like')) {
      score -= 12;
    }
    if (s.includes('time') || s.includes('busy') || s.includes('no time')) {
      score -= 10;
    }
    if (s.includes('overwhelm') || s.includes('much') || s.includes('lot')) {
      score -= 16;
    }
    if (s.includes('tired') || s.includes('exhaust') || s.includes('sleep') || s.includes('energy')) {
      score -= 14;
    }
    if (s.includes('lazy') || s.includes('dont want') || s.includes('no motivation')) {
      score -= 18;
    }
    if (s.includes('stuck') || s.includes('block') || s.includes('cant start')) {
      score -= 12;
    }
    if (s.includes('waste') || s.includes('lose') || s.includes('never finish')) {
      score -= 12;
    }
  } else {
    score -= 20; // No meaningful struggle mentioned
  }
  
  // Analyze goals
  const g = goals.toLowerCase();
  if (g.length > 15) {
    if (g.includes('money') || g.includes('wealth') || g.includes('financial') || g.includes('income')) score += 8;
    if (g.includes('learn') || g.includes('skill') || g.includes('knowledge') || g.includes('grow')) score += 7;
    if (g.includes('health') || g.includes('fitness') || g.includes('exercise')) score += 6;
    if (g.includes('career') || g.includes('job') || g.includes('business')) score += 6;
    if (g.includes('family') || g.includes('relationship') || g.includes('friend')) score += 5;
    if (g.includes('hobby') || g.includes('fun') || g.includes('enjoy')) score += 4;
  } else {
    score -= 8; // Goals too vague
  }
  
  // Analyze inconsistency reason
  const ir = inconsistencyReason.toLowerCase();
  if (ir.length > 10) {
    if (ir.includes('fear') || ir.includes('scared') || ir.includes('worried')) score -= 14;
    if (ir.includes('perfection') || ir.includes('perfect') || ir.includes('right')) score -= 10;
    if (ir.includes('anxiety') || ir.includes('stress') || ir.includes('overthink')) score -= 12;
    if (ir.includes('doubt') || ir.includes('unsure') || ir.includes('not sure')) score -= 8;
    if (ir.includes('tired') || ir.includes('exhaust') || ir.includes('burnout')) score -= 12;
    if (ir.includes('lazy') || ir.includes('comfort') || ir.includes('easy')) score -= 15;
    if (ir.includes('no reason') || ir.includes('dont know') || ir === 'idk') score -= 12;
  }
  
  // Time available affects score
  const t = timeAvailable.toLowerCase();
  if (t.includes('less than') || t.includes('1 hour')) score -= 8;
  if (t.includes('4') || t.includes('many')) score += 6;
  
  // Budget commitment
  if (budget === 'high') score += 10;
  if (budget === 'medium') score += 5;
  
  // Final score
  const executionScore = Math.max(15, Math.min(95, score));
  const riskLevel = executionScore < 40 ? 'high' : executionScore < 65 ? 'medium' : 'low';
  
  // Determine primary bottleneck based on struggles content
  let primaryBottleneck = 'Decision Fatigue & Analysis Paralysis';
  let foundBottleneck = false;
  
  // Only use default if no keywords matched
  if (s.includes('distract') || s.includes('social') || s.includes('phone') || s.includes('scroll')) {
    primaryBottleneck = 'Digital Distraction Syndrome';
    foundBottleneck = true;
  } else if (s.includes('time') || s.includes('busy') || s.includes('too much')) {
    primaryBottleneck = 'Time Blindness & Prioritization Failure';
    foundBottleneck = true;
  } else if (s.includes('motivat') || s.includes('start') || s.includes('want') || s.includes('feel like')) {
    primaryBottleneck = 'Activation Energy Barrier';
    foundBottleneck = true;
  } else if (s.includes('focus') || s.includes('attention') || s.includes('concentrat')) {
    primaryBottleneck = 'Sustained Attention Deficit';
    foundBottleneck = true;
  } else if (s.includes('procrastin') || s.includes('delay') || s.includes('postpone') || s.includes('later')) {
    primaryBottleneck = 'Chronic Procrastination Pattern';
    foundBottleneck = true;
  } else if (s.includes('overwhelm') || s.includes('much') || s.includes('lot') || s.includes('everything')) {
    primaryBottleneck = 'Cognitive Overload & Task Saturation';
    foundBottleneck = true;
  } else if (s.includes('tired') || s.includes('exhaust') || s.includes('energy') || s.includes('sleep')) {
    primaryBottleneck = 'Energy Management Failure';
    foundBottleneck = true;
  } else if (s.includes('lazy') || s.includes('dont want') || s.includes('comfort')) {
    primaryBottleneck = 'Motivational Depletion & Interest Loss';
    foundBottleneck = true;
  } else if (s.includes('stuck') || s.includes('block') || s.includes('cant')) {
    primaryBottleneck = 'Implementation Block & Starting Resistance';
    foundBottleneck = true;
  } else if (s.includes('waste') || s.includes('lose') || s.includes('finish')) {
    primaryBottleneck = 'Incomplete Task Pattern';
    foundBottleneck = true;
  }
  
  // Secondary bottlenecks
  const secondaryBottlenecks: string[] = [];
  
  if (!goals || goals.length < 20) {
    secondaryBottlenecks.push('Unclear Goal Hierarchy');
  }
  if (!routine || routine.length < 20) {
    secondaryBottlenecks.push('No Structured Daily Framework');
  }
  if (ir.includes('perfection')) {
    secondaryBottlenecks.push('Perfectionism Paralysis');
  }
  if (ir.includes('fear') || ir.includes('fail')) {
    secondaryBottlenecks.push('Fear-Based Avoidance');
  }
  if (t.includes('less than') || t.includes('1 hour')) {
    secondaryBottlenecks.push('Insufficient Time Investment');
  }
  
  while (secondaryBottlenecks.length < 2) {
    const extras = [
      'Lack of External Accountability',
      'Environment Trigger Management',
      'Reward Depreciation Pattern',
      'Dopamine Desensitization'
    ];
    const randomExtra = extras[Math.floor(Math.random() * extras.length)];
    if (!secondaryBottlenecks.includes(randomExtra)) {
      secondaryBottlenecks.push(randomExtra);
    }
  }
  
  // Behavioral pattern
  let behavioralPattern = 'Inconsistent execution pattern - starts with intention but loses momentum before completion.';
  
  if (ir.includes('start') && ir.includes('finish')) {
    behavioralPattern = 'False Start Pattern - excellent planning and initial execution, but collapses before completion.';
  } else if (ir.includes('day') || ir.includes('routine') || ir.includes('schedule')) {
    behavioralPattern = 'Schedule Instability - inconsistent work patterns that vary day to day, preventing habit formation.';
  } else if (ir.includes('burst') || ir.includes('intense') || ir.includes('period')) {
    behavioralPattern = 'Burst-and-Collapse Cycle - periods of intense productivity followed by complete shutdown.';
  } else if (ir.includes('procrastin') || ir.includes('later') || ir.includes('wait')) {
    behavioralPattern = 'Snooze-and-Repeat Pattern - constantly defers tasks, building pressure until forced to act.';
  } else if (ir.includes('perfect')) {
    behavioralPattern = 'Perfectionist Avoidance - avoids starting because afraid results won\'t meet standards.';
  } else if (ir.includes('fear') || ir.includes('fail')) {
    behavioralPattern = 'Risk-Aversion Avoidance - afraid of failure or judgment, so never fully commits to tasks.';
  } else if (ir.includes('lazy') || ir.includes('comfort')) {
    behavioralPattern = 'Effort Aversion Pattern - prefers comfort over productivity, defaults to easier options.';
  }
  
  // Psychological root cause
  let psychologicalRoot = 'Your brain has learned that the effort required feels greater than the anticipated reward, creating a protective avoidance response. This is a neurological pattern that can be retrained with the right approach.';
  
  if (ir.includes('fear')) {
    psychologicalRoot = 'Fear of failure creates an avoidance response - your brain protects you from potential disappointment by preventing you from trying. This is a deeply ingrained protective mechanism.';
  } else if (ir.includes('perfection')) {
    psychologicalRoot = 'Perfectionism creates a catch-22 - you cannot produce perfect work without starting, but won\'t start because it won\'t be perfect. The fear of judgment keeps you trapped in a cycle of avoidance.';
  } else if (ir.includes('motivat') || ir.includes('want')) {
    psychologicalRoot = 'Your brain has devalued the future reward - the payoff seems too far away or uncertain to justify the immediate effort required. The motivation gap is causing decision paralysis.';
  } else if (ir.includes('overwhelm') || ir.includes('much')) {
    psychologicalRoot = 'Your prefrontal cortex is overwhelmed by the gap between what you want to achieve and your current capacity. Decision fatigue accumulates, leaving no mental energy for execution.';
  } else if (ir.includes('tired') || ir.includes('exhaust')) {
    psychologicalRoot = 'Chronic exhaustion has depleted your mental resources. Your brain is prioritizing survival-mode rest over productivity, even when you consciously want to act.';
  } else if (ir.includes('lazy')) {
    psychologicalRoot = 'Your brain has formed a habit of choosing immediate comfort over long-term gains. This is not inherent laziness - it\'s a learned dopamine-seeking pattern that can be retrained through environmental design.';
  }
  
  // Fix plan - exactly 3 steps
  const fixPlan: string[] = [];
  
  // Step 1 based on primary bottleneck
  const step1Options: Record<string, string> = {
    'Digital Distraction Syndrome': 'Remove all digital distractions - install website blockers, put phone in another room, and create a dedicated workspace free from interruptions.',
    'Time Blindness': 'Implement time-blocking with a visual calendar. Schedule specific hours for specific tasks and treat them as non-negotiable appointments.',
    'Activation Energy': 'Use the 2-minute rule - any task taking less than 2 minutes gets done immediately. This builds momentum and overrides the starting resistance.',
    'Sustained Attention': 'Practice the Pomodoro Technique - 25 minutes of focused work followed by a 5-minute break. Repeat this cycle to train your attention span gradually.',
    'Chronic Procrastination': 'Identify your resistance triggers by keeping a procrastination journal. Note what you\'re avoiding and why, then address the underlying fear.',
    'Cognitive Overload': 'Break all large tasks into 25-minute chunks. Focus on completing one chunk at a time - progress matters more than perfection.',
    'Energy Management': 'Audit your energy levels throughout the day. Schedule demanding tasks during your peak energy windows and rest during low points.',
    'Motivational Depletion': 'Find your deeper "why" - connect your tasks to a meaningful purpose. Create small wins daily to rebuild motivation through success experiences.',
    'Implementation Block': 'Use the "Open Loop" technique - write everything down so your brain doesn\'t need to remember. Then systematically close each task.',
    'Incomplete Task': 'Define a "good enough" finish line for each task. Use timeboxing instead of task expansion to ensure completion.',
    'Decision Fatigue': 'Reduce daily decisions by creating routines. Automate what you can and focus your mental energy on high-impact choices only.'
  };
  
  // Find matching step1
  let step1Added = false;
  for (const [key, value] of Object.entries(step1Options)) {
    if (primaryBottleneck.includes(key.split(' ')[0]) || primaryBottleneck.includes(key)) {
      fixPlan.push(value);
      step1Added = true;
      break;
    }
  }
  if (!step1Added) {
    fixPlan.push('Start by identifying your most important task each morning. Complete this one task before checking email, social media, or messages.');
  }
  
  // Step 2 based on secondary issues
  if (secondaryBottlenecks.includes('Unclear Goal Hierarchy')) {
    fixPlan.push('Define your goals using the SMART framework - Specific, Measurable, Achievable, Relevant, and Time-bound. Write them down and review weekly.');
  } else if (secondaryBottlenecks.includes('No Structured Daily Framework')) {
    fixPlan.push('Create a non-negotiable morning routine with one anchor habit. Start with just 10 minutes and gradually build consistency.');
  } else if (secondaryBottlenecks.includes('Perfectionism Paralysis')) {
    fixPlan.push('Adopt "done is better than perfect" - set strict time limits on tasks and force yourself to stop when time is up. Ship first, iterate later.');
  } else if (secondaryBottlenecks.includes('Fear-Based Avoidance')) {
    fixPlan.push('Reframe failure as learning - write down what you\'ll do even if things go wrong. Progress and learning matter more than perfection.');
  } else {
    fixPlan.push('Build external accountability - share your goals with someone who will check in on your progress weekly.');
  }
  
  // Step 3 based on behavioral pattern
  if (behavioralPattern.includes('False Start')) {
    fixPlan.push('Plan for completion before starting - identify the minimum viable finish line for each task and commit to reaching it.');
  } else if (behavioralPattern.includes('Burst')) {
    fixPlan.push('Create sustainability guards - cap your daily output and set boundaries to prevent burnout cycles. Consistency beats intensity.');
  } else if (behavioralPattern.includes('Snooze')) {
    fixPlan.push('Use implementation intentions - "If X happens, then I will do Y" to create automatic responses. Remove the decision from the moment.');
  } else if (behavioralPattern.includes('Risk') || behavioralPattern.includes('Avoidance')) {
    fixPlan.push('Start with low-stakes tasks to build confidence. Success builds momentum - tackle bigger projects only after small wins.');
  } else if (behavioralPattern.includes('Effort')) {
    fixPlan.push('Design your environment for success - remove friction from good habits and add friction to bad ones. Make the productive choice the easy choice.');
  } else {
    fixPlan.push('Track your consistency using a simple streak counter. Build the identity of someone who follows through, one day at a time.');
  }
  
  // Recommendation
  let aiRecommendation: 'blueprint' | 'premium' = 'blueprint';
  if (budget === 'high' && executionScore < 60) {
    aiRecommendation = 'premium';
  } else if (budget === 'medium' && executionScore < 40) {
    aiRecommendation = 'premium';
  }
  
  return {
    execution_score: executionScore,
    primary_bottleneck: primaryBottleneck,
    secondary_bottlenecks: secondaryBottlenecks.slice(0, 2),
    behavioral_pattern: behavioralPattern,
    psychological_root: psychologicalRoot,
    risk_level: riskLevel,
    fix_plan: fixPlan,
    ai_recommendation: aiRecommendation
  };
}

// Helper function to analyze text quality
function analyzeTextQuality(text: string): number {
  if (!text || text.length < 5) return 0;
  const cleaned = text.toLowerCase().replace(/[^a-z]/g, '');
  if (cleaned.length < 5) return 1;
  const uniqueChars = new Set(cleaned);
  if (uniqueChars.size < 4) return 2;
  const words = text.split(/\s+/).filter(w => w.length > 2);
  if (words.length < 2) return 3;
  return 4;
}

export async function switchRecommendation(userId: string, interviewData: any, currentRecommendation: string): Promise<{ recommendation: string; reasoning: string }> {
  const newRecommendation = currentRecommendation === 'blueprint' ? 'premium' : 'blueprint';
  
  const reasoning = newRecommendation === 'premium' 
    ? `After re-evaluation, Premium ExecutionOS is recommended because your execution challenges require intensive accountability and personalized system optimization.`
    : `After re-evaluation, Blueprint Plan is recommended - your issues can be addressed with structured self-directed frameworks.`;
  
  return {
    recommendation: newRecommendation,
    reasoning
  };
}