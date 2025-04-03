import React from 'react';
import PDUCard from './PDUCard';

function LineupSection({
  lineup,
  lineupIndex,
  pduList,
  customDistribution,
  breakerSelection,
  toggleSubfeed,
  handleCustomChange,
  subfeedsPerPDU,
  maxSubfeedKW,
  pduMaxKW,
}) {
  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>{lineup}</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {pduList.map((pduIndex, pj) => {
          const overallIndex =
            pduList.slice(0, pj).length +
            pduList.length * lineupIndex;

          const pduKey = `PDU-${lineup}-${pduIndex + 1}`;
          const load = customDistribution[overallIndex] || 0;

          return (
            <PDUCard
              key={pduKey}
              pduKey={pduKey}
              load={load}
              index={overallIndex}
              onChangeLoad={handleCustomChange}
              breakerSelection={breakerSelection}
              toggleSubfeed={toggleSubfeed}
              subfeedsPerPDU={subfeedsPerPDU}
              maxSubfeedKW={maxSubfeedKW}
              pduMaxKW={pduMaxKW}
            />
          );
        })}
      </div>
    </div>
  );
}

export default LineupSection;
