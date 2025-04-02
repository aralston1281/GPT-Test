import React from 'react';
import PDUCard from './PDUCard';

function LineupSection({
  lineup,
  pduList,
  lineupIndex,
  pduUsage,
  selectedLineups,
  customDistribution,
  pduMaxKW,
  breakerSelection,
  toggleSubfeed,
  handleCustomChange,
  subfeedsPerPDU,
  maxSubfeedKW,
  lineupWarnings,
  formatPower,
}) {
  return (
    <div
      style={{
        borderTop: '1px solid #ccc',
        paddingTop: '1rem',
        marginTop: '1.5rem',
      }}
    >
      <h3>Lineup {lineup}</h3>

      {pduList.map((pduIdx, pj) => {
        const pduKey = `PDU-${lineup}-${pduIdx + 1}`;
        const distributionIndex = selectedLineups
          .slice(0, lineupIndex)
          .reduce((acc, l) => acc + (pduUsage[l]?.length || 0), 0) + pj;
        const load = customDistribution[distributionIndex] || 0;

        const selectedFeeds = Array.from({ length: subfeedsPerPDU }).filter((_, i) =>
          breakerSelection[`${pduKey}-S${i}`]
        );

        return (
          <PDUCard
            key={pduKey}
            lineup={lineup}
            pduIndex={pduIdx}
            pduKey={pduKey}
            load={load}
            maxKW={pduMaxKW}
            index={distributionIndex}
            onChangeLoad={handleCustomChange}
            breakerSelection={breakerSelection}
            toggleSubfeed={toggleSubfeed}
            subfeedsPerPDU={subfeedsPerPDU}
            maxSubfeedKW={maxSubfeedKW}
            formatPower={formatPower}
          />
        );
      })}
    </div>
  );
}

export default LineupSection;
