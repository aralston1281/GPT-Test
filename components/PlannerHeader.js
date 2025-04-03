// components/PlannerHeader.js

import React from 'react';

function PlannerHeader({
  targetLoadMW,
  setTargetLoadMW,
  autoDistribute,
  resetAll,
  totalPDUs,
  evenLoadPerPDU,
  pduMaxKW,
  totalAvailableCapacityMW,
  totalCustomKW,
  savePlannerState,
  loadPlannerState,
}) {
  const formatPower = (value) =>
    value >= 1000 ? `${(value / 1000).toFixed(2)} MW` : `${value.toFixed(2)} kW`;

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <label>
          Target Load (MW):
          <input
            type="number"
            value={targetLoadMW}
            onChange={(e) => setTargetLoadMW(Number(e.target.value))}
            style={{ marginLeft: '0.5rem', width: '80px' }}
          />
        </label>
        <button onClick={autoDistribute} disabled={totalPDUs === 0}>
          Auto Distribute
        </button>
        <button onClick={resetAll}>Clear All</button>
        <button onClick={savePlannerState}>💾 Save</button>
        <button onClick={loadPlannerState}>📂 Load</button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <p>
          Total PDUs in use: <strong>{totalPDUs}</strong>
        </p>
        <p>
          Required Even Load per PDU: <strong>{formatPower(evenLoadPerPDU)}</strong>
        </p>
        <p>
          Max Capacity per Selected PDU: <strong>{formatPower(pduMaxKW)}</strong>
        </p>
        <p>
          Total Available System Capacity: <strong>{totalAvailableCapacityMW} MW</strong>
        </p>
        <p>
          Total Custom Load: <strong>{formatPower(totalCustomKW)}</strong>
        </p>
      </div>
    </div>
  );
}

export default PlannerHeader;
