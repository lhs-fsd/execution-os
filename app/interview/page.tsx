'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  { code: '+234', country: 'NG - Nigeria' },
  { code: '+254', country: 'KE - Kenya' },
  { code: '+27', country: 'ZA - South Africa' },
  { code: '+971', country: 'AE - United Arab Emirates' },
  { code: '+20', country: 'EG - Egypt' },
  { code: '+92', country: 'PK - Pakistan' },
  { code: '+62', country: 'ID - Indonesia' },
  { code: '+63', country: 'PH - Philippines' },
  { code: '+90', country: 'TR - Turkey' },
  { code: '+82', country: 'KR - South Korea' },
  { code: '+39', country: 'IT - Italy' },
  { code: '+34', country: 'ES - Spain' },
  { code: '+31', country: 'NL - Netherlands' },
  { code: '+46', country: 'SE - Sweden' },
  { code: '+47', country: 'NO - Norway' },
  { code: '+45', country: 'DK - Denmark' },
  { code: '+41', country: 'CH - Switzerland' },
  { code: '+43', country: 'AT - Austria' },
  { code: '+32', country: 'BE - Belgium' },
  { code: '+48', country: 'PL - Poland' },
  { code: '+7', country: 'RU - Russia' },
  { code: '+380', country: 'UA - Ukraine' },
  { code: '+972', country: 'IL - Israel' },
  { code: '+966', country: 'SA - Saudi Arabia' },
  { code: '+965', country: 'KW - Kuwait' },
  { code: '+968', country: 'OM - Oman' },
  { code: '+973', country: 'BH - Bahrain' },
  { code: '+974', country: 'QA - Qatar' },
  { code: '+212', country: 'MA - Morocco' },
  { code: '+216', country: 'TN - Tunisia' },
  { code: '+225', country: 'CI - Ivory Coast' },
  { code: '+233', country: 'GH - Ghana' },
  { code: '+251', country: 'ET - Ethiopia' },
  { code: '+256', country: 'UG - Uganda' },
  { code: '+260', country: 'ZM - Zambia' },
  { code: '+263', country: 'ZW - Zimbabwe' },
  { code: '+260', country: 'MW - Malawi' },
  { code: '+265', country: 'MZ - Mozambique' },
  { code: '+258', country: 'TG - Tanzania' },
  { code: '+255', country: 'KE - Kenya' },
  { code: '+237', country: 'CM - Cameroon' },
  { code: '+241', country: 'GA - Gabon' },
];

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length >= 5;
};

const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[^0-9]/g, '');
  return cleaned.length >= 5; // At least 5 digits
};

const validateName = (name: string): boolean => {
  const cleaned = name.replace(/[^a-zA-Z\s]/g, '').trim();
  return cleaned.length >= 2;
};

const isMeaningful = (text: string): boolean => {
  if (!text || text.trim().length < 4) return false;
  const cleaned = text.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  const letters = cleaned.replace(/[^a-z]/g, '');
  if (letters.length < 2) return false;
  return true;
};

const isValidInput = (text: string): boolean => {
  if (!text || text.trim().length < 10) return false;
  const cleaned = text.toLowerCase();
  // Check for at least 2 real words
  const words = cleaned.split(/\s+/).filter(w => w.length > 2);
  if (words.length < 2) return false;
  // Check that text has some character variety (not just repeated chars)
  const lettersOnly = cleaned.replace(/[^a-z]/g, '');
  if (lettersOnly.length < 8) return false;
  // Check not all same character repeated
  const uniqueChars = new Set(lettersOnly);
  return uniqueChars.size >= 4; // At least 4 different letters
};

const isValidOccupation = (text: string): boolean => {
  if (!text || text.trim().length < 3) return false;
  const cleaned = text.toLowerCase().replace(/[^a-z\s]/g, '');
  // Accept any reasonable job title
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

  const validateStep = (): boolean => {
    const stepError = getStepErrors();
    return stepError === null;
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
    // Final validation check
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
      // Map budget to tier
      let budgetTier = 'low';
      if (formData.budget === '$50–$150') budgetTier = 'medium';
      if (formData.budget === '$150+') budgetTier = 'high';

      const response = await fetch('/api/submit-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          budgetTier,
        }),
      });

      const data = await response.json();

      console.log('[Interview Submit] Response:', data);
      console.log('[Interview Submit] Report:', data.report);

      if (data.success) {
        // Store everything in sessionStorage for immediate access
        sessionStorage.setItem('executionOS_userId', data.userId);
        sessionStorage.setItem('executionOS_budgetTier', budgetTier);
        sessionStorage.setItem('executionOS_report', JSON.stringify(data.report));
        sessionStorage.setItem('executionOS_user', JSON.stringify(data.user));
        sessionStorage.setItem('executionOS_score', data.report.execution_score || '0');
        sessionStorage.setItem('executionOS_recommendation', data.report.ai_recommendation || 'blueprint');
        router.push(`/report?userId=${data.userId}`);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <a href="/" className={styles.backLink}>
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
              <h2 className={styles.stepTitle}>Let's start with the basics</h2>
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
              <h2 className={styles.stepTitle}>What's your budget?</h2>
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