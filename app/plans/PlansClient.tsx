'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

interface UserData {
  budget_tier: string;
  ai_recommendation: string;
  execution_score: number;
}

function PlansContentInner() {
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = searchParams.get('userId');

  useEffect(() => {
    const storedUser = sessionStorage.getItem('executionOS_user');
    const storedRecommendation = sessionStorage.getItem('executionOS_recommendation');
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData({
        budget_tier: user.budget_tier || 'medium',
        ai_recommendation: storedRecommendation || user.ai_recommendation || 'blueprint',
        execution_score: user.execution_score || 0,
      });
      setLoading(false);
      return;
    }

    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(`/api/get-recommendation?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUserData(data.user);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [userId]);

  const recommendedPlan = userData?.ai_recommendation || 'blueprint';

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <a href={`/report?userId=${userId}`} className={styles.backLink}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          View Your Report
        </a>

        <header className={styles.header}>
          <div className={styles.scoreBadge}>
            Your Execution Score: <strong>{userData?.execution_score || 0}/100</strong>
          </div>
          <h1 className={styles.title}>Choose Your Path Forward</h1>
          <p className={styles.subtitle}>
            Based on your analysis, here are your options. Select the system that matches your situation and budget.
          </p>
        </header>

        <div className={styles.plansGrid}>
          <div className={`${styles.planCard} ${recommendedPlan === 'blueprint' ? styles.recommended : ''}`}>
            {recommendedPlan === 'blueprint' && (
              <div className={styles.recommendationBadge}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                AI Recommended for You
              </div>
            )}
            
            <div className={styles.planHeader}>
              <div className={styles.planIcon}>📋</div>
              <h2 className={styles.planName}>Blueprint Plan</h2>
              <div className={styles.planPrice}>
                <span className={styles.priceAmount}>$47</span>
                <span className={styles.priceType}>one-time payment</span>
              </div>
            </div>

            <div className={styles.planTagline}>
              Perfect if you&apos;re ready to start building structure and need a clear framework to follow.
            </div>

            <ul className={styles.planFeatures}>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mint)" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span><strong>Execution Blueprint Template</strong> — Your complete roadmap to consistent action</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mint)" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span><strong>Goal Hierarchy System</strong> — Know exactly what to focus on and when</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mint)" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span><strong>Daily Routine Builder</strong> — Create a sustainable daily structure</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mint)" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span><strong>Self-Assessment Checklist</strong> — Track your progress weekly</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mint)" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span><strong>Email Support</strong> — Get help when you&apos;re stuck</span>
              </li>
            </ul>

            <div className={styles.planBestFor}>
              <strong>Who this is for:</strong> Beginners, those on a budget, people with straightforward execution challenges who just need a clear framework to follow.
            </div>

            <div className={styles.planActions}>
              <a 
                href={`/waitlist?userId=${userId}&plan=blueprint`}
                className={styles.selectButton}
              >
                Join Waitlist — It&apos;s Free
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <p className={styles.planNote}>No payment now. Get early access when we launch.</p>
            </div>
          </div>

          <div className={`${styles.planCard} ${styles.premium} ${recommendedPlan === 'premium' ? styles.recommended : ''}`}>
            {recommendedPlan === 'premium' && (
              <div className={styles.recommendationBadge}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                AI Recommended for You
              </div>
            )}
            
            <div className={styles.planHeader}>
              <div className={styles.planIcon}>🚀</div>
              <h2 className={styles.planName}>Premium ExecutionOS</h2>
              <div className={styles.planPrice}>
                <span className={styles.priceAmount}>$297</span>
                <span className={styles.priceType}>one-time payment</span>
              </div>
            </div>

            <div className={styles.planTagline}>
              Complete transformation with hands-on support, AI coaching, and accountability to ensure you actually follow through.
            </div>

            <ul className={styles.planFeatures}>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mint)" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span><strong>Everything in Blueprint Plan</strong></span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mint)" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span><strong>AI Execution Coach</strong> — 12 weeks of daily guidance & prompts</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mint)" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span><strong>Weekly Accountability Calls</strong> — Stay on track with live support</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mint)" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span><strong>Custom System Integration</strong> — We build your personal system</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mint)" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span><strong>Progress Dashboard</strong> — Real-time visibility into your growth</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mint)" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span><strong>Priority Support</strong> — Direct access when you need help</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mint)" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span><strong>Private Community</strong> — Surround yourself with doers</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mint)" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span><strong>Lifetime Updates</strong> — Never miss new features</span>
              </li>
            </ul>

            <div className={styles.planBestFor}>
              <strong>Who this is for:</strong> Serious professionals and entrepreneurs who want guaranteed results with hands-on support and accountability.
            </div>

            <div className={styles.planActions}>
              <a 
                href={`/waitlist?userId=${userId}&plan=premium`}
                className={`${styles.selectButton} ${styles.premiumButton}`}
              >
                Join Waitlist — It&apos;s Free
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <p className={styles.planNote}>No payment now. Get early access when we launch.</p>
            </div>
          </div>
        </div>

        <div className={styles.comparison}>
          <h3>Not sure which one?</h3>
          <p>Based on your execution score of <strong>{userData?.execution_score || 0}/100</strong>, {userData?.execution_score && userData.execution_score < 50 
            ? "we recommend Premium for the best chance at transformation." 
            : "Blueprint could be a great starting point."}</p>
        </div>

        <div className={styles.guarantee}>
          <div className={styles.guaranteeIcon}>🛡️</div>
          <h4>100% Risk-Free</h4>
          <p>Both plans come with a 30-day money-back guarantee. If you don&apos;t see results, get a full refund—no questions asked.</p>
        </div>
      </div>
    </main>
  );
}

export default function PlansContent() {
  return (
    <Suspense fallback={
      <main className={styles.main}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      </main>
    }>
      <PlansContentInner />
    </Suspense>
  );
}