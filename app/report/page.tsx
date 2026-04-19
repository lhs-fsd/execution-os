export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import ReportClient from './ReportClient';

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: 20 }}>
        <div style={{ width: 60, height: 60, border: '4px solid #ccc', borderTopColor: '#00d4a1', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: '#666', fontSize: 18 }}>Analyzing your execution patterns...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <ReportClient />
    </Suspense>
  );
}