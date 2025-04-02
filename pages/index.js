import LoadDistributionPlanner from '../LoadDistributionPlanner';
import config from '../config.json';

export default function Home() {
  return <LoadDistributionPlanner config={config} />;
}
