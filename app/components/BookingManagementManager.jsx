'use client'

import Sidebar from "./Sidebar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
  Check, 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Briefcase, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Layers
} from "lucide-react";

const BookingManagementManager = () => {
  const queryClient = useQueryClient();

  const getBookings = async () => {
    const response = await axios.get("/api/employee/getBookings");
    return response?.data?.bookings;
  }

  const { data: bookings, isLoading, isError } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });

  const approveBookingMutation = useMutation({
    mutationFn: async ({bookingID}) => {
      const response = await axios.post('/api/manager/approveBooking', { bookingID });
      return response?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]);
      toast.success("Booking approved successfully!");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to approve booking");
    }
  });

  const rejectBookingMutation = useMutation({
    mutationFn: async ({bookingID}) => {
      const response = await axios.post('/api/manager/rejectBooking', { bookingID });
      return response?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]);
      toast.success("Booking rejected successfully!");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to reject booking");
    }
  });

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white border border-gray-150 rounded-2xl p-6 h-64 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
          <div className="h-10 bg-gray-200 rounded-xl mt-4" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <Sidebar />
      </aside>
      
      <main className="flex-1 p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="border-b border-gray-200 pb-6 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Booking Approvals</h1>
          <p className="text-sm text-gray-500 mt-2">Manage employee commute requests, approve active booking logs, and review destination compliance.</p>
        </div>

        {isLoading ? (
          renderSkeleton()
        ) : isError ? (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 p-6 rounded-2xl">
            <h3 className="font-bold text-lg mb-2">Error Loading Bookings</h3>
            <p className="text-sm">There was a problem retrieving the employee booking records. Please try again.</p>
          </div>
        ) : bookings && bookings.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800">No Booking Requests</h3>
            <p className="text-gray-500 text-sm mt-1">There are no bookings submitted for approval in the system.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => {
              const bDate = booking.date ? new Date(booking.date).toLocaleDateString() : "N/A";
              const isPending = booking.status === "Pending" || !booking.status;
              const isApproved = booking.status === "Approved";
              const isRejected = booking.status === "Rejected";

              return (
                <div 
                  key={booking._id} 
                  className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                >
                  {/* Status Indicator Stripe */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                    isApproved ? "bg-emerald-500" :
                    isRejected ? "bg-rose-500" :
                    "bg-amber-500"
                  }`} />

                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Card Header & Status Badge */}
                      <div className="flex justify-between items-start gap-3 mt-1 mb-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">ID: #{booking._id.slice(-6)}</span>
                        <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          isApproved ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
                          isRejected ? "bg-rose-50 border-rose-100 text-rose-700" :
                          "bg-amber-50 border-amber-100 text-amber-700"
                        }`}>
                          {booking.status || "Pending"}
                        </span>
                      </div>

                      {/* Booker Identity */}
                      <div className="flex items-center gap-2 mb-3 bg-gray-50 border border-gray-100 p-2.5 rounded-xl">
                        <User className="w-4 h-4 text-gray-400" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[9px] uppercase font-bold text-gray-400 leading-none">Booker Email</p>
                          <p className="font-semibold text-gray-800 truncate mt-1" title={booking.employee}>{booking.employee || "Guest"}</p>
                          {booking.department && (
                            <p className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">{booking.department}</p>
                          )}
                        </div>
                      </div>

                      {/* Ride Details (Purpose, Date, Location) */}
                      <div className="space-y-2.5 text-xs text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                          <span className="truncate font-medium text-gray-800" title={booking.purpose}>{booking.purpose}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>{bDate} at <span className="font-semibold">{booking.time}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span className="truncate" title={booking.location}>{booking.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Panel Footer */}
                    <div className="border-t border-gray-100 pt-4 mt-auto">
                      {isPending ? (
                        <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => rejectBookingMutation.mutate({ bookingID: booking._id })}
                            className="flex items-center justify-center gap-1.5 py-2 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject
                          </button>
                          <button 
                            onClick={() => approveBookingMutation.mutate({ bookingID: booking._id })}
                            className="flex items-center justify-center gap-1.5 py-2 bg-[#243b55] hover:bg-[#243b55]/95 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold text-gray-500">
                          {isApproved ? "Approved and assigned to fleet" : "Booking rejected"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default BookingManagementManager;