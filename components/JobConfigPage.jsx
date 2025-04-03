import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ConfigLoader from '../components/ConfigLoader';

function JobConfigPage({ onConfigLoad }) {
  const router = useRouter();

  const [jobName, setJobName] = useState('');
  const [lineupNames, setLineupNames] = useState('A01,A02,B01,B02');
  const [pduCountPerLineup, setPduCountPerLineup] = useState(2);
  const [pduMainBreakerTrip, setPduMainBreakerTrip] = useState(996);
  const [pduMainVoltage, setPduMainVoltage] = useState(480);
  const [subfeedBreakerTrip, setSubfeedBreakerTrip] = useState(600);
  const [subfeedVoltage, setSubfeedVoltage] = useState(415);

  const handleConfigLoad = (data) => {
    setJobName(data.jobName || '');
    setLineupNames((data.lineupNames || []).join(','));
    setPduCountPerLineup(data.pduCountPerLineup || 2);
    setPduMainBreakerTrip(data.pduMainBreakerTrip || 996);
    setPduMainVoltage(data.pduMainVoltage || 480);
    setSubfeedBreakerTrip(data.subfeedBreakerTrip || 600);
    setSubfeedVoltage(data.subfeedVoltage || 415);
    if (onConfigLoad) onConfigLoad(data);
  };

  const handleLaunch = () => {
    const lineups = lineupNames.split(',').map(name => name.trim());
    const pduConfigs = lineups.map(() => Array(pduCountPerLineup).fill('PDU'));
    const config = {
      jobName,
      lineupNames: lineups,
      pduConfigs,
      pduMainBreakerTrip,
      pduMainVoltage,
      subfeedBreakerTrip,
      subfeedVoltage
    };
    if (onConfigLoad) onConfigLoad(config);
    localStorage.setItem('jobConfig', JSON.stringify(config));
    router.push('/planner');
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Job Configuration</h1>

      <ConfigLoader onLoad={handleConfigLoad} />

      <div style={{ margin: '1rem 0' }}>
        <label>Job Name:</label>
        <input type="text" value={jobName} onChange={(e) => setJobName(e.target.value)} />
      </div>

      <div style={{ margin: '1rem 0' }}>
        <label>Lineup Names (comma separated):</label>
        <input type="text" value={lineupNames} onChange={(e) => setLineupNames(e.target.value)} />
      </div>

      <div style={{ margin: '1rem 0' }}>
        <label>PDUs per Lineup:</label>
        <input type="number" value={pduCountPerLineup} onChange={(e) => setPduCountPerLineup(parseInt(e.target.value))} />
      </div>

      <div style={{ margin: '1rem 0' }}>
        <label>PDU Main Breaker Trip (Amps):</label>
        <input type="number" value={pduMainBreakerTrip} onChange={(e) => setPduMainBreakerTrip(Number(e.target.value))} />
      </div>

      <div style={{ margin: '1rem 0' }}>
        <label>PDU Main Voltage (Volts):</label>
        <input type="number" value={pduMainVoltage} onChange={(e) => setPduMainVoltage(Number(e.target.value))} />
      </div>

      <div style={{ margin: '1rem 0' }}>
        <label>Subfeed Breaker Trip (Amps):</label>
        <input type="number" value={subfeedBreakerTrip} onChange={(e) => setSubfeedBreakerTrip(Number(e.target.value))} />
      </div>

      <div style={{ margin: '1rem 0' }}>
        <label>Subfeed Voltage (Volts):</label>
        <input type="number" value={subfeedVoltage} onChange={(e) => setSubfeedVoltage(Number(e.target.value))} />
      </div>

      <button onClick={handleLaunch} style={{ marginTop: '1rem' }}>Launch Planner</button>
    </div>
  );
}

export default JobConfigPage;
