'use client'

import Sidebar from "./Sidebar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { 
  Car, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Briefcase, 
  CheckCircle,
  Check
} from "lucide-react";

const BookingManagementTransportAdmin = () => {
  const queryClient = useQueryClient();
  const [selectedVehicles, setSelectedVehicles] = useState({});

  // Fetch approved bookings
  const getApprovedBookings = async () => {
    const response = await axios.get("/api/transportAdmin/getApprovedBookings");
    return response?.data?.bookings || [];
  }

  const { data: bookings = [], isLoading: bookingsLoading, isError: bookingsError } = useQuery({
    queryKey: ["approved-bookings"],
    queryFn: getApprovedBookings,
  });

  // Fetch vehicles
  const getVehicles = async () => {
    const response = await axios.get("/api/admin/getVehicles");
    return response?.data?.vehicles || [];
  }

  const { data: vehicles = [], isLoading: vehiclesLoading, isError: vehiclesError } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });

  // Assign vehicle mutation
  const assignVehicleMutation = useMutation({
    mutationFn: async ({ bookingID, vehicleVRN }) => {
      const response = await axios.post('/api/transportAdmin/assignVehicle', { bookingID, vehicleVRN });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["approved-bookings"]);
      toast.success("Vehicle assigned successfully!");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to assign vehicle");
    }
  });

  const handleAssign = (bookingID) => {
    const vehicleVRN = selectedVehicles[bookingID];
    if (!vehicleVRN) {
      toast.error("Please select a vehicle first.");
      return;
    }
    assignVehicleMutation.mutate({ bookingID, vehicleVRN });
  };

  const handleVehicleChange = (bookingID, vrn) => {
    setSelectedVehicles(prev => ({
      ...prev,
      [bookingID]: vrn
    }));
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white border border-gray-150 rounded-2xl p-6 h-72 flex flex-col justify-between">
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

  const isLoading = bookingsLoading || vehiclesLoading;
  const isError = bookingsError || vehiclesError;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <Sidebar />
      </aside>
      
      <main className="flex-1 p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="border-b border-gray-200 pb-6 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Ride Dispatch Center</h1>
          <p className="text-sm text-gray-500 mt-2">Supervise approved commuter rides and assign active vehicles from the fleet registry.</p>
        </div>

        {isLoading ? (
          renderSkeleton()
        ) : isError ? (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 p-6 rounded-2xl">
            <h3 className="font-bold text-lg mb-2">Error Loading Dispatch System</h3>
            <p className="text-sm">There was a problem loading approved bookings or active vehicles. Please refresh the page.</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800">All Clear!</h3>
            <p className="text-gray-500 text-sm mt-1">There are no approved bookings waiting for vehicle assignment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => {
              const bDate = booking.date ? new Date(booking.date).toLocaleDateString() : "N/A";
              const isAssigned = !!booking.assignedVehicle;

              return (
                <div 
                  key={booking._id} 
                  className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                >
                  {/* Status Indicator Stripe */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                    isAssigned ? "bg-emerald-500" : "bg-amber-500"
                  }`} />

                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Card Header & Status Badge */}
                      <div className="flex justify-between items-start gap-3 mt-1 mb-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">ID: #{booking._id.slice(-6)}</span>
                        <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          isAssigned 
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                            : "bg-amber-50 border-amber-100 text-amber-700"
                        }`}>
                          {isAssigned ? "Dispatched" : "Unassigned"}
                        </span>
                      </div>

                      {/* Commuter Information */}
                      <div className="flex items-center gap-2 mb-3 bg-gray-50 border border-gray-100 p-2.5 rounded-xl">
                        <User className="w-4 h-4 text-gray-400" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[9px] uppercase font-bold text-gray-400 leading-none">Employee Commuter</p>
                          <p className="font-semibold text-gray-800 truncate mt-1" title={booking.employee}>{booking.employee}</p>
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

                    {/* Vehicle Assignment Footer */}
                    <div className="border-t border-gray-100 pt-4 mt-auto">
                      {isAssigned ? (
                        <div className="flex items-center gap-2.5 p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                            <Car className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[9px] uppercase font-bold text-emerald-600 leading-none">Assigned Fleet VRN</p>
                            <p className="font-extrabold text-emerald-800 mt-1">{booking.assignedVehicle}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                              Select Fleet Vehicle <span className="text-rose-500">*</span>
                            </label>
                            <select 
                              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#243b55] text-gray-700 font-semibold"
                              value={selectedVehicles[booking._id] || ""}
                              onChange={(e) => handleVehicleChange(booking._id, e.target.value)}
                            >
                              <option value="">Select a Vehicle</option>
                              {vehicles
                                .filter(v => v.vehicleStatus?.toLowerCase() === 'active')
                                .map((vehicle) => (
                                  <option key={vehicle._id} value={vehicle.VRN}>
                                    {vehicle.make} {vehicle.model} ({vehicle.VRN})
                                  </option>
                              ))}
                            </select>
                          </div>
                          <button 
                            onClick={() => handleAssign(booking._id)}
                            disabled={assignVehicleMutation.isPending}
                            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-[#243b55] hover:bg-[#243b55]/95 disabled:bg-gray-300 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Dispatch Vehicle
                          </button>
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

export default BookingManagementTransportAdmin;
