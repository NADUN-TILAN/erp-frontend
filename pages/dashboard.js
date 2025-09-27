import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { Line, Doughnut } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Configure axios defaults
const api = axios.create({
  baseURL: 'http://localhost:5004/api',
  timeout: 5000,
});
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StatCard = ({ title, value, change, icon: Icon }) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 rounded-lg bg-indigo-50">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      <div className={`flex items-center ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change >= 0 ? <ArrowUpIcon className="w-4 h-4 mr-1" /> : <ArrowDownIcon className="w-4 h-4 mr-1" />}
        <span className="text-sm font-medium">{Math.abs(change)}%</span>
      </div>
    </div>
    <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

export default function Dashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalOrders: 0,
    newCustomers: 0,
    pendingOrders: 0,
    salesTrend: 0,
    ordersTrend: 0,
    customersTrend: 0,
    pendingTrend: 0
  });
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: [{
      label: 'Monthly Sales',
      data: [],
      borderColor: 'rgb(79, 70, 229)',
      tension: 0.3,
    }]
  });
  const [categoryData, setCategoryData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        'rgba(79, 70, 229, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
    }]
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Use Promise.all to fetch all data concurrently
        const [statsResponse, salesResponse, categoryResponse, activityResponse] = await Promise.all([
          api.get('/reports/dashboard/stats'),
          api.get('/reports/dashboard/sales-trend'),
          api.get('/reports/dashboard/category-distribution'),
          api.get('/reports/dashboard/recent-activity')
        ]);

        // Update state with fetched data
        setDashboardData(statsResponse.data);

        setSalesData({
          labels: salesResponse.data.labels,
          datasets: [{
            label: 'Monthly Sales',
            data: salesResponse.data.values,
            borderColor: 'rgb(79, 70, 229)',
            tension: 0.3,
          }]
        });

        setCategoryData({
          labels: categoryResponse.data.labels,
          datasets: [{
            data: categoryResponse.data.values,
            backgroundColor: [
              'rgba(79, 70, 229, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
            ],
          }]
        });

        setRecentActivity(activityResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Show error message to user
        // You might want to add error state and display it in the UI
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchDashboardData();
      // Set up refresh interval
      const intervalId = setInterval(fetchDashboardData, 60000); // Refresh every minute
      
      // Cleanup interval on unmount
      return () => clearInterval(intervalId);
    }
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white/90 rounded-2xl shadow-xl p-10 w-full max-w-md text-center">
          <h1 className="text-2xl font-extrabold text-indigo-700 mb-2">Please sign in</h1>
          <p className="text-gray-500">You need to be logged in to view the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        {/* Welcome Section */}
        <div className="bg-white/90 shadow-xl rounded-2xl p-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {session.user.name}
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your store today.</p>
        </div>

        {/* Stats Grid */}
        <div className="bg-white/90 shadow-xl rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeletons for stats
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))
            ) : (
              <>
                <StatCard
                  title="Total Sales"
                  value={`$${dashboardData.totalSales?.toLocaleString() ?? '0'}`}
                  change={dashboardData.salesTrend}
                  icon={CurrencyDollarIcon}
                />
                <StatCard
                  title="Total Orders"
                  value={dashboardData.totalOrders?.toLocaleString() ?? '0'}
                  change={dashboardData.ordersTrend}
                  icon={ShoppingCartIcon}
                />
                <StatCard
                  title="New Customers"
                  value={dashboardData.newCustomers?.toLocaleString() ?? '0'}
                  change={dashboardData.customersTrend}
                  icon={UserGroupIcon}
                />
                <StatCard
                  title="Pending Orders"
                  value={dashboardData.pendingOrders?.toLocaleString() ?? '0'}
                  change={dashboardData.pendingTrend}
                  icon={ClipboardDocumentListIcon}
                />
              </>
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/90 rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Sales Overview</h3>
            <Line data={salesData} options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: { beginAtZero: true }
              }
            }} />
          </div>
          <div className="bg-white/90 rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Sales by Category</h3>
            <Doughnut data={categoryData} options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' }
              }
            }} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white/90 rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{activity.description}</p>
                    <p className="text-sm text-gray-500">{activity.timeAgo}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    activity.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    activity.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}