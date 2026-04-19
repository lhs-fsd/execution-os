'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './page.module.css';

interface ReportData {
  execution_score: number;
  primary_bottleneck: string;
  secondary_bottlenecks: string[];
  behavioral_pattern: string;
  psychological_root: string;
  risk_level: string;
  fix_plan: string[];
}

export default function ReportPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<ReportData | null>(null);
  const [budgetTier, setBudgetTier] = useState('');

  useEffect(() => {
    const userId = searchParams.get('userId');
    if (!userId) {
      router.push('/interview');
      return;
    }

    // First try to get from sessionStorage (faster)
    const storedReport = sessionStorage.getItem('executionOS_report');
    const storedBudgetTier = sessionStorage.getItem('executionOS_budgetTier');
    const storedUser = sessionStorage.getItem('executionOS_user');
    
    console.log('[Report Page] storedReport:', storedReport);
    console.log('[Report Page] storedBudgetTier:', storedBudgetTier);
    console.log('[Report Page] userId:', userId);
    
    if (storedReport) {
      console.log('[Report Page] Using stored report');
      setReport(JSON.parse(storedReport));
      setBudgetTier(storedBudgetTier || 'medium');
      setLoading(false);
      return;
    }

    // Fallback to API
    setBudgetTier(storedBudgetTier || 'medium');
    console.log('[Report Page] Fetching from API');

    fetch(`/api/get-report?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.report) {
          setReport(data.report);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [searchParams, router]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'var(--accent-coral)';
      case 'medium': return 'var(--accent-gold)';
      default: return 'var(--accent-mint)';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'high': return 'High Risk';
      case 'medium': return 'Medium Risk';
      default: return 'Low Risk';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'var(--accent-mint)';
    if (score >= 40) return 'var(--accent-gold)';
    return 'var(--accent-coral)';
  };

  const getRecommendation = () => {
    if (!report) return 'premium';
    // Based on execution score and budget
    if (budgetTier === 'high' || (budgetTier === 'medium' && report.execution_score < 50)) {
      return 'premium';
    }
    return 'blueprint';
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinnerLarge}></div>
          <p>Analyzing your execution patterns...</p>
        </div>
      </main>
    );
  }

  if (!report) {
    return (
      <main className={styles.main}>
        <div className={styles.errorContainer}>
          <h2>Report not found</h2>
          <p>Please complete the diagnosis first.</p>
          <a href="/interview" className="btn btn-primary">Start Diagnosis</a>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <a href="/" className={styles.backLink}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Start Over
        </a>

        <header className={styles.header}>
          <h1 className={styles.title}>Your Execution Leak Report™</h1>
          <div className={styles.scoreSection}>
            <div className={styles.scoreRing}>
              <svg viewBox="0 0 100 100" className={styles.scoreSvg}>
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={getScoreColor(report.execution_score)}
                  strokeWidth="8"
                  strokeDasharray={`${(report.execution_score / 100) * 283} 283`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  className={styles.scoreCircle}
                />
              </svg>
              <div className={styles.scoreValue}>
                <span className={styles.scoreNumber}>{report.execution_score}</span>
                <span className={styles.scoreLabel}>/100</span>
              </div>
            </div>
            <div 
              className={styles.riskBadge}
              style={{ background: `${getRiskColor(report.risk_level)}20`, color: getRiskColor(report.risk_level) }}
            >
              {getRiskLabel(report.risk_level)}
            </div>
          </div>
        </header>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>🎯</div>
            <h2>Primary Bottleneck</h2>
          </div>
          <div className={styles.card}>
            <h3 className={styles.bottleneckTitle}>{report.primary_bottleneck}</h3>
            <p className={styles.bottleneckDesc}>
              This is the single most significant barrier to your execution. It accounts for 
              the majority of your productivity losses and creates a cascade effect that 
              undermines your ability to complete even simple tasks.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>⚡</div>
            <h2>Secondary Bottlenecks</h2>
          </div>
          <div className={styles.secondaryList}>
            {report.secondary_bottlenecks.map((bottleneck, index) => (
              <div key={index} className={styles.secondaryCard}>
                <span className={styles.secondaryNumber}>0{index + 1}</span>
                <p>{bottleneck}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>🔄</div>
            <h2>Behavioral Pattern</h2>
          </div>
          <div className={styles.card}>
            <p>{report.behavioral_pattern}</p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>🧠</div>
            <h2>Psychological Root Cause</h2>
          </div>
          <div className={styles.card}>
            <p>{report.psychological_root}</p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>✅</div>
            <h2>3-Step Fix Plan</h2>
          </div>
          <div className={styles.fixPlan}>
            {report.fix_plan.map((step, index) => (
              <div key={index} className={styles.fixStep}>
                <div className={styles.stepNumber}>{index + 1}</div>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.recommendation}>
          <p className={styles.recommendationText}>
            Based on your analysis — {budgetTier} budget tier with an execution score of {report.execution_score}/100 — we recommend:
          </p>
          <div className={styles.recommendedBadge}>
            <span className={styles.recommendationLabel}>AI Recommended</span>
            <span className={styles.recommendationValue}>
              {getRecommendation() === 'premium' ? 'Premium ExecutionOS' : 'Blueprint Plan'}
            </span>
          </div>
          <a href={`/plans?userId=${searchParams.get('userId')}`} className={styles.viewPlansBtn}>
            View Plans
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </main>
  );
}
