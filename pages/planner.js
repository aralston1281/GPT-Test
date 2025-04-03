import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const LoadDistributionPlanner = dynamic(
  () => import('../components/LoadDistributionPlanner'),
  { ssr: false }
);

export default function PlannerPage() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem('selectedConfig');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setConfig(parsed);
      } catch (err) {
        console.error('Failed to parse config:', err);
      }
    }
  }, []);

  if (!config) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>❌ No config found</h2>
        <p>Please return to the Job Config Page and complete your configuration.</p>
      </div>
    );
  }

  return <LoadDistributionPlanner config={config} />;
}
