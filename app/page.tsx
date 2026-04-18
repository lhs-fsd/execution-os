'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.gridPattern}></div>
          <div className={styles.glowOrb1}></div>
          <div className={styles.glowOrb2}></div>
          <div className={styles.glowOrb3}></div>
        </div>
        
        <div className={styles.heroContent}>
          <div className={`${styles.badge} ${loaded ? styles.animateIn : ''}`}>
            <span className={styles.badgeDot}></span>
            Free AI-Powered Analysis
          </div>
          
          <h1 className={`${styles.heroTitle} ${loaded ? styles.animateIn : ''}`}>
            Stop Starting. <span className={styles.highlight}>Start Finishing.</span>
          </h1>
          
          <p className={`${styles.heroSubtitle} ${loaded ? styles.animateIn : ''}`}>
            You have the skills. You have the ideas. But something keeps stopping you from crossing the finish line. 
            Our AI uncovers the hidden psychological barriers holding you back—in under 3 minutes.
          </p>
          
          <div className={`${styles.heroCta} ${loaded ? styles.animateIn : ''}`}>
            <a href="/interview" className={styles.ctaButton}>
              Get Your Free Diagnosis
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
          
          <div className={`${styles.trust} ${loaded ? styles.animateIn : ''}`}>
            <span>🎯</span> Instant results • <span>💳</span> 100% Free • <span>🔒</span> No signup required
          </div>
        </div>
      </section>

      <section className={styles.problem}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>The Execution Trap</h2>
          <p className={styles.sectionSubtitle}>
            You&apos;re not lazy. There&apos;s a specific reason you can&apos;t finish what you start.
          </p>
          
          <div className={styles.problemGrid}>
            <div className={`${styles.problemCard} ${loaded ? styles.animateIn : ''}`}>
              <div className={styles.problemIcon}>🧠</div>
              <h3>You Know What To Do</h3>
              <p>You have clear goals and a plan. You&apos;ve read the books, watched the videos, and know exactly what needs to happen.</p>
            </div>
            
            <div className={`${styles.problemCard} ${loaded ? styles.animateInDelay1 : ''}`}>
              <div className={styles.problemIcon}>🚫</div>
              <h3>But You Can&apos;t Execute</h3>
              <p>Every time you sit down to work, something happens. You procrastinate, get distracted, or feel &quot;stuck.&quot;</p>
            </div>
            
            <div className={`${styles.problemCard} ${loaded ? styles.animateInDelay2 : ''}`}>
              <div className={styles.problemIcon}>🔄</div>
              <h3>It Keeps Repeating</h3>
              <p>You start strong, then stop. Start again, then stop. The cycle never ends—and it&apos;s destroying your confidence.</p>
            </div>
          </div>

          <div className={`${styles.ctaBox} ${loaded ? styles.animateInDelay3 : ''}`}>
            <h3>What If You Could Change This—Permanently?</h3>
            <p>ExecutionOS doesn&apos;t just give you tips. We identify the exact psychological pattern keeping you stuck and give you a personalized roadmap to break free.</p>
            <a href="/interview" className={styles.ctaButton}>
              Start Your Free Diagnosis
            </a>
          </div>
        </div>
      </section>

      <section id="how-it-works" className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>How ExecutionOS Works</h2>
          <p className={styles.sectionSubtitle}>
            Three simple steps to your personalized execution blueprint
          </p>
          
          <div className={styles.featureGrid}>
            <div className={`${styles.featureCard} ${loaded ? styles.animateIn : ''}`}>
              <div className={styles.featureNumber}>01</div>
              <div className={styles.featureIcon}>📝</div>
              <h3>Quick Assessment</h3>
              <p>
                Answer 12 simple questions about your goals, struggles, and daily habits. 
                Takes less than 3 minutes.
              </p>
            </div>
            
            <div className={`${styles.featureCard} ${loaded ? styles.animateInDelay1 : ''}`}>
              <div className={styles.featureNumber}>02</div>
              <div className={styles.featureIcon}>🤖</div>
              <h3>AI Analysis</h3>
              <p>
                Our AI digs deep into your behavioral patterns to identify the exact root cause 
                of your execution failures.
              </p>
            </div>
            
            <div className={`${styles.featureCard} ${loaded ? styles.animateInDelay2 : ''}`}>
              <div className={styles.featureNumber}>03</div>
              <div className={styles.featureIcon}>📋</div>
              <h3>Your Action Blueprint</h3>
              <p>
                Get a detailed report with your execution score, hidden barriers, and 
                a personalized 3-step fix plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.benefits}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>What You&apos;ll Discover</h2>
          
          <div className={styles.benefitsList}>
            <div className={`${styles.benefitItem} ${loaded ? styles.animateIn : ''}`}>
              <div className={styles.benefitCheck}>✓</div>
              <div className={styles.benefitContent}>
                <h4>Your Execution Score (0-100)</h4>
                <p>A single number that reveals exactly where you stand—and why you keep failing.</p>
              </div>
            </div>
            
            <div className={`${styles.benefitItem} ${loaded ? styles.animateInDelay1 : ''}`}>
              <div className={styles.benefitCheck}>✓</div>
              <div className={styles.benefitContent}>
                <h4>Your Primary Bottleneck</h4>
                <p>The one thing that&apos;s blocking your progress more than anything else.</p>
              </div>
            </div>
            
            <div className={`${styles.benefitItem} ${loaded ? styles.animateInDelay2 : ''}`}>
              <div className={styles.benefitCheck}>✓</div>
              <div className={styles.benefitContent}>
                <h4>Hidden Secondary Issues</h4>
                <p>2-3 smaller barriers you didn&apos;t know were sabotaging your success.</p>
              </div>
            </div>
            
            <div className={`${styles.benefitItem} ${loaded ? styles.animateInDelay3 : ''}`}>
              <div className={styles.benefitCheck}>✓</div>
              <div className={styles.benefitContent}>
                <h4>Your Behavioral Pattern</h4>
                <p>The specific cycle you&apos;re trapped in—and how to break it.</p>
              </div>
            </div>
            
            <div className={`${styles.benefitItem} ${loaded ? styles.animateInDelay4 : ''}`}>
              <div className={styles.benefitCheck}>✓</div>
              <div className={styles.benefitContent}>
                <h4>Psychological Root Cause</h4>
                <p>The real reason you procrastinate—it&apos;s not what you think.</p>
              </div>
            </div>
            
            <div className={`${styles.benefitItem} ${loaded ? styles.animateInDelay5 : ''}`}>
              <div className={styles.benefitCheck}>✓</div>
              <div className={styles.benefitContent}>
                <h4>Your Personalized Fix Plan</h4>
                <p>3 specific actions you can start today to turn things around.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={`${styles.ctaBox} ${loaded ? styles.animateIn : ''}`}>
            <h2>Ready to Finally Break Free?</h2>
            <p>Discover exactly why you can&apos;t execute—and what to do about it.</p>
            <a href="/interview" className={styles.ctaButton}>
              Start Free Diagnosis Now
            </a>
            <p className={styles.ctaNote}>No credit card required • Takes 3 minutes • 100% free</p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>© 2026 ExecutionOS. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}