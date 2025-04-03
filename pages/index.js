import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function JobConfigPage() {
  const router = useRouter();

  const [jobName, setJobName] = useState('');
  const [lineupCount, setLineupCount] = useState(4);
  const [lineupPrefix, setLineupPrefix] = useState('A,B');
  const [pduPerLineup, setPduPerLineup] = useState(2);

  const [pduMainBreakerTrip, setPduMainBreakerTrip] = useState(996);
  const [pduMainVoltage, setPduMainVoltage] = useState(480);
  const [subfeedBreakerTrip, setSubfeedBreakerTrip] = useState(600);
  const [subfeedVoltage, setSubfeedVoltage] = useState(415);

  const [savedNames, setSavedNames] = useState([]);
  const [selectedSave, setSelectedSave] = useState('');

  useEffect(() => {
    fetch('/api/list')
      .then((res) => res.json())
      .then(setSavedNames)
      .catch((err) => console.error('Failed to load saves', err));
  }, []);

  const generateLineups = () => {
    const prefixes = lineupPrefix.split(',').map(p => p.trim().toUpperCase());
    const total = lineupCount;
    const lineups = [];

    for (let i = 0; i < total; i++) {
      const prefix = prefixes[i % prefixes.length];
      const number = String(Math.floor(i / prefixes.length) + 1).padStart(2, '0');
      lineups.push(`${prefix}${number}`);
    }

    return lineups;
  };

  const buildConfig = () => {
    const lineups = generateLineups();
    const pduConfigs = lineups.map((_) =>
      Array.from({ length: pduPerLineup }, (_, i) => `PDU-${i + 1}`)
    );

    return {
      jobName,
      lineupNames: lineups,
      pduConfigs,
      pduMainBreakerTrip,
      pduMainVoltage,
      subfeedBreakerTrip,
      subfeedVoltage,
    };
  };

  const handleSave = async () => {
    const config = buildConfig();

    await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: jobName, config }),
    });

    alert('Saved!');
  };

  const handleLoad = async () => {
    if (!selectedSave) return;

    const res = await fetch(`/api/load?name=${selectedSave}`);
    const data = await res.json();
    const config = data.config;

    if (!config) return alert('Failed to load config');

    setJobName(config.jobName || '');
    setLineupCount(config.lineupNames?.length || 4);
    setLineupPrefix(
      [...new Set(config.lineupNames.map(name => name[0]))].join(',')
    );
    setPduPerLineup(config.pduConfigs?.[0]?.length || 2);
    setPduMainBreakerTrip(config.pduMainBreakerTrip || 996);
    setPduMainVoltage(config.pduMainVoltage || 480);
    setSubfeedBreakerTrip(config.subfeedBreakerTrip || 600);
    setSubfeedVoltage(config.subfeedVoltage || 415);
  };

  const handleContinue = () => {
    const config = buildConfig();
    localStorage.setItem('selectedConfig', JSON.stringify(config));
    router.push('/planner');
  };

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '1rem' }}>
      <h1>🔧 Job Configuration</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>Load Saved Config: </label>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            value={selectedSave}
            onChange={(e) => setSelectedSave(e.target.value)}
            placeholder="Select or type save name"
            list="saved-list"
            style={{ flex: 1 }}
          />
          <datalist id="saved-list">
            {savedNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
          <button onClick={handleLoad}>Load</button>
        </div>
      </div>

      <hr style={{ margin: '1.5rem 0' }} />

      <div style={{ marginBottom: '1rem' }}>
        <label>Job Name:</label>
        <input
          value={jobName}
          onChange={(e) => setJobName(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div>
          <label># of Lineups:</label>
          <input
            type="number"
            value={lineupCount}
            onChange={(e) => setLineupCount(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Lineup Prefixes (comma):</label>
          <input
            type="text"
            value={lineupPrefix}
            onChange={(e) => setLineupPrefix(e.target.value)}
            placeholder="A,B,C"
          />
        </div>
        <div>
          <label>PDUs per Lineup:</label>
          <input
            type="number"
            value={pduPerLineup}
            onChange={(e) => setPduPerLineup(Number(e.target.value))}
          />
        </div>
      </div>

      <h3 style={{ marginTop: '2rem' }}>Breaker Settings</h3>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label>PDU Main Breaker Trip (A):</label>
          <input
            type="number"
            value={pduMainBreakerTrip}
            onChange={(e) => setPduMainBreakerTrip(Number(e.target.value))}
          />
        </div>
        <div>
          <label>PDU Main Voltage (V):</label>
          <input
            type="number"
            value={pduMainVoltage}
            onChange={(e) => setPduMainVoltage(Number(e.target.value))}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <label>Subfeed Breaker Trip (A):</label>
          <input
            type="number"
            value={subfeedBreakerTrip}
            onChange={(e) => setSubfeedBreakerTrip(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Subfeed Voltage (V):</label>
          <input
            type="number"
            value={subfeedVoltage}
            onChange={(e) => setSubfeedVoltage(Number(e.target.value))}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={handleSave}>💾 Save Config</button>
        <button onClick={handleContinue}>➡ Continue to Planner</button>
      </div>
    </div>
  );
}
