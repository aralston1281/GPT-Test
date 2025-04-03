import React from 'react';

function PDUCard({
  lineup,
  pduIndex,
  pduKey,
  load,
  maxKW,
  index,
  onChangeLoad,
  breakerSelection,
  toggleSubfeed,
  subfeedsPerPDU,
  maxSubfeedKW,
  formatPower,
}) {
  const selectedFeeds = Array.from({ length: subfeedsPerPDU }).filter((_, i) =>
    breakerSelection[`${pduKey}-S${i}`]
  );

  return (
    <div
      style={{
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        border: '1px solid #ddd',
      }}
    >
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>{pduKey}</strong> — Load:
        <input
          type="number"
          value={load}
          onChange={(e) => onChangeLoad(index, e.target.value)}
          style={{ marginLeft: '0.5rem', width: '100px' }}
        />
        <span
          style={{
            color: load > maxKW ? 'red' : 'green',
            marginLeft: '1rem',
          }}
        >
          {load > maxKW
            ? `Overloaded (${formatPower(load)} > ${formatPower(maxKW)})`
            : `OK (${formatPower(load)} ≤ ${formatPower(maxKW)})`}
        </span>
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <label style={{ fontWeight: 'bold' }}>Subfeeds:</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {Array.from({ length: subfeedsPerPDU }).map((_, i) => {
            const key = `${pduKey}-S${i}`;
            const isSelected = !!breakerSelection[key];
            const feedLoad =
              isSelected && selectedFeeds.length > 0
                ? load / selectedFeeds.length
                : 0;
            const overLimit = isSelected && feedLoad > maxSubfeedKW;

            return (
              <label
                key={key}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  fontSize: '12px',
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSubfeed(pduKey, i)}
                />
                S{i + 1}
                <span style={{ color: overLimit ? 'red' : '#666' }}>
                  {isSelected ? `${formatPower(feedLoad)}${overLimit ? ' ⚠️' : ''}` : ''}
                </span>
                <span style={{ fontSize: '10px', color: '#999' }}>
                  Max {formatPower(maxSubfeedKW)}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PDUCard;
