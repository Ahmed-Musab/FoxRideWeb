'use client'

import Sidebar from "./Sidebar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Clock, Layers, AlertTriangle, CheckCircle, X, ArrowRight, ShieldCheck, Plus, Bell } from "lucide-react";
import Link from "next/link";

const ManagerDashboard = () => {

  const getBookings = async () => {
    const response = await axios.get("/api/employee/getBookings");
    return response?.data?.bookings || [];
  }

  const { data: bookings = [], isLoading: bookingsLoading, isError: bookingsError } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });

  // Calculate statistics
  const totalBookings = bookings.length;
  const pendingApprovals = bookings.filter(b => b.status === "Pending" || !b.status);
  const approvedBookings = bookings.filter(b => b.status === "Approved");
  const rejectedBookings = bookings.filter(b => b.status === "Rejected");

  const renderSkeleton = () => (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-150 rounded-2xl p-6 h-28"></div>
        ))}
      </div>
      <div className="bg-white border border-gray-150 rounded-2xl p-6 h-96"></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <Sidebar />
      </aside>
      
      <main className="flex-1 p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {bookingsLoading ? (
          renderSkeleton()
        ) : bookingsError ? (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 p-6 rounded-2xl">
            <h3 className="font-bold text-lg mb-2">Error Loading Dashboard</h3>
            <p className="text-sm">Failed to retrieve bookings metrics. Please refresh the page.</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manager Dashboard</h1>
                <p className="text-gray-500 mt-1">Approve team travel requests, supervise bookings, and monitor department compliance.</p>
              </div>
              <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm text-sm text-gray-600 font-medium">
                <Clock className="w-4 h-4 text-[#243b55]" />
                <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Total Requests Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Requests</span>
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-[#243b55] group-hover:text-white transition-all duration-300">
                    <Layers className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-3xl font-bold text-gray-900">{totalBookings}</h3>
                  <p className="text-xs text-gray-400 mt-1">Travel requests logged</p>
                </div>
              </div>

              {/* Pending Approvals Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Pending Action</span>
                  <div className={`p-3 rounded-xl transition-all duration-300 ${
                    pendingApprovals.length > 0 ? "bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white" : "bg-gray-50 text-gray-400"
                  }`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-3xl font-bold text-gray-900">{pendingApprovals.length}</h3>
                  <p className="text-xs text-amber-600 font-semibold mt-1">Requires review</p>
                </div>
              </div>

              {/* Approved Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Approved</span>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-3xl font-bold text-gray-900">{approvedBookings.length}</h3>
                  <p className="text-xs text-emerald-600 mt-1 font-semibold">Ready for dispatch</p>
                </div>
              </div>

              {/* Rejected Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Rejected</span>
                  <div className="p-3 bg-rose-50 text-rose-500 rounded-xl group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                    <X className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-3xl font-bold text-gray-900">{rejectedBookings.length}</h3>
                  <p className="text-xs text-gray-400 mt-1">Rejected queries</p>
                </div>
              </div>

            </div>

            {/* Dashboard Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Recent Pending Approvals */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Awaiting Your Approval</h2>
                      <p className="text-xs text-gray-500 mt-0.5">Approve or reject pending employee commute bookings</p>
                    </div>
                    <Link 
                      href="/pages/bookingManagementManagerPage" 
                      className="text-sm font-bold text-[#243b55] hover:text-[#1a2d42] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Approvals Panel</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {pendingApprovals.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                      <CheckCircle className="w-12 h-12 mx-auto mb-2 text-emerald-400" />
                      <p className="text-sm font-medium">All caught up! No pending approvals.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingApprovals.slice(0, 4).map((b) => (
                        <div 
                          key={b._id} 
                          className="flex items-center justify-between border border-gray-100 p-4 rounded-xl hover:border-blue-200 transition-all bg-gray-50/20"
                        >
                          <div className="min-w-0 flex-1 pr-4">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-800 text-sm truncate">{b.employee || "Guest"}</span>
                              <span className="text-[10px] text-gray-400">({b.department || "Staff"})</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 truncate font-medium">Purpose: {b.purpose}</p>
                            <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400 font-semibold">
                              <span>Date: {b.date ? new Date(b.date).toLocaleDateString() : ""}</span>
                              <span>Time: {b.time}</span>
                            </div>
                          </div>
                          <Link 
                            href="/pages/bookingManagementManagerPage"
                            className="flex items-center gap-1 text-[#243b55] hover:text-[#1a2d42] text-xs font-bold shrink-0 transition"
                          >
                            <span>Review</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Quick Shortcuts */}
              <div className="space-y-6">
                
                {/* Actions Box */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#243b55]" />
                    <span>Manager Controls</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <Link 
                      href="/pages/bookingManagementManagerPage"
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#243b55] hover:bg-gray-50/50 transition-all text-sm font-semibold text-gray-700 group"
                    >
                      <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-gray-400 group-hover:text-[#243b55]" />
                        Review Ride Requests
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#243b55] transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <Link 
                      href="/pages/alertManagementEmployeePage"
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#243b55] hover:bg-gray-50/50 transition-all text-sm font-semibold text-gray-700 group"
                    >
                      <span className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-gray-400 group-hover:text-[#243b55]" />
                        View Alerts Monitor
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#243b55] transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-gradient-to-br from-[#243b55] to-[#1a2d42] text-white rounded-2xl p-6 shadow-md">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-blue-200">Security Note</h4>
                  <p className="text-xs text-gray-200 mt-2 leading-relaxed">
                    Make sure to verify route nature and self-driving criteria before approving requests to stay in line with company insurance guidelines.
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default ManagerDashboard;