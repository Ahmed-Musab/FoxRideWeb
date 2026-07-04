'use client';

import Sidebar from "./Sidebar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Calendar,
  Clock,
  MapPin,
  Briefcase,
  Plus,
  Bell,
  Car,
  ArrowRight,
  User,
  Layers
} from "lucide-react";
import Link from "next/link";

const EmployeeDashboard = () => {

  const getCompletedBookingsByEmail = async () => {
    try {
      const response = await axios.get("/api/employee/getCompletedBookingsByEmail");
      return response.data.booking || response.data.bookings || [];
    }
    catch (error) {
      console.log(error);
      return [];
    }
  }

  const { data: completedBookings = [], isLoading: completedBookingsLoading, error: completedBookingsError } = useQuery({
    queryKey: ["completedBookings"],
    queryFn: getCompletedBookingsByEmail
  });

  const getBookings = async () => {
    try {
      const response = await axios.get("/api/employee/getBookingByEmail");
      return response.data.booking || [];
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

  // Compute stats
  const totalBookings = bookings.length;

  const upcomingBookings = bookings.filter(b => {
    if (!b.date) return false;
    const bookingDate = new Date(b.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate >= today;
  });

  const pastBookingsCount = totalBookings - upcomingBookings.length;

  const renderSkeleton = () => (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-150 rounded-2xl p-6 h-28"></div>
        ))}
      </div>

      {/* Grid Skeleton */}
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
            <p className="text-sm">Failed to retrieve booking records. Please check your connection or reload the page.</p>
          </div>
        ) : (
          <div className="space-y-8">

            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Employee Portal</h1>
                <p className="text-gray-500 mt-1">Book your corporate rides, view schedules, and check notifications.</p>
              </div>
              <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm text-sm text-gray-600 font-medium">
                <Clock className="w-4 h-4 text-[#243b55]" />
                <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Total Bookings Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Bookings</span>
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-[#243b55] group-hover:text-white transition-all duration-300">
                    <Layers className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-3xl font-bold text-gray-900">{totalBookings}</h3>
                  <p className="text-xs text-gray-400 mt-1">Total bookings requested by you</p>
                </div>
              </div>

              {/* Active Bookings Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Upcoming Rides</span>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-3xl font-bold text-gray-900">{upcomingBookings.length}</h3>
                  <p className="text-xs text-emerald-600 mt-1 font-semibold">Scheduled and active</p>
                </div>
              </div>

              {/* Past Bookings Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Past Rides</span>
                  <div className="p-3 bg-gray-50 text-gray-500 rounded-xl group-hover:bg-gray-700 group-hover:text-white transition-all duration-300">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-3xl font-bold text-gray-900">{pastBookingsCount}</h3>
                  <p className="text-xs text-gray-400 mt-1">Archived trips completed</p>
                </div>
              </div>

            </div>

            {/* Dashboard Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left Side: Upcoming Rides Container */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Your Upcoming Bookings</h2>
                      <p className="text-xs text-gray-500 mt-0.5">List of active scheduled ride assignments</p>
                    </div>
                    <Link
                      href="/pages/bookingManagementEmployeePage"
                      className="text-sm font-bold text-[#243b55] hover:text-[#1a2d42] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Manage Bookings</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {upcomingBookings.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                      <Car className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm font-medium">No upcoming bookings found.</p>
                      <Link
                        href="/pages/bookingManagementEmployeePage"
                        className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#243b55] text-white rounded-xl text-xs font-semibold hover:bg-[#243b55]/95 shadow transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Book a Ride Now
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {upcomingBookings.map((b) => (
                        <div
                          key={b._id}
                          className="border border-gray-200 rounded-xl p-5 flex flex-col justify-between hover:border-blue-300 hover:shadow-sm transition-all"
                        >
                          <div>
                            <div className="flex justify-between items-start gap-3 mb-3">
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Booking ID: #{b._id.slice(-6)}</span>
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${b.bookingNature === "Pickup" ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
                                  b.bookingNature === "Dropoff" ? "bg-blue-50 border-blue-100 text-blue-700" :
                                    "bg-gray-50 border-gray-100 text-gray-600"
                                }`}>
                                {b.bookingNature}
                              </span>
                            </div>

                            <h3 className="font-bold text-gray-900 text-sm truncate" title={b.purpose}>
                              {b.purpose}
                            </h3>

                            <div className="space-y-2 mt-4 text-xs text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                <span>{b.date ? new Date(b.date).toLocaleDateString() : ""} at <span className="font-semibold">{b.time}</span></span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                <span className="truncate" title={b.location}>{b.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-gray-400" />
                                <span>Commuter: {b.bookingFor}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Quick Action & Shortcuts */}
              <div className="space-y-6">

                {/* Actions Box */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#243b55]" />
                    <span>Quick Shortcuts</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <Link
                      href="/pages/bookingManagementEmployeePage"
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#243b55] hover:bg-gray-50/50 transition-all text-sm font-semibold text-gray-700 group"
                    >
                      <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-gray-400 group-hover:text-[#243b55]" />
                        Book New Ride
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#243b55] transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                      href="/pages/alertManagementEmployeePage"
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#243b55] hover:bg-gray-50/50 transition-all text-sm font-semibold text-gray-700 group"
                    >
                      <span className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-gray-400 group-hover:text-[#243b55]" />
                        View Alerts Center
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#243b55] transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>

                {
                  completedBookingsLoading ? <div>Loading</div> : completedBookings.length === 0 ? <div>No completed bookings</div> : (
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#243b55]" />
                        <span>Your Completed Bookings</span>
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {completedBookings.map((b) => (
                          <div
                            key={b._id}
                            className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#243b55] hover:bg-gray-50/50 transition-all text-sm font-semibold text-gray-700 group"
                          >
                            <span className="flex items-center gap-2">
                              {b.purpose}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                }

                {/* Info Card */}
                <div className="bg-gradient-to-br from-[#243b55] to-[#1a2d42] text-white rounded-2xl p-6 shadow-md">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-blue-200">Commute Guideline</h4>
                  <p className="text-xs text-gray-200 mt-2 leading-relaxed">
                    Please ensure to request bookings at least 24 hours in advance to guarantee vehicle allocation by fleet supervisors.
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

export default EmployeeDashboard;