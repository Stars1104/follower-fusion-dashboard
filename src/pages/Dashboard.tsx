
import RevenueMetrics from '@/components/analytics/RevenueMetrics';
import MetricsRow from '@/components/analytics/MetricsRow';
import SalesConversion from '@/components/analytics/SalesConversion';
import { PerformanceGraph } from '@/components/analytics/PerformanceGraph';
import RecentOrders from '@/components/analytics/RecentOrders';
import ServiceDistribution from '@/components/analytics/ServiceDistribution';
import CountryMap from '@/components/analytics/CountryMap';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Revenue Overview */}
      <RevenueMetrics />
      
      {/* Metrics Row */}
      <MetricsRow />
      
      {/* Sales Conversion Metrics */}
      <SalesConversion />
      
      {/* Performance Graph */}
      <PerformanceGraph />
      
      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentOrders />
        <ServiceDistribution />
      </div>
      
      {/* Geographic Distribution */}
      <CountryMap />
    </div>
  );
};

export default Dashboard;
