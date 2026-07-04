"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Bell, X, Calendar, AlertTriangle, CheckCircle, ShieldAlert, User, Car, Trash2 } from "lucide-react";

const AlertManagementAdmin = () => {

  const [alertModal, setAlertModal] = useState(false);
  const queryClient = useQueryClient();

  const alertSchema = yup.object({
    VRN: yup.string().required("VRN is required"),
    alertName: yup.string().required("Alert Name is required"),
    alertType: yup.string().required("Alert Type is required"),
    alertDate: yup.string().required("Alert Date is required"),
    isActive: yup.boolean()
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(alertSchema),
    defaultValues: {
      VRN: "",
      alertName: "",
      alertType: "",
      alertDate: "",
      isActive: true
    }
  });

  const getAlerts = async () => {
    try {
      const response = await axios.get("/api/admin/getAlerts");
      return response?.data?.alerts;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const { data: alerts, isLoading, error: alertsError } = useQuery({
    queryKey: ["alerts"],
    queryFn: getAlerts,
  });

  const createAlertMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post("/api/admin/createAlert", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      setAlertModal(false);
      reset();
      toast.success("Alert created successfully!");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to create alert");
    }
  });

  const deleteAlertMutation = useMutation({
    mutationFn: async ({alertID}) => {
      const response = await axios.delete("/api/admin/deleteAlert", {
        data: { id: alertID }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast.success("Alert deleted successfully!");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete alert");
    }
  });

  const getEmployees = async () => {
    try {
      const response = await axios.get("/api/employee/getEmployees");
      return response?.data?.employees;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const { data: employees, isLoading: employeesLoading, error: employeesError } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <Sidebar />
      </aside>
      
      <main className="flex-1 p-10 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Alert Management</h1>
            <p className="text-sm text-gray-500 mt-2">Configure automated fleet tracking warnings, threshold violations, and maintenance triggers.</p>
          </div>
          <button
            onClick={() => setAlertModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#243b55] text-white rounded-xl hover:bg-[#243b55]/95 shadow-md shadow-[#243b55]/10 font-semibold transition cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            Create Alert
          </button>
        </div>

        {/* Alerts Grid */}
        <div className="mt-8">
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-150 rounded-2xl p-6 h-44 animate-pulse flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                  </div>
                  <div className="h-8 bg-gray-200 rounded-xl mt-6" />
                </div>
              ))}
            </div>
          )}

          {alertsError && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-sm font-semibold mb-6">
              Error fetching alerts: {alertsError.message}
            </div>
          )}

          {alerts && (!Array.isArray(alerts) || alerts.length === 0) && (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-medium">No active alerts configured.</p>
            </div>
          )}

          {alerts && Array.isArray(alerts) && alerts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alerts.map((al) => {
                const alertD = al.alertDate ? new Date(al.alertDate).toLocaleDateString() : "";
                const isSpeeding = al.alertType === "speeding";
                const isGeofence = al.alertType === "geofence";
                const isMaintenance = al.alertType === "maintenance";

                return (
                  <div 
                    key={al._id} 
                    className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden"
                  >
                    {/* Visual border stripe matching alert type */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                      isSpeeding ? "bg-rose-500" :
                      isGeofence ? "bg-indigo-500" :
                      isMaintenance ? "bg-amber-500" :
                      "bg-sky-500"
                    }`} />
                    
                    <div className="space-y-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title & Type Badge */}
                        <div className="flex justify-between items-start gap-3 mt-1 mb-3">
                          <h3 className="font-bold text-gray-900 text-base leading-tight tracking-tight line-clamp-2" title={al.alertName}>
                            {al.alertName}
                          </h3>
                          <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border flex-shrink-0 ${
                            isSpeeding 
                              ? "bg-rose-50 border-rose-100 text-rose-700" 
                              : isGeofence 
                              ? "bg-indigo-50 border-indigo-100 text-indigo-700" 
                              : isMaintenance 
                              ? "bg-amber-50 border-amber-100 text-amber-700" 
                              : "bg-sky-50 border-sky-100 text-sky-700"
                          }`}>
                            {al.alertType}
                          </span>
                        </div>

                        {/* Details (VRN, Employee) */}
                        <div className="space-y-2 text-xs text-gray-600 mb-4">
                          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 p-2 rounded-xl">
                            <Car className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-[9px] uppercase font-bold text-gray-400 leading-none">VRN</p>
                              <p className="font-bold text-gray-800 mt-1">{al.VRN}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 p-2 rounded-xl">
                            <User className="w-4 h-4 text-gray-400" />
                            <div className="min-w-0 flex-1">
                              <p className="text-[9px] uppercase font-bold text-gray-400 leading-none">Assigned Employee</p>
                              <p className="font-medium text-gray-800 truncate mt-1" title={al.employee}>{al.employee}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Date, Status, and Action Button Footer */}
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100 mt-auto">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span className="font-medium">{alertD}</span>
                          </div>
                          <span className={`flex items-center gap-1 font-bold ${al.isActive ? "text-emerald-600" : "text-gray-400"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${al.isActive ? "bg-emerald-500 animate-pulse" : "bg-gray-300"}`} />
                            {al.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <button onClick={() => deleteAlertMutation.mutate({alertID: al._id})}
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 cursor-pointer" 
                          title="Delete Alert"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Create Alert Modal */}
        {alertModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-md w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="bg-[#243b55] px-6 py-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 animate-bounce" />
                  <h3 className="text-sm font-semibold">Create New Alert</h3>
                </div>
                <button 
                  onClick={() => { setAlertModal(false); reset(); }} 
                  className="text-gray-300 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit(createAlertMutation.mutate)} className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Vehicle VRN <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. LHR-1234"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                    {...register("VRN")}
                  />
                  {errors.VRN && <p className="text-rose-500 text-[10px] mt-0.5">{errors.VRN.message}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Alert Name <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Speed Limit Exceeded"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                    {...register("alertName")}
                  />
                  {errors.alertName && <p className="text-rose-500 text-[10px] mt-0.5">{errors.alertName.message}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Alert Type <span className="text-rose-500">*</span>
                  </label>
                  <select 
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                    {...register("alertType")}
                  >
                    <option value="">Select Alert Type</option>
                    <option value="speeding">Speeding</option>
                    <option value="geofence">Geofence</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="fuel">Fuel</option>
                  </select>
                  {errors.alertType && <p className="text-rose-500 text-[10px] mt-0.5">{errors.alertType.message}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Alert Date <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                    {...register("alertDate")}
                  />
                  {errors.alertDate && <p className="text-rose-500 text-[10px] mt-0.5">{errors.alertDate.message}</p>}
                </div>

                <div className="flex items-center justify-between py-2 border-t border-b border-gray-50">
                  <span className="text-xs font-semibold text-gray-600">Active Alert Status</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      {...register("isActive")}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#243b55]/30 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#243b55]" />
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-gray-100">
                  <button 
                    type="button" 
                    onClick={() => { setAlertModal(false); reset(); }} 
                    className="py-2 px-5 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="py-2 px-5 bg-[#243b55] text-white hover:bg-[#243b55]/90 text-xs font-semibold rounded-xl transition cursor-pointer"
                  >
                    Save Alert
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AlertManagementAdmin;