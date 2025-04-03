import React, { useEffect, useState } from 'react';
import PlannerHeader from './PlannerHeader';
import LineupSection from './LineupSection';
import { parseConfig } from '../utils/parseConfig';

function LoadDistributionPlanner({ config }) {
  const { lineups: initialLineups = [], pduUsage: defaultPduUsage = {} } = parseConfig(config || {});
  const [selectedLineups, setSelectedLineups] = useState(initialLineups);
  const [customDistribution, setCustomDistribution] = useState([]);
  const [breakerSelection, setBreakerSelection] = useState({});
  const [pduUsage, setPduUsage] = useState(defaultPduUsage);
  const [lineupWarnings, setLineupWarnings] = useState({});
  const [unassignedKW, setUnassignedKW] = useState(0);

  const subfeedsPerPDU = 8;
  const subfeedBreakerAmps = config?.subfeedBreakerTrip || 600;
  const subfeedVoltage = config?.subfeedVoltage || 415;
  const powerFactor = 1.0;
  const maxSubfeedKW = (Math.sqrt(3) * subfeedVoltage * subfeedBreakerAmps * powerFactor) / 1000;

  const pduMainBreakerAmps = config?.pduMainBreakerTrip || 996;
  const pduVoltage = config?.pduMainVoltage || 480;
  const pduMaxKW = (Math.sqrt(3) * pduVoltage * pduMainBreakerAmps * powerFactor * 0.8) / 1000;

  const formatPower = (kw) => (kw >= 1000 ? `${(kw / 1000).toFixed(2)} MW` : `${kw.toFixed(2)} kW`);

  const getDefaultBreakerSelection = () => {
    const defaults = {};
    initialLineups.forEach((lineup, lineupIdx) => {
      const pdus = config?.pduConfigs?.[lineupIdx] || [];
      pdus.forEach((_, pduIdx) => {
        for (let i = 0; i < 3; i++) {
          defaults[`PDU-${lineup}-${pduIdx + 1}-S${i}`] = true;
        }
      });
    });
    return defaults;
  };

  useEffect(() => {
    setBreakerSelection(getDefaultBreakerSelection());
  }, [selectedLineups, pduUsage]);

  const safeLineups = Array.isArray(selectedLineups) ? selectedLineups : [];
  const totalPDUs = safeLineups.reduce((acc, lineup) => acc + (pduUsage[lineup]?.length || 0), 0);
  const evenLoadPerPDU = totalPDUs > 0 ? (config?.targetLoadMW || 5) * 1000 / totalPDUs : 0;
  const totalAvailableCapacityMW = ((totalPDUs * pduMaxKW) / 1000).toFixed(2);
  const totalCustomKW = parseFloat(customDistribution.reduce((acc, val) => acc + (val || 0), 0).toFixed(2));

  const handleCustomChange = (index, value) => {
    const updated = [...customDistribution];
    updated[index] = Number(parseFloat(value).toFixed(2));
    setCustomDistribution(updated);
  };

  const handleSubfeedToggle = (pduKey, subfeedIndex) => {
    setBreakerSelection((prev) => {
      const key = `${pduKey}-S${subfeedIndex}`;
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  };

  const toggleLineup = (lineup) => {
    setSelectedLineups((prev) =>
      prev.includes(lineup) ? prev.filter((l) => l !== lineup) : [...prev, lineup]
    );
  };

  const togglePdu = (lineup, pduIndex) => {
    setPduUsage((prev) => {
      const current = prev[lineup] || [];
      const updated = current.includes(pduIndex)
        ? current.filter((p) => p !== pduIndex)
        : [...current, pduIndex].sort();
      return { ...prev, [lineup]: updated };
    });
  };

  const autoDistribute = () => {
    const pduList = selectedLineups.flatMap((lineup) =>
      (pduUsage[lineup] || []).map((pduIndex) => `PDU-${lineup}-${pduIndex + 1}`)
    );

    const distributed = Array(pduList.length).fill(0);
    let remainingLoad = (config?.targetLoadMW || 5) * 1000;
    const lineupUsedKW = {};
    const pduCapacities = pduList.map((pduKey) => {
      const activeFeeds = Array.from({ length: subfeedsPerPDU })
        .map((_, i) => `${pduKey}-S${i}`)
        .filter((k) => breakerSelection[k]);
      const cap = activeFeeds.length > 0 ? activeFeeds.length * maxSubfeedKW : pduMaxKW;
      const lineup = pduKey.split('-')[1];
      lineupUsedKW[lineup] = lineupUsedKW[lineup] || 0;
      return cap;
    });

    const maxPerLineup = pduMaxKW * 2;
    while (remainingLoad > 0) {
      let anyAllocated = false;
      for (let i = 0; i < distributed.length; i++) {
        const pduKey = pduList[i];
        const cap = pduCapacities[i];
        const lineup = pduKey.split('-')[1];
        const current = distributed[i];
        const totalLineupLoad = lineupUsedKW[lineup];
        if (current >= cap || totalLineupLoad >= maxPerLineup) continue;
        const available = Math.min(cap - current, maxPerLineup - totalLineupLoad, 10);
        distributed[i] += available;
        lineupUsedKW[lineup] = totalLineupLoad + available;
        remainingLoad -= available;
        anyAllocated = true;
        if (remainingLoad <= 0) break;
      }
      if (!anyAllocated) break;
    }

    setUnassignedKW(remainingLoad);
    setCustomDistribution(distributed.map((val) => parseFloat(val.toFixed(2))));
    const warnings = {};
    Object.keys(lineupUsedKW).forEach((lineup) => {
      if (lineupUsedKW[lineup] >= maxPerLineup) warnings[lineup] = true;
    });
    setLineupWarnings(warnings);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
      <h1>{config?.jobName || 'Untitled Job'} — Load Distribution Planner</h1>

      <PlannerHeader
        targetLoadMW={config?.targetLoadMW || 5}
        setTargetLoadMW={() => {}}
        autoDistribute={autoDistribute}
        resetAll={() => {
          setCustomDistribution([]);
          setBreakerSelection(getDefaultBreakerSelection());
          setPduUsage(defaultPduUsage);
          setUnassignedKW(0);
        }}
        totalPDUs={totalPDUs}
        evenLoadPerPDU={evenLoadPerPDU}
        pduMaxKW={pduMaxKW}
        totalAvailableCapacityMW={totalAvailableCapacityMW}
        totalCustomKW={totalCustomKW}
      />

      {selectedLineups.map((lineup, li) => (
        <LineupSection
          key={lineup}
          lineup={lineup}
          pduList={pduUsage[lineup] || []}
          lineupIndex={li}
          pduUsage={pduUsage}
          selectedLineups={selectedLineups}
          customDistribution={customDistribution}
          pduMaxKW={pduMaxKW}
          breakerSelection={breakerSelection}
          toggleSubfeed={handleSubfeedToggle}
          handleCustomChange={handleCustomChange}
          subfeedsPerPDU={subfeedsPerPDU}
          maxSubfeedKW={maxSubfeedKW}
          lineupWarnings={lineupWarnings}
          formatPower={formatPower}
        />
      ))}
    </div>
  );
}

export default LoadDistributionPlanner;
