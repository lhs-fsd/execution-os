import { Suspense } from 'react';
import PlansClient from './PlansClient';

export default function PlansPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #ccc', borderTopColor: '#00d4a1', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <PlansClient />
    </Suspense>
  );
}