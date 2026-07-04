"use client";

import Sidebar from "./Sidebar";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { 
  CalendarCheck, 
  Car, 
  Users, 
  Bell, 
  AlertTriangle, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Activity,
  Info,
  Clock,
  Plus,
  Shield
} from "lucide-react";
import Link from "next/link";

const AdminDashboard = () => {

  const getBookings = async () => {
    try {
      const response = await axios.get("/api/employee/getBookings");
      return response.data.bookings || [];
    }
    catch (error) {
      console.log(error);
      return [];
    }
  }

  const { data: bookings = [], isLoading: bookingsLoading, error: bookingsError } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings
  });

  const getVehicles = async () => {
    try {
      const response = await axios.get("/api/admin/getVehicles");
      return response.data.vehicles || [];
    }
    catch (error) {
      console.log(error);
      return [];
    }
  }

  const { data: vehicles = [], isLoading: vehiclesLoading, error: vehiclesError } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles
  });

  const getEmployees = async () => {
    try {
      const response = await axios.get("/api/employee/getEmployees");
      return response.data.employees || [];
    }
    catch (error) {
      console.log(error);
      return [];
    }
  }

  const { data: employees = [], isLoading: employeesLoading, error: employeesError } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees
  });

  const getAlerts = async () => {
    try {
      const response = await axios.get("/api/admin/getAlerts");
      return response.data.alerts || [];
    }
    catch (error) {
      console.log(error);
      return [];
    }
  }

  const { data: alerts = [], isLoading: alertsLoading, error: alertsError } = useQuery({
    queryKey: ["alerts"],
    queryFn: getAlerts
  });

  // Calculate dynamic statistics
  const activeAlertsCount = alerts.filter(a => a.isActive).length;
  
  const vehicleStats = vehicles.reduce((acc, curr) => {
    const status = curr.vehicleStatus || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const bookingStats = bookings.reduce((acc, curr) => {
    const type = curr.bookingFor || "Employee";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Sort and fetch recent rows
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .slice(0, 5);

  const activeAlerts = [...alerts]
    .filter(a => a.isActive)
    .sort((a, b) => new Date(b.createdAt || b.alertDate) - new Date(a.createdAt || a.alertDate))
    .slice(0, 5);

  const isLoading = bookingsLoading || vehiclesLoading || employeesLoading || alertsLoading;
  const isError = bookingsError || vehiclesError || employeesError || alertsError;

  const renderSkeleton = () => (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
      
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-150 rounded-2xl p-6 h-32"></div>
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-150 rounded-2xl p-6 h-[400px]"></div>
        </div>
        <div className="space-y-6">
          <div className="bg-white border border-gray-150 rounded-2xl p-6 h-[400px]"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <Sidebar />
      </aside>
      
      <main className="flex-1 p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {isLoading ? (
          renderSkeleton()
        ) : isError ? (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 p-6 rounded-2xl">
            <h3 className="font-bold text-lg mb-2">Error Loading Dashboard</h3>
            <p className="text-sm">There was a problem communicating with the server APIs. Please reload or contact technical support.</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Greeting Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
                <p className="text-gray-500 mt-1">Real-time fleet operations, bookings activity, and system health status.</p>
              </div>
              <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm text-sm text-gray-600 font-medium">
                <Clock className="w-4 h-4 text-[#243b55]" />
                <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Total Bookings Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Bookings</span>
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <CalendarCheck className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-bold text-gray-900">{bookings.length}</h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 font-medium">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                      {bookingStats.Employee || 0} Employee
                    </span>
                    <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded">
                      {bookingStats.Guest || 0} Guest
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Vehicles Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Vehicles</span>
                  <div className="p-3 bg-[#243b55]/10 text-[#243b55] rounded-xl group-hover:bg-[#243b55] group-hover:text-white transition-all duration-300">
                    <Car className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-bold text-gray-900">{vehicles.length}</h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 font-medium">
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                      {vehicleStats.Active || 0} Active
                    </span>
                    {vehicleStats.Maintenance && (
                      <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded">
                        {vehicleStats.Maintenance} Maint.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Employees Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Employees</span>
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-bold text-gray-900">{employees.length}</h3>
                  <p className="text-xs text-gray-400 mt-2 font-medium">Active staff accounts registered</p>
                </div>
              </div>

              {/* Active Alerts Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Active Alerts</span>
                  <div className={`p-3 rounded-xl transition-all duration-300 ${
                    activeAlertsCount > 0 
                      ? "bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white" 
                      : "bg-gray-50 text-gray-400"
                  }`}>
                    <Bell className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-bold text-gray-900">{activeAlertsCount}</h3>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500 font-medium">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      activeAlertsCount > 0 ? "bg-rose-500 animate-pulse" : "bg-gray-300"
                    }`} />
                    <span>{activeAlertsCount > 0 ? "Needs immediate review" : "System fully operational"}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Dashboard Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Main Column: Recent Bookings & Fleet Status */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Recent Bookings Table */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
                      <p className="text-xs text-gray-500 mt-0.5">Summary of the latest ride bookings requested</p>
                    </div>
                    <Link 
                      href="/pages/bookingManagementAdminPage" 
                      className="text-sm font-bold text-[#243b55] hover:text-[#1a2d42] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="overflow-x-auto">
                    {recentBookings.length === 0 ? (
                      <div className="px-6 py-12 text-center text-gray-400">
                        <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm font-medium">No bookings logged yet.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-3">Booker / Employee</th>
                            <th className="px-6 py-3">Purpose</th>
                            <th className="px-6 py-3">Date & Time</th>
                            <th className="px-6 py-3">Nature / Loc. Type</th>
                            <th className="px-6 py-3">Destination</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                          {recentBookings.map((b) => (
                            <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="font-semibold text-gray-800">{b.employee || "Guest"}</div>
                                <div className="text-[11px] text-gray-400">{b.department || "N/A"}</div>
                              </td>
                              <td className="px-6 py-4 text-gray-600 max-w-[150px] truncate" title={b.purpose}>
                                {b.purpose}
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-gray-700 font-medium">
                                  {b.date ? new Date(b.date).toLocaleDateString() : ""}
                                </div>
                                <div className="text-[11px] text-gray-400">{b.time}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-1.5">
                                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                                    b.bookingNature === "Pickup" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                                    b.bookingNature === "Dropoff" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                                    "bg-gray-50 text-gray-600 border border-gray-100"
                                  }`}>
                                    {b.bookingNature}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-500 max-w-[140px] truncate" title={b.location}>
                                {b.location}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Fleet Breakdown Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Vehicle Fleet Status Breakdown */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#243b55]" />
                      <span>Vehicle Status Overview</span>
                    </h3>
                    {vehicles.length === 0 ? (
                      <p className="text-sm text-gray-400">No vehicles available</p>
                    ) : (
                      <div className="space-y-3.5">
                        {Object.entries(vehicleStats).map(([status, count]) => {
                          const percentage = Math.round((count / vehicles.length) * 100);
                          return (
                            <div key={status} className="space-y-1.5">
                              <div className="flex justify-between text-xs font-semibold text-gray-700">
                                <span>{status}</span>
                                <span>{count} ({percentage}%)</span>
                              </div>
                              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    status.toLowerCase() === 'active' ? 'bg-emerald-500' :
                                    status.toLowerCase() === 'maintenance' ? 'bg-rose-500' :
                                    'bg-gray-400'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Booking Nature Summary */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#243b55]" />
                      <span>Booking Type Mix</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 text-center">
                        <div className="text-xs font-semibold text-indigo-600 uppercase">Employee</div>
                        <div className="text-2xl font-bold text-indigo-900 mt-1">{bookingStats.Employee || 0}</div>
                        <div className="text-[10px] text-indigo-500 mt-0.5">Staff commuters</div>
                      </div>
                      <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 text-center">
                        <div className="text-xs font-semibold text-amber-600 uppercase">Guest</div>
                        <div className="text-2xl font-bold text-amber-900 mt-1">{bookingStats.Guest || 0}</div>
                        <div className="text-[10px] text-amber-500 mt-0.5">External rides</div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Right Side Column: Active Alerts & Quick Actions */}
              <div className="space-y-8">
                
                {/* Active Alerts Timeline */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900">Active System Alerts</h3>
                      <p className="text-xs text-gray-400">Issues demanding action</p>
                    </div>
                    <span className="bg-rose-50 text-rose-700 px-2.5 py-1 text-xs font-bold rounded-lg border border-rose-100">
                      {activeAlertsCount} Active
                    </span>
                  </div>

                  <div className="space-y-4">
                    {activeAlerts.length === 0 ? (
                      <div className="py-8 text-center text-gray-400">
                        <Info className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-xs font-medium">All vehicle documents are current.</p>
                      </div>
                    ) : (
                      activeAlerts.map((a) => (
                        <div key={a._id} className="flex gap-3 p-3 rounded-xl border border-rose-100 bg-rose-50/30">
                          <div className="p-2 bg-rose-50 text-rose-600 rounded-lg self-start">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-sm text-gray-800 truncate" title={a.alertName}>
                              {a.alertName}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              VRN: <span className="font-semibold text-gray-700">{a.VRN}</span>
                            </div>
                            <div className="text-[10px] text-gray-400 mt-1">
                              {a.alertDate ? new Date(a.alertDate).toLocaleDateString() : ""}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Quick Admin Actions */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#243b55]" />
                    <span>Control shortcuts</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <Link 
                      href="/pages/vehicleManagementAdminPage"
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#243b55] hover:bg-gray-50/50 transition-all text-sm font-semibold text-gray-700 group"
                    >
                      <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-gray-400 group-hover:text-[#243b55]" />
                        Manage Fleet
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#243b55] transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <Link 
                      href="/pages/usersPage"
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#243b55] hover:bg-gray-50/50 transition-all text-sm font-semibold text-gray-700 group"
                    >
                      <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-gray-400 group-hover:text-[#243b55]" />
                        Manage Users
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#243b55] transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <Link 
                      href="/pages/alertManagementAdminPage"
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#243b55] hover:bg-gray-50/50 transition-all text-sm font-semibold text-gray-700 group"
                    >
                      <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-gray-400 group-hover:text-[#243b55]" />
                        Configure Alerts
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#243b55] transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
