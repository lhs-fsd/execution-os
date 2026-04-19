'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, generateExecutionReport } from '@/lib/supabase';
import styles from './page.module.css';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  budget: string;
  occupation: string;
  goals: string;
  struggles: string;
  routine: string;
  inconsistencyReason: string;
  timeAvailable: string;
  toolsUsed: string[];
}

const initialFormData: FormData = {
  fullName: '',
  email: '',
  phone: '',
  countryCode: '+1',
  budget: '',
  occupation: '',
  goals: '',
  struggles: '',
  routine: '',
  inconsistencyReason: '',
  timeAvailable: '',
  toolsUsed: [],
};

const tools = ['Notion', 'Calendar', 'Todoist', 'Obsidian', 'Trello', 'Asana', 'Evernote', 'Other'];
const timeOptions = ['Less than 1 hour', '1-2 hours', '2-4 hours', '4+ hours'];

const countryCodes = [
  { code: '+1', country: 'US - United States' },
  { code: '+1', country: 'CA - Canada' },
  { code: '+44', country: 'UK - United Kingdom' },
  { code: '+49', country: 'DE - Germany' },
  { code: '+33', country: 'FR - France' },
  { code: '+81', country: 'JP - Japan' },
  { code: '+91', country: 'IN - India' },
  { code: '+86', country: 'CN - China' },
  { code: '+61', country: 'AU - Australia' },
  { code: '+55', country: 'BR - Brazil' },
];

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length >= 5;
};

const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[^0-9]/g, '');
  return cleaned.length >= 5;
};

const validateName = (name: string): boolean => {
  const cleaned = name.replace(/[^a-zA-Z\s]/g, '').trim();
  return cleaned.length >= 2;
};

const isValidInput = (text: string): boolean => {
  if (!text || text.trim().length < 10) return false;
  const cleaned = text.toLowerCase();
  const words = cleaned.split(/\s+/).filter(w => w.length > 2);
  if (words.length < 2) return false;
  const lettersOnly = cleaned.replace(/[^a-z]/g, '');
  if (lettersOnly.length < 8) return false;
  const uniqueChars = new Set(lettersOnly);
  return uniqueChars.size >= 4;
};

const isValidOccupation = (text: string): boolean => {
  if (!text || text.trim().length < 3) return false;
  const cleaned = text.toLowerCase().replace(/[^a-z\s]/g, '');
  return cleaned.length >= 3;
};

