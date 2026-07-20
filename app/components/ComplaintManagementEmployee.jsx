'use client';

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { Plus, X, AlertTriangle, Edit2, Trash2 } from "lucide-react";

const ComplaintManagementEmployee = () => {
    const queryClient = useQueryClient();
    const [showEditForm, setShowEditForm] = useState(null);
    const [addComplaint, setAddComplaint] = useState(false);

    const complaintSchema = yup.object().shape({
        complaintType: yup.string().required("Complaint type is required"),
        description: yup.string().required("Description is required"),
        priority: yup.string().required("Priority is required"),
        complaintDate: yup.string().required("Complaint date is required"),
        complaintAgainst: yup.string().required("Complaint against is required"),
        booking: yup.string().required("Booking is required")
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(complaintSchema),
        defaultValues: {
            complaintType: "",
            description: "",
            priority: "",
            complaintDate: new Date().toISOString().split('T')[0],
            complaintAgainst: "",
            booking: ""
        }
    });

    const getDrivers = async () => {
        try {
            const response = await axios.get("/api/driver/getDrivers");
            return response.data.drivers;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load drivers");
        }
    };

    const { data: drivers, isLoading: driversLoading } = useQuery({
        queryKey: ["drivers"],
        queryFn: getDrivers,
    });

    const getBookings = async () => {
        try {
            const response = await axios.get("/api/employee/getBookingByEmail");
            return response.data.bookings || [];
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load bookings");
            return [];
        }
    };

    const { data: bookings, isLoading: bookingsLoading } = useQuery({
        queryKey: ["bookings"],
        queryFn: getBookings,
    });

    const getComplaints = async () => {
        try {
            const response = await axios.get("/api/employee/getComplaintsByEmail");
            return response.data.complaints;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load complaints");
        }
    };

    const { data: complaints, isLoading: complaintsLoading, error: complaintsError } = useQuery({
        queryKey: ["complaints"],
        queryFn: getComplaints,
    });

    const addComplaintMutation = useMutation({
        mutationFn: async (data) => {
            const response = await axios.post("/api/employee/addComplaint", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["complaints"]);
            setAddComplaint(false);
            reset();
            toast.success("Complaint filed successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to add complaint");
        }
    });

    const deleteComplaintMutation = useMutation({
        mutationFn: async (complaintID) => {
            const response = await axios.delete("/api/employee/deleteComplaint", { data: { complaintID } });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["complaints"]);
            toast.success("Complaint deleted successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete complaint");
        }
    })

    const updateComplaintMutation = useMutation({
        mutationFn: async (data) => {
            const response = await axios.put("/api/employee/updateComplaint", { 
                complaintID: showEditForm?._id, 
                ...data 
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["complaints"]);
            setShowEditForm(null);
            reset();
            toast.success("Complaint updated successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update complaint");
        }
    })

    const editButtonHandler = (complaint) => {
        setShowEditForm(complaint);

        reset({
            complaintType: complaint.complaintType,
            description: complaint.description,
            priority: complaint.priority,
            complaintDate: complaint.complaintDate ? new Date(complaint.complaintDate).toISOString().split('T')[0] : "",
            complaintAgainst: complaint.complaintAgainst,
            booking: complaint.booking,
        })
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
                <Sidebar />
            </aside>

            <main className="flex-1 p-8 lg:p-10 max-w-7xl mx-auto w-full">
                {/* Header section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Complaint Desk</h1>
                        <p className="text-sm text-gray-500 mt-2">Log operational issues, vehicle breakdowns, or driver concerns.</p>
                    </div>
                    <button
                        onClick={() => setAddComplaint(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#243b55] text-white rounded-xl hover:bg-[#243b55]/95 shadow-md shadow-[#243b55]/10 font-semibold transition cursor-pointer self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Add Complaint
                    </button>
                </div>

                {
                    complaintsLoading ? (
                        <div className="text-gray-500 text-sm">Loading complaints...</div>
                    ) : complaintsError ? (
                        <div className="text-red-500 text-sm font-semibold">Error loading complaints</div>
                    ) : complaints?.length === 0 ? (
                        <div className="text-gray-500 text-sm">No complaints found</div>
                    ) : (
                        <div className="space-y-4 max-w-3xl">
                            {complaints?.map((complaint) => (
                                <div key={complaint._id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-bold text-gray-900">{complaint.complaintType}</p>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${complaint.priority === 'High' ? 'bg-red-50 text-red-700 border border-red-100' :
                                                complaint.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                    'bg-green-50 text-green-700 border border-green-100'
                                            }`}>
                                            {complaint.priority}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 text-sm mb-2">{complaint.description}</p>
                                    <p className="text-gray-500 text-xs mb-3">
                                        Against: {complaint.complaintAgainst} | Date: {complaint.complaintDate ? new Date(complaint.complaintDate).toLocaleDateString() : ""}
                                    </p>
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                            complaint.status === "Pending" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                            "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                        }`}>
                                            {complaint.status}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => editButtonHandler(complaint)}
                                                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#243b55]/5 text-[#243b55] hover:bg-[#243b55]/10 rounded-lg text-[11px] font-bold transition cursor-pointer"
                                            >
                                                <Edit2 className="w-3 h-3" />
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    if (confirm("Are you sure you want to delete this complaint?")) {
                                                        deleteComplaintMutation.mutate(complaint._id);
                                                    }
                                                }}
                                                className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-[11px] font-bold transition cursor-pointer"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                }

                {
                    showEditForm && (
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                                
                                {/* Modal Header */}
                                <div className="bg-[#243b55] px-6 py-4 flex items-center justify-between text-white">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />
                                        <h3 className="text-sm font-semibold">Edit Complaint</h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowEditForm(null)}
                                        className="text-gray-300 hover:text-white transition cursor-pointer animate-none"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Modal Content */}
                                <div className="p-6">
                                    {
                                        complaintsLoading ? (
                                            <p className="text-gray-500 text-sm py-4 text-center">Loading...</p>
                                        ) : complaintsError ? (
                                            <p className="text-rose-500 text-sm py-4 text-center font-semibold">Error loading complaints</p>
                                        ) : (
                                            <form 
                                            onSubmit={handleSubmit(updateComplaintMutation.mutate)}
                                            className="space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                                            Complaint Type
                                                        </label>
                                                        <select 
                                                            {...register("complaintType")}
                                                            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                                                        >
                                                            <option >Car Problem</option>
                                                            <option >Driver Problem</option>
                                                            <option>Other</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                                            Priority
                                                        </label>
                                                        <select 
                                                            {...register("priority")}
                                                            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                                                        >
                                                            <option >High</option>
                                                            <option >Medium</option>
                                                            <option >Low</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                     <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                            Complaint Against
                                        </label>
                                        <select
                                            {...register("complaintAgainst")}
                                            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                                        >
                                            {drivers?.map((driver) => (
                                                <option key={driver._id} value={driver.email}>
                                                    {driver.email}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.complaintAgainst && <p className="text-rose-500 text-[10px] mt-0.5">{errors.complaintAgainst.message}</p>}
                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                                        Description
                                                    </label>
                                                    <input 
                                                        {...register("description")}
                                                        type="text" 
                                                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                                                    />
                                                </div>
                                               <div>
                                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                                        Date
                                                    </label>
                                                    <input 
                                                        {...register("complaintDate")}
                                                        type="date" 
                                                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                                                    />
                                                </div>

 <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                            Booking Related To 
                                        </label>
                                        <select
                                            {...register("booking")}
                                            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                                        >
                                            <option value="">Select Booking</option>
                                            {bookings?.map((b) => (
                                                <option key={b._id} value={b.purpose}>
                                                    {b.purpose} - {b.date ? new Date(b.date).toLocaleDateString() : ""} ({b.status})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.booking && <p className="text-rose-500 text-[10px] mt-0.5">{errors.booking.message}</p>}
                                    </div>

                                                {/* Actions */}
                                                <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-gray-100">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowEditForm(null)}
                                                        className="py-2 px-5 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl transition cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button 
                                                        type="submit"
                                                        className="py-2 px-5 bg-[#243b55] text-white hover:bg-[#243b55]/90 text-xs font-semibold rounded-xl transition cursor-pointer"
                                                    >
                                                        Update Complaint
                                                    </button>
                                                </div>
                                            </form>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Add Complaint Modal */}
                {addComplaint && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">

                            {/* Modal Header */}
                            <div className="bg-[#243b55] px-6 py-4 flex items-center justify-between text-white">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />
                                    <h3 className="text-sm font-semibold">File a New Complaint</h3>
                                </div>
                                <button
                                    onClick={() => { setAddComplaint(false); reset(); }}
                                    className="text-gray-300 hover:text-white transition cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Form */}
                            <form onSubmit={handleSubmit(addComplaintMutation.mutate)} className="p-6 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                            Complaint Type
                                        </label>
                                        <select
                                            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                                            {...register("complaintType")}
                                        >
                                            <option value="">Select Type</option>
                                            <option value="Car Problem">Car Problem</option>
                                            <option value="Driver Problem">Driver Problem</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {errors.complaintType && <p className="text-rose-500 text-[10px] mt-0.5">{errors.complaintType.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                            Complaint Against
                                        </label>
                                        <select
                                            {...register("complaintAgainst")}
                                            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                                        >
                                            <option value="">Select Driver</option>
                                            {drivers?.map((driver) => (
                                                <option key={driver._id} value={driver.email}>
                                                    {driver.email}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.complaintAgainst && <p className="text-rose-500 text-[10px] mt-0.5">{errors.complaintAgainst.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                            Incident Date
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                                            {...register("complaintDate")}
                                        />
                                        {errors.complaintDate && <p className="text-rose-500 text-[10px] mt-0.5">{errors.complaintDate.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                            Booking Related To <span className="text-rose-500">*</span>
                                        </label>
                                        <select
                                            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                                            {...register("booking")}
                                        >
                                            <option value="">Select Booking</option>
                                            {bookings?.map((b) => (
                                                <option key={b._id} value={b.purpose}>
                                                    {b.purpose} - {b.date ? new Date(b.date).toLocaleDateString() : ""} ({b.status})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.booking && <p className="text-rose-500 text-[10px] mt-0.5">{errors.booking.message}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        rows={4}
                                        placeholder="Please provide full details of the incident or issue..."
                                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700 resize-none"
                                        {...register("description")}
                                    />
                                    {errors.description && <p className="text-rose-500 text-[10px] mt-0.5">{errors.description.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                        Priority
                                    </label>
                                    <select
                                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                                        {...register("priority")}
                                    >
                                        <option value="">Select Priority</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                    {errors.priority && <p className="text-rose-500 text-[10px] mt-0.5">{errors.priority.message}</p>}
                                </div>

                                {/* Form Action Buttons */}
                                <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => { setAddComplaint(false); reset(); }}
                                        className="py-2 px-5 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl transition cursor-pointer"
                                        disabled={addComplaintMutation.isPending}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="py-2 px-5 bg-[#243b55] text-white hover:bg-[#243b55]/90 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-2"
                                        disabled={addComplaintMutation.isPending}
                                    >
                                        {addComplaintMutation.isPending ? "Filing..." : "Submit Complaint"}
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

export default ComplaintManagementEmployee;