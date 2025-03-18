
import { MetricCard } from '@/components/analytics/MetricCard';

const MetricsRow = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      <MetricCard
        title="Total Followers"
        value="24.5K"
        change={7.2}
        type="followers"
        delay={0.1}
      />
      <MetricCard
        title="Total Likes"
        value="152.3K"
        change={-2.1}
        type="likes"
        delay={0.2}
      />
      <MetricCard
        title="Total Views"
        value="3.4M"
        change={12.4}
        type="views"
        delay={0.3}
      />
      <MetricCard
        title="Total Comments"
        value="63.8K"
        change={4.8}
        type="comments"
        delay={0.4}
      />
    </div>
  );
};

export default MetricsRow;