export default function InterviewPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const toggleTool = (tool: string) => {
    setFormData(prev => ({
      ...prev,
      toolsUsed: prev.toolsUsed.includes(tool)
        ? prev.toolsUsed.filter(t => t !== tool)
        : [...prev.toolsUsed, tool]
    }));
  };

  const getStepErrors = (): string | null => {
    switch (step) {
      case 1:
        if (!formData.fullName.trim()) return 'Please enter your full name';
        if (!validateName(formData.fullName)) return 'Please enter a valid name (at least 2 letters)';
        if (!formData.email.trim()) return 'Please enter your email';
        if (!validateEmail(formData.email)) return 'Please enter a valid email address';
        if (!formData.phone.trim()) return 'Please enter your phone number';
        if (!validatePhone(formData.phone)) return 'Please enter a valid phone number (at least 5 digits)';
        return null;
      case 2:
        if (!formData.budget) return 'Please select your budget';
        return null;
      case 3:
        if (!isValidOccupation(formData.occupation)) return 'Please enter a valid occupation (at least 3 letters)';
        if (!isValidInput(formData.goals)) return 'Please describe your goals with more detail (at least 2 real words)';
        if (!isValidInput(formData.struggles)) return 'Please describe your biggest struggle with more detail';
        if (!isValidInput(formData.routine)) return 'Please describe your daily routine with more detail';
        return null;
      case 4:
        if (!isValidInput(formData.inconsistencyReason)) return 'Please explain your reason for inconsistency in more detail';
        if (!formData.timeAvailable) return 'Please select your available time';
        return null;
      default:
        return null;
    }
  };

  const handleNext = () => {
    const stepError = getStepErrors();
    if (stepError) {
      setError(stepError);
      return;
    }
    if (step < totalSteps) {
      setStep(prev => prev + 1);
      setError('');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      setError('');
    }
  };

  const handleSubmit = async () => {
    const allFieldsCheck = [
      { valid: validateName(formData.fullName), field: 'Full name' },
      { valid: validateEmail(formData.email), field: 'Email' },
      { valid: validatePhone(formData.phone), field: 'Phone' },
      { valid: isValidOccupation(formData.occupation), field: 'Occupation' },
      { valid: isValidInput(formData.goals), field: 'Goals' },
      { valid: isValidInput(formData.struggles), field: 'Struggles' },
      { valid: isValidInput(formData.routine), field: 'Routine' },
      { valid: isValidInput(formData.inconsistencyReason), field: 'Inconsistency reason' },
    ];

    for (const check of allFieldsCheck) {
      if (!check.valid) {
        setError(`Please enter a valid ${check.field}`);
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      let budgetTier = 'low';
      if (formData.budget === '$50–$150') budgetTier = 'medium';
      if (formData.budget === '$150+') budgetTier = 'high';

      const userId = crypto.randomUUID();
      
      const reportData = await generateExecutionReport({
        budget: formData.budget,
        budget_tier: budgetTier,
        occupation: formData.occupation,
        goals: formData.goals,
        struggles: formData.struggles,
        routine: formData.routine,
        inconsistency_reason: formData.inconsistencyReason,
        time_available: formData.timeAvailable,
        tools_used: formData.toolsUsed,
      });

      await supabase.from('users').upsert({
        id: userId,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        budget_tier: budgetTier,
        execution_score: reportData.execution_score,
        ai_recommendation: reportData.ai_recommendation,
        created_at: new Date().toISOString(),
      });

      await supabase.from('reports').insert({
        id: crypto.randomUUID(),
        user_id: userId,
        execution_score: reportData.execution_score,
        primary_bottleneck: reportData.primary_bottleneck,
        secondary_bottlenecks: reportData.secondary_bottlenecks,
        behavioral_pattern: reportData.behavioral_pattern,
        psychological_root: reportData.psychological_root,
        risk_level: reportData.risk_level,
        fix_plan: reportData.fix_plan,
        created_at: new Date().toISOString(),
      });

      const userData = {
        id: userId,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        budget_tier: budgetTier,
        execution_score: reportData.execution_score,
        ai_recommendation: reportData.ai_recommendation,
      };

      sessionStorage.setItem('executionOS_userId', userId);
      sessionStorage.setItem('executionOS_budgetTier', budgetTier);
      sessionStorage.setItem('executionOS_report', JSON.stringify(reportData));
      sessionStorage.setItem('executionOS_user', JSON.stringify(userData));
      sessionStorage.setItem('executionOS_score', String(reportData.execution_score));
      sessionStorage.setItem('executionOS_recommendation', reportData.ai_recommendation);

      router.push(`/execution-os/report?userId=${userId}`);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <a href="/execution-os/" className={styles.backLink}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </a>
          <div className={styles.progressWrapper}>
            <div className={styles.progressLabel}>
              Step {step} of {totalSteps}
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        <div className={styles.formCard}>
          {step === 1 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>Let&apos;s start with the basics</h2>
              <p className={styles.stepDescription}>We need your contact information to send your personalized report.</p>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name *</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email *</label>
                <input
                  type="email"
                  className={styles.input}
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Phone Number *</label>
                <div className={styles.phoneInput}>
                  <select
                    className={styles.countrySelect}
                    value={formData.countryCode}
                    onChange={(e) => updateField('countryCode', e.target.value)}
                  >
                    {countryCodes.map((cc) => (
                      <option key={cc.code + cc.country} value={cc.code}>
                        {cc.code} ({cc.country})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    className={styles.phoneField}
                    placeholder="5551234567"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>What&apos;s your budget?</h2>
              <p className={styles.stepDescription}>This helps us recommend the right execution system for your situation.</p>
              
              <div className={styles.budgetOptions}>
                {['$0–$50 (Low)', '$50–$150 (Medium)', '$150+ (High)'].map((option) => (
                  <button
                    key={option}
                    className={`${styles.budgetCard} ${formData.budget === option ? styles.selected : ''}`}
                    onClick={() => updateField('budget', option)}
                  >
                    <div className={styles.budgetIcon}>
                      {option.includes('$0') ? '🌱' : option.includes('$50') ? '🌿' : '🚀'}
                    </div>
                    <div className={styles.budgetText}>
                      <span className={styles.budgetAmount}>{option.split(' (')[0]}</span>
                      <span className={styles.budgetLabel}>
                        {option.includes('$0') && 'Just getting started'}
                        {option.includes('$50') && 'Ready to invest in myself'}
                        {option.includes('$150') && 'Full commitment to transformation'}
                      </span>
                    </div>
                    <div className={styles.checkmark}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>Tell us about your goals and struggles</h2>
              <p className={styles.stepDescription}>The more detail you provide, the better your analysis will be.</p>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Occupation / Role *</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Software Engineer, Founder, Student..."
                  value={formData.occupation}
                  onChange={(e) => updateField('occupation', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Main Goals *</label>
                <textarea
                  className={styles.textarea}
                  placeholder="What do you want to achieve? What are you working toward?"
                  value={formData.goals}
                  onChange={(e) => updateField('goals', e.target.value)}
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Biggest Productivity Struggle *</label>
                <textarea
                  className={styles.textarea}
                  placeholder="What's the #1 thing that stops you from getting things done?"
                  value={formData.struggles}
                  onChange={(e) => updateField('struggles', e.target.value)}
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Daily Routine Description *</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Describe a typical day - when do you work, what does your day look like?"
                  value={formData.routine}
                  onChange={(e) => updateField('routine', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>One more thing...</h2>
              <p className={styles.stepDescription}>Help us understand your behavior patterns.</p>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Reason for inconsistency *</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Why do you think you can't stay consistent? What's happening?"
                  value={formData.inconsistencyReason}
                  onChange={(e) => updateField('inconsistencyReason', e.target.value)}
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Time available per day *</label>
                <div className={styles.timeOptions}>
                  {timeOptions.map((option) => (
                    <button
                      key={option}
                      className={`${styles.timeCard} ${formData.timeAvailable === option ? styles.selected : ''}`}
                      onClick={() => updateField('timeAvailable', option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Tools currently used</label>
                <div className={styles.toolsGrid}>
                  {tools.map((tool) => (
                    <button
                      key={tool}
                      className={`${styles.toolChip} ${formData.toolsUsed.includes(tool) ? styles.selected : ''}`}
                      onClick={() => toggleTool(tool)}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            {step > 1 && (
              <button className={styles.btnBack} onClick={handleBack}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
              </button>
            )}
            
            {step < totalSteps ? (
              <button 
                className={styles.btnNext} 
                onClick={handleNext}
              >
                Next
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            ) : (
              <button 
                className={styles.btnSubmit} 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Processing...
                  </>
                ) : (
                  <>
                    Generate My Report
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}