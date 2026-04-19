'use client';
export const dynamic = 'force-dynamic';

import { Suspense, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface UserData {
  full_name: string;
  email: string;
  phone: string;
  budget_tier: string;
  execution_score: number;
  ai_recommendation: string;
}

function WaitlistContent() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState('');
  const score = typeof userData?.execution_score === 'number' ? userData!.execution_score : 0;

  const selectedPlan = searchParams.get('plan') || 'blueprint';
  const userId = searchParams.get('userId');

  useEffect(() => {
    const storedUser = sessionStorage.getItem('executionOS_user');
    const storedBudgetTier = sessionStorage.getItem('executionOS_budgetTier');
    const storedScore = sessionStorage.getItem('executionOS_score');
    const storedRecommendation = sessionStorage.getItem('executionOS_recommendation');
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        budget_tier: storedBudgetTier || 'medium',
        execution_score: user.execution_score || 0,
        ai_recommendation: storedRecommendation || user.ai_recommendation || 'blueprint',
      });
      setFormData({
        fullName: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      return;
    }

    if (!userId) return;

    fetch(`/api/get-recommendation?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUserData(data.user);
          setFormData(prev => ({
            ...prev,
            fullName: data.user.full_name || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
          }));
        }
      });
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/submit-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          selectedPlan,
          recommendedPlan: userData?.ai_recommendation || 'blueprint',
          budgetTier: userData?.budget_tier || 'medium',
          executionScore: userData?.execution_score || 0,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to join waitlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (platform: string) => {
    const text = `I just discovered ExecutionOS and got my free execution diagnosis! Find out why you can't finish what you start.`;
    const url = typeof window !== 'undefined' ? window.location.origin : 'https://executionos.com';
    
    if (platform === 'x') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    }
  };

  if (submitted) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h1>You&apos;re In! 🎉</h1>
            <p>
              Congratulations on taking the first step! We&apos;ll send updates to <strong>{formData.email}</strong> when your {selectedPlan === 'premium' ? 'Premium ExecutionOS' : 'Blueprint Plan'} becomes available.
            </p>
            
            <div className={styles.shareSection}>
              <h3>Want to skip the wait?</h3>
              <p>Share with friends and move up the waitlist!</p>
              <div className={styles.shareButtons}>
                <button className={styles.shareButton} onClick={() => handleShare('x')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Share on X
                </button>
                <button className={styles.shareButton} onClick={() => handleShare('linkedin')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Share on LinkedIn
                </button>
              </div>
            </div>

            <div className={styles.successDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Plan</span>
                <span className={styles.detailValue}>
                  {selectedPlan === 'premium' ? 'Premium ExecutionOS' : 'Blueprint Plan'}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Your Score</span>
                <span className={styles.detailValue}>{score}/100</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Status</span>
                <span className={styles.detailValue}>Waitlist Active</span>
              </div>
            </div>
            <a href="/" className={styles.homeButton}>
              Back to Home
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <a href={`/plans?userId=${userId}`} className={styles.backLink}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Plans
        </a>

        <div className={styles.formCard}>
          <div className={styles.planBadge}>
            <span className={styles.planLabel}>You&apos;re joining the waitlist for</span>
            <span className={styles.planName}>
              {selectedPlan === 'premium' ? 'Premium ExecutionOS' : 'Blueprint Plan'}
            </span>
            {score > 0 && (
              <span className={styles.planScore}>Your Score: {score}/100</span>
            )}
          </div>

          <h1 className={styles.title}>Secure Your Spot</h1>
          <p className={styles.subtitle}>
            Add your details to get early access. No payment required now—we&apos;ll reach out when your plan is ready.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                className={styles.input}
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="John Doe"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                className={styles.input}
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number</label>
              <input
                type="tel"
                className={styles.input}
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Processing...
                </>
              ) : (
                <>
                  Join Waitlist
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className={styles.note}>
            🔒 We respect your privacy. No spam, ever. Unsubscribe anytime.
          </p>
        </div>

        <div className={styles.infoCard}>
          <h3>What happens next?</h3>
          <ul>
            <li>
              <span className={styles.stepNumber}>1</span>
              <div>
                <strong>Confirmation Email</strong>
                <p>We&apos;ll confirm your spot on the waitlist within minutes.</p>
              </div>
            </li>
            <li>
              <span className={styles.stepNumber}>2</span>
              <div>
                <strong>Early Access Notification</strong>
                <p>You&apos;ll be notified before anyone else when enrollment opens.</p>
              </div>
            </li>
            <li>
              <span className={styles.stepNumber}>3</span>
              <div>
                <strong>Priority Placement</strong>
                <p>Waitlist members get priority access and special launch pricing.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

export default function WaitlistPage() {
  return (
    <Suspense fallback={
      <main className={styles.main}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      </main>
    }>
      <WaitlistContent />
    </Suspense>
  );
}