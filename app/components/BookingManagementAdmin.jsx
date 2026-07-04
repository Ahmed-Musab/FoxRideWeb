"use client";

import Sidebar from "./Sidebar";
import axios from "axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Calendar, Briefcase, User, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";

const BookingManagementAdmin = () => {

  const queryClient = useQueryClient();

  const getBookings = async () => {
    try {
      const response = await axios.get("/api/employee/getBookings");
      return response.data.bookings;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  const {data: bookings, isLoading: bookingsLoading, isError: bookingsError} = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings
  });

const cancelBookingMutation = useMutation({
    mutationFn: async ({ bookingId }) => {
      const response = await axios.delete("/api/employee/cancelBooking", { data: { bookingId } });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]);
      toast.success("Booking cancelled successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <Sidebar />
      </aside>
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-800">Booking Management </h1>

 <div className="mt-8">
          {bookingsLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-150 rounded-2xl p-6 h-56 animate-pulse flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                  <div className="h-9 bg-gray-200 rounded-xl mt-4" />
                </div>
              ))}
            </div>
          )}

          {bookingsError && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-sm font-semibold mb-6">
              Error fetching bookings: {bookingsError.message}
            </div>
          )}

          {bookings && (!Array.isArray(bookings) || bookings.length === 0) && (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-medium">No bookings logged yet.</p>
            </div>
          )}

          {bookings && Array.isArray(bookings) && bookings.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((b) => {
                const startD = b.date ? new Date(b.date).toLocaleDateString() : "";
                const endD = b.toDate ? new Date(b.toDate).toLocaleDateString() : "";
                return (
                  <div 
                    key={b._id} 
                    className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div>
                      {/* Title & Type */}
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 text-base truncate" title={b.purpose}>
                            {b.purpose}
                          </h3>
                          <p className="text-xs text-gray-400 font-medium mt-0.5">
                            Booked for: {b.bookingFor}
                          </p>
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex-shrink-0 ${
                          b.bookingNature === "Pickup" 
                            ? "bg-indigo-50 border-indigo-100 text-indigo-700" 
                            : b.bookingNature === "Dropoff" 
                            ? "bg-amber-50 border-amber-100 text-amber-700" 
                            : "bg-gray-50 border-gray-150 text-gray-700"
                        }`}>
                          {b.bookingNature}
                        </span>
                      </div>

                      {/* Date & Time display */}
                      <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-3 my-3 text-xs text-gray-600 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="font-medium">
                            {b.multipleDay ? `From: ${startD} (${b.time})` : `${startD} at ${b.time}`}
                          </span>
                        </div>
                        {b.multipleDay && (
                          <div className="flex items-center gap-2 border-t border-gray-100 pt-1.5 mt-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="font-medium">
                              To: {endD} {b.toTime ? `(${b.toTime})` : ""}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Spec details */}
                      <div className="grid grid-cols-1 gap-2.5 py-3 text-xs text-gray-600 border-b border-gray-100/60 mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <Briefcase className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate">Dept: {b.department}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate" title={b.employee}>Staff: {b.employee}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate" title={b.location}>To: {b.location}</span>
                        </div>
                      </div>

                      {/* Booking options tags */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {b.selfDriving && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-semibold border border-emerald-100">
                            Self Driving
                          </span>
                        )}
                        {b.rentedCar && (
                          <span className="text-[10px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md font-semibold border border-sky-100">
                            Rented Car
                          </span>
                        )}
                        {b.allowanceStaff && (
                          <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-semibold border border-purple-100">
                            Allowance Staff
                          </span>
                        )}
                      </div>
                      
                      {b.comments && (
                        <p className="text-[11px] text-gray-400 italic mt-3 bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                          "{b.comments}"
                        </p>
                      )}

                      <button 
                        onClick={() => cancelBookingMutation.mutate({ bookingId: b?._id })}
                        className="mt-3 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-semibold text-xs cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default BookingManagementAdmin;