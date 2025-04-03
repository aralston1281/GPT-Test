// utils/parseConfig.js

export function parseConfig(config) {
  const defaultLineups = ['A01', 'A02', 'B01', 'B02', 'C01', 'D01'];
  const defaultPDUsPerLineup = 2;

  const lineupNames =
    Array.isArray(config.lineupNames) && config.lineupNames.length > 0
      ? config.lineupNames
      : defaultLineups;

  const pduConfigs =
    Array.isArray(config.pduConfigs) && config.pduConfigs.length === lineupNames.length
      ? config.pduConfigs
      : lineupNames.map(() =>
          Array.from({ length: defaultPDUsPerLineup }, (_, idx) => `PDU-${idx + 1}`)
        );

  return {
    jobName: config.jobName || 'Untitled Job',
    lineupNames,
    pduConfigs,
    subfeedBreakerTrip: config.subfeedBreakerTrip || 600,
    subfeedVoltage: config.subfeedVoltage || 415,
    pduMainBreakerTrip: config.pduMainBreakerTrip || 996,
    pduMainVoltage: config.pduMainVoltage || 480,
  };
}
