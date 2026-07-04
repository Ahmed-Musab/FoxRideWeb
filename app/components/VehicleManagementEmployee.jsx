"use client";

import Sidebar from "./Sidebar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Car, Shield, Users, Fuel, Settings, Calendar, Gauge } from "lucide-react";

const VehicleManagementEmployee = () => {

  const getVehicles = async () => {
    try {
      const response = await axios.get("/api/admin/getVehicles");
      return response.data.vehicles;
    }
    catch (error) {
      console.log(error);
      return { message: "Failed to fetch vehicles", status: 500 };
    }
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles
  });

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <Sidebar />
      </aside>
      
      <main className="flex-1 p-10 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Available Fleet</h1>
          <p className="text-sm text-gray-500 mt-2">Browse the directory of registered company vehicles, specs, and status assignments.</p>
        </div>

        {/* Vehicles Grid */}
        <div>
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-150 rounded-2xl p-6 h-56 animate-pulse flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="h-5 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gray-200" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                  <div className="h-8 bg-gray-200 rounded-xl mt-4" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-sm font-semibold mb-6">
              Error fetching vehicles: {error.message}
            </div>
          )}

          {data && (!Array.isArray(data) || data.length === 0) && (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl">
              <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-medium">No fleet vehicles currently available.</p>
            </div>
          )}

          {data && Array.isArray(data) && data.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((vehicle) => {
                const isUnderMaintenance = vehicle.vehicleStatus === "maintenance";
                const isInactive = vehicle.vehicleStatus === "inactive";
                return (
                  <div 
                    key={vehicle._id} 
                    className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 text-lg truncate" title={vehicle.VRN}>
                            {vehicle.VRN}
                          </h3>
                          <p className="text-xs text-gray-400 font-medium mt-0.5">
                            {vehicle.make} - {vehicle.model}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border flex-shrink-0 ${
                          isUnderMaintenance 
                            ? "bg-amber-50 border-amber-100 text-amber-700" 
                            : isInactive 
                            ? "bg-rose-50 border-rose-100 text-rose-700" 
                            : "bg-emerald-50 border-emerald-100 text-emerald-700"
                        }`}>
                          {vehicle.vehicleStatus}
                        </span>
                      </div>

                      {/* Info Spec Grid */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 py-4 border-t border-b border-gray-100/60 my-4 text-xs text-gray-600">
                        <div className="flex items-center gap-2 min-w-0">
                          <Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate">Seats: {vehicle.seatCapacity}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <Shield className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate" title={vehicle.dept}>Dept: {vehicle.dept}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <Settings className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate" title={vehicle.assignedTo}>Pool: {vehicle.assignedTo}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <Fuel className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate">Fuel: {vehicle.fuelCapacity}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0 col-span-2">
                          <Gauge className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate">Current Mileage: {vehicle.mileage} km</span>
                        </div>
                      </div>

                      {/* Location metadata */}
                      <div className="text-xs text-gray-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#243b55]/50" />
                        <span className="truncate">Registered in {vehicle.regCity} ({vehicle.city})</span>
                      </div>
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

export default VehicleManagementEmployee;