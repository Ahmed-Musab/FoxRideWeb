"use client";

import Sidebar from "./Sidebar";
import { Car, X, Trash2, Shield, Users, Fuel, Settings, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const cities = [
  { value: "Lahore", label: "Lahore" },
  { value: "Karachi", label: "Karachi" },
  { value: "Islamabad", label: "Islamabad" },
  { value: "Faisalabad", label: "Faisalabad" },
  { value: "Multan", label: "Multan" },
  { value: "Raiwind", label: "Raiwind" },
  { value: "Sialkot", label: "Sialkot" },
  { value: "Gujranwala", label: "Gujranwala" },
  { value: "Bahawalpur", label: "Bahawalpur" },
  { value: "Rahim Yar Khan", label: "Rahim Yar Khan" }
];

const VehicleManagementAdmin = () => {
  const queryClient = useQueryClient();
  const [addVehicle, setAddVehicle] = useState(false);

  const getVehicles = async () => {
    try {
      const response = await axios.get("/api/admin/getVehicles");
      return response.data.vehicles;
    }
    catch (error) {
      console.log(error);
      return { error: error.message, status: 500 };
    }
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles
  });

  const getDrivers = async () => {
    try {
      const response = await axios.get("/api/driver/getDrivers");
      return response.data.drivers;
    }
    catch (error) {
      console.log(error);
      return { error: error.message, status: 500 };
    }
  }

  const { data: drivers, isLoading: driversLoading, error: driversError } = useQuery({
    queryKey: ["drivers"],
    queryFn: getDrivers
  });

  const schema = yup.object().shape({
    vehicleImage: yup.string().required("Vehicle Image is required"),
    vrn: yup.number().required("VRN is required"),
    registerCity: yup.string().required("Register City is required"),
    driver: yup.string().required("Driver is required"),
    capDate: yup.string().required("Cap Date is required"),
    vehicleType: yup.string().required("Vehicle Type is required"),
    department: yup.string().required("Department is required"),
    chassisNumber: yup.string().required("Chasis No is required"),
    color: yup.string().required("Color is required"),
    currentMileage: yup.string().required("Mileage is required"),
    vehiclePrice: yup.number().required("Price is required"),
    routePermitExpiry: yup.string().required("Route Permit Expiry is required"),
    seatingCapacity: yup.string().required("Seat Capacity is required"),
    remarks: yup.string().required("Remarks is required"),
    assetNumber: yup.string().required("Asset No is required"),
    fileNumber: yup.string().required("File No is required"),
    city: yup.string().required("City is required"),
    vehicleMake: yup.string().required("Make is required"),
    alternateDate: yup.string().required("Alt Date is required"),
    region: yup.string().required("Region is required"),
    engineNumber: yup.string().required("Engine Number is required"),
    model: yup.string().required("Model is required"),
    fuelTankCapacity: yup.string().required("Fuel Capacity is required"),
    document: yup.string().required("Document is required"),
    exciseTaxExpiry: yup.string().required("Excise Tax Expiry is required"),
    insuranceExpiry: yup.string().required("Insurance Expiry is required"),
    vehicleStatus: yup.string().required("Vehicle Status is required"),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const addVehicleMutation = useMutation({
    mutationFn: (newVehicle) => axios.post("/api/admin/addVehicle", newVehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      setAddVehicle(false);
      reset();
      toast.success("Vehicle added successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response?.data?.message || error.response?.data?.error || "Failed to add vehicle");
    }
  });

  const deleteVehicleMutation = useMutation({
    mutationFn: (id) => axios.delete("/api/admin/deleteVehicle", { data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle deleted successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response?.data?.error || "Failed to delete vehicle");
    }
  });

  const onSubmit = (data) => {
    addVehicleMutation.mutate(data);
  };

console.log(drivers);

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <Sidebar />
      </aside>
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Vehicle Management</h1>
            <p className="text-sm text-gray-500 mt-2">Manage physical fleet inventory, assign vehicles to pools, and track compliance.</p>
          </div>
          <button
            onClick={() => setAddVehicle(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#243b55] text-white rounded-xl hover:bg-[#243b55]/95 shadow-md shadow-[#243b55]/10 font-semibold transition cursor-pointer"
          >
            <Car className="w-5 h-5" />
            Add Vehicle
          </button>
        </div>

        {/* Vehicles Grid */}
        <div className="mt-8">
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-150 rounded-2xl p-6 h-52 animate-pulse flex flex-col justify-between">
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
              <p className="text-gray-500 text-sm font-medium">No vehicles registered yet.</p>
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
                          <span>Seats: {vehicle.seatCapacity}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <Shield className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span>Dept: {vehicle.dept}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <Settings className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span>Pool: {vehicle.assignedTo}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <Fuel className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span>Fuel: {vehicle.fuelCapacity}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span>Assigned to: {vehicle.assignedTo}</span>
                        </div>
                      </div>

                      {/* Location metadata */}
                      <div className="text-xs text-gray-400 flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#243b55]/50" />
                        <span>Registered in {vehicle.regCity} ({vehicle.city})</span>
                      </div>
                    </div>

                    {/* Action button */}
                    <button 
                      onClick={() => { if (confirm(`Are you sure you want to delete vehicle ${vehicle.VRN}?`)) deleteVehicleMutation.mutate(vehicle._id); }}
                      disabled={deleteVehicleMutation.isPending}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition cursor-pointer mt-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Vehicle
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Add Vehicle Modal */}
      {addVehicle && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-6xl w-full p-8 max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-[#243b55]" />
                <h3 className="text-lg font-bold text-gray-900">Add New Vehicle</h3>
              </div>
              <button onClick={() => setAddVehicle(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">

                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Upload Vehicle Image</label>
                    <input
                      type="file"
                      className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#243b55]/10 file:text-[#243b55] hover:file:bg-[#243b55]/20"
                      {...register("vehicleImage")}
                    />
                    {errors.vehicleImage && <p className="text-red-500 text-xs">{errors.vehicleImage.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">VRN</label>
                    <input
                      type="text"
                      placeholder="e.g. LHR-1234"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition"
                      {...register("vrn")}
                    />
                    {errors.vrn && <p className="text-red-500 text-xs">{errors.vrn.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Register City</label>
                    <select className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition"
                      {...register("registerCity")}>
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city.value} value={city.value}>{city.label}</option>
                      ))}
                    </select>
                    {errors.registerCity && <p className="text-red-500 text-xs">{errors.registerCity.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Assign Driver</label>
                    <select className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition"
                      {...register("driver")}>
                      <option value="">Select Driver</option>
                      {
                        drivers.map((driver) => (
                          <option key={driver._id} value={driver?.email}>{driver?.email}</option>
                        ))
                      }
                    </select>
                    {errors.driver && <p className="text-red-500 text-xs">{errors.driver.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Cap Date</label>
                    <input
                      type="date"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                      {...register("capDate")}
                    />
                    {errors.capDate && <p className="text-red-500 text-xs">{errors.capDate.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Vehicle Type</label>
                    <select className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition"
                      {...register("vehicleType")}>
                      <option value="">Select Vehicle Type</option>
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="hatchback">Hatchback</option>
                      <option value="van">Van</option>
                    </select>
                    {errors.vehicleType && <p className="text-red-500 text-xs">{errors.vehicleType.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Department</label>
                    <select className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition"
                      {...register("department")}>
                      <option value="">Select Department</option>
                      <option value="ops">Operations</option>
                      <option value="logs">Logistics</option>
                      <option value="sales">Sales</option>
                      <option value="hr">Human Resources</option>
                    </select>
                    {errors.department && <p className="text-red-500 text-xs">{errors.department.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Chasis No</label>
                    <input
                      type="text"
                      placeholder="Enter Chasis Number"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition"
                      {...register("chassisNumber")}
                    />
                    {errors.chassisNumber && <p className="text-red-500 text-xs">{errors.chassisNumber.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Color</label>
                    <input
                      type="text"
                      placeholder="e.g. Metallic Black"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition"
                      {...register("color")}
                    />
                    {errors.color && <p className="text-red-500 text-xs">{errors.color.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Current Mileage</label>
                    <input
                      type="text"
                      placeholder="Enter current mileage"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition"
                      {...register("currentMileage")}
                    />
                    {errors.currentMileage && <p className="text-red-500 text-xs">{errors.currentMileage.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Vehicle Price</label>
                    <input
                      type="text"
                      placeholder="Enter vehicle price"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition"
                      {...register("vehiclePrice")}
                    />
                    {errors.vehiclePrice && <p className="text-red-500 text-xs">{errors.vehiclePrice.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Route Permit Expiry</label>
                    <input
                      type="date"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                      {...register("routePermitExpiry")}
                    />
                    {errors.routePermitExpiry && <p className="text-red-500 text-xs">{errors.routePermitExpiry.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Seating Capacity</label>
                    <input
                      type="text"
                      placeholder="e.g. 5"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition"
                      {...register("seatingCapacity")}
                    />
                    {errors.seatingCapacity && <p className="text-red-500 text-xs">{errors.seatingCapacity.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Remarks</label>
                    <input
                      type="text"
                      placeholder="Add any additional remarks"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition"
                      {...register("remarks")}
                    />
                    {errors.remarks && <p className="text-red-500 text-xs">{errors.remarks.message}</p>}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Asset Number</label>
                    <input
                      type="text"
                      placeholder="Enter Asset Number"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition"
                      {...register("assetNumber")}
                    />
                    {errors.assetNumber && <p className="text-red-500 text-xs">{errors.assetNumber.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">File Number</label>
                    <input
                      type="text"
                      placeholder="Enter File Number"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition"
                      {...register("fileNumber")}
                    />
                    {errors.fileNumber && <p className="text-red-500 text-xs">{errors.fileNumber.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">City</label>
                    <select className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition"
                      {...register("city")}>
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city.value} value={city.value}>{city.label}</option>
                      ))}
                    </select>
                    {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Vehicle Make</label>
                    <select className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition"
                      {...register("vehicleMake")}>
                      <option value="">Select Vehicle Make</option>
                      <option value="toyota">Toyota</option>
                      <option value="honda">Honda</option>
                      <option value="suzuki">Suzuki</option>
                      <option value="hyundai">Hyundai</option>
                    </select>
                    {errors.vehicleMake && <p className="text-red-500 text-xs">{errors.vehicleMake.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Alternate Date</label>
                    <input
                      type="date"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                      {...register("alternateDate")}
                    />
                    {errors.alternateDate && <p className="text-red-500 text-xs">{errors.alternateDate.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Region</label>
                    <select className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition"
                      {...register("region")}>
                      <option value="">Select Region</option>
                      <option value="north">North</option>
                      <option value="south">South</option>
                      <option value="central">Central</option>
                    </select>
                    {errors.region && <p className="text-red-500 text-xs">{errors.region.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Engine No</label>
                    <input
                      type="text"
                      placeholder="Enter Engine Number"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition"
                      {...register("engineNumber")}
                    />
                    {errors.engineNumber && <p className="text-red-500 text-xs">{errors.engineNumber.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Model</label>
                    <input
                      type="text"
                      placeholder="e.g. 2024"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition"
                      {...register("model")}
                    />
                    {errors.model && <p className="text-red-500 text-xs">{errors.model.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Fuel Tank Capacity</label>
                    <input
                      type="text"
                      placeholder="e.g. 50 Liters"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition"
                      {...register("fuelTankCapacity")}
                    />
                    {errors.fuelTankCapacity && <p className="text-red-500 text-xs">{errors.fuelTankCapacity.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Upload Document</label>
                    <input
                      type="file"
                      className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#243b55]/10 file:text-[#243b55] hover:file:bg-[#243b55]/20"
                      {...register("document")}
                    />
                    {errors.document && <p className="text-red-500 text-xs">{errors.document.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Excise Tax Paid Until</label>
                    <input
                      type="date"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                      {...register("exciseTaxExpiry")}
                    />
                    {errors.exciseTaxExpiry && <p className="text-red-500 text-xs">{errors.exciseTaxExpiry.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Insurance Expiry</label>
                    <input
                      type="date"
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                      {...register("insuranceExpiry")}
                    />
                    {errors.insuranceExpiry && <p className="text-red-500 text-xs">{errors.insuranceExpiry.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Vehicle Status</label>
                    <select className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition"
                      {...register("vehicleStatus")}>
                      <option value="">Please Select</option>
                      <option value="active">Active</option>
                      <option value="maintenance">In Maintenance</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    {errors.vehicleStatus && <p className="text-red-500 text-xs">{errors.vehicleStatus.message}</p>}
                  </div>
                </div>

              </div>

              {/* Actions Footer */}
              <div className="flex gap-3 justify-end pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setAddVehicle(false)}
                  className="py-2.5 px-6 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-[#243b55] text-white hover:bg-[#243b55]/90 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default VehicleManagementAdmin;