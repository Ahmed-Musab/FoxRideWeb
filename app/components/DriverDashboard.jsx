"use client";

import Sidebar from "./Sidebar";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { 
  CalendarCheck, 
  Clock, 
  User as UserIcon
} from "lucide-react";

const DriverDashboard = () => {
  const queryClient = useQueryClient();

  // Fetch functions for React Query
  const getApprovedBookings = async () => {
    const response = await axios.get("/api/driver/getApprovedBookingsByDriver");
    return response.data.bookings || [];
  };

  const getAllBookings = async () => {
    const response = await axios.get("/api/driver/getBookingsByDriver");
    return response.data.bookings || [];
  };

  // Queries
  const { data: approvedBookings = [], isLoading: approvedLoading } = useQuery({
    queryKey: ["approvedBookingsByDriver"],
    queryFn: getApprovedBookings
  });

  const { data: allBookings = [], isLoading: allBookingsLoading } = useQuery({
    queryKey: ["allBookingsByDriver"],
    queryFn: getAllBookings
  });

  // Mutations
  const completeBookingMutation = useMutation({
    mutationFn: async (bookingID) => {
      await axios.put(`/api/driver/completeBooking`, { bookingID });
    },
    onSuccess: () => {
      // Invalidate and refetch the queries to update the UI
      queryClient.invalidateQueries({ queryKey: ["approvedBookingsByDriver"] });
      queryClient.invalidateQueries({ queryKey: ["allBookingsByDriver"] });
      toast.success("Booking completed successfully!");
    },
    onError: (error) => {
      console.error("Error completing booking:", error);
      toast.error("Failed to complete booking");
    }
  });

  const loading = approvedLoading || allBookingsLoading;

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Completed":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <Sidebar />
      </aside>

      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-12 bg-gray-200 rounded-xl w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded-2xl w-full"></div>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Driver Portal</h1>
                <p className="text-gray-500 mt-1">View and manage your assigned bookings.</p>
              </div>
            </div>

            {/* Bookings Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Approved Bookings Column */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Approved Bookings</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Rides approved and assigned to you</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold">
                    {approvedBookings.length} Active
                  </span>
                </div>

                <div className="divide-y divide-gray-100">
                  {approvedBookings.length === 0 ? (
                    <div className="p-10 text-center text-gray-400">
                      <CalendarCheck className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm font-medium">No approved bookings assigned to you.</p>
                    </div>
                  ) : (
                    approvedBookings.map((b) => (
                      <div key={b._id} className="p-6 space-y-3 hover:bg-gray-50/40 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900 text-base">{b.location}</span>
                          <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                            {b.bookingNature}
                          </span>
                        </div>
                        <div className="flex items-center gap-x-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                            {b.employee}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            {new Date(b.date).toLocaleDateString()} @ {b.time}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 italic">"{b.purpose}"</p>
                        <button className="cursor-pointer w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700" onClick={() => completeBookingMutation.mutate(b._id)}>Complete Ride</button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* All Bookings (History) Column */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-lg font-bold text-gray-900">All Bookings</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Complete history of all your bookings</p>
                </div>

                <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                  {allBookings.length === 0 ? (
                    <div className="p-10 text-center text-gray-400">
                      <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm font-medium">No bookings logged under your name.</p>
                    </div>
                  ) : (
                    allBookings.map((b) => (
                      <div key={b._id} className="p-5 flex items-center justify-between hover:bg-gray-50/30">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{b.location}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{new Date(b.date).toLocaleDateString()} - {b.time}</p>
                        </div>
                        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(b.status)}`}>
                          {b.status}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default DriverDashboard;
