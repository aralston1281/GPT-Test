import React, { useState, useEffect } from 'react';

function ConfigLoader({ onLoad }) {
  const [availableConfigs, setAvailableConfigs] = useState([]);
  const [selectedKey, setSelectedKey] = useState('');

  useEffect(() => {
    fetch('/api/list')
      .then(res => res.json())
      .then(setAvailableConfigs)
      .catch(console.error);
  }, []);

  const handleLoad = async () => {
    if (!selectedKey) return alert('Choose a config to load');
    const res = await fetch(`/api/load?key=${selectedKey}`);
    const data = await res.json();
    onLoad(data);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label>
        Load Saved Config:{' '}
        <select
          value={selectedKey}
          onChange={(e) => setSelectedKey(e.target.value)}
        >
          <option value="">Select</option>
          {availableConfigs.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </label>
      <button onClick={handleLoad} style={{ marginLeft: '0.5rem' }}>
        Load
      </button>
    </div>
  );
}

export default ConfigLoader;
