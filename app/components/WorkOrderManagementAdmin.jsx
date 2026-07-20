"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Wrench, X, Calendar, Car, User, Plus, FileText, Trash2, Shield, AlertTriangle, Coins } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const locations = [
    "Lahore", "Karachi", "Islamabad", "Faisalabad", "Multan", "Raiwind", "Sialkot", "Gujranwala", "Bahawalpur", "Rahim Yar Khan"
];

const vendors = [
    "Toyota Motors", "Honda Service Center", "Honda Fort", "Suzuki Township", "Local Workshop", "Other Vendor"
];

const WorkOrderManagementAdmin = () => {
    const { user } = useAuth();
    const [workOrderModal, setWorkOrderModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [uploadedDoc, setUploadedDoc] = useState(null);
    const [uploading, setUploading] = useState(false);
    const queryClient = useQueryClient();

    const getVehicles = async () => {
        try {
            const response = await axios.get("/api/admin/getVehicles");
            return response.data.vehicles;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
        queryKey: ["vehicles"],
        queryFn: getVehicles,
    });

    const getBookings = async () => {
        try {
            const response = await axios.get("/api/employee/getBookings");
            return response?.data?.bookings || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const { data: bookings, isLoading: bookingsLoading } = useQuery({
        queryKey: ["bookings"],
        queryFn: getBookings,
    });

    console.log(bookings);

    const getWorkOrders = async () => {
        try {
            const response = await axios.get("/api/admin/getWorkOrders");
            return response?.data?.workOrders || [];
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const { data: workOrders, isLoading: workOrdersLoading, error: workOrdersError } = useQuery({
        queryKey: ["workOrders"],
        queryFn: getWorkOrders,
    });

    const createWorkOrderMutation = useMutation({
        mutationFn: async (data) => {
            const response = await axios.post("/api/admin/createWorkOrder", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workOrders"] });
            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
            setWorkOrderModal(false);
            reset();
            setUploadedDoc(null);
            setSelectedVehicle(null);
            toast.success("Work Order created successfully!");
        },
        onError: (error) => {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to create work order");
        }
    });

    const workOrderSchema = yup.object({
        vehicleId: yup.string().required("Vehicle is required"),
        employee: yup.string().required("Employee is required"),
        vrn: yup.string().required("VRN is required"),
        vehicleType: yup.string().required("Type is required"),
        make: yup.string().required("Make is required"),
        lastMeterReading: yup.number().required("Last updated mileage is required"),
        currentMeterReading: yup.number()
            .required("Current mileage is required")
            .typeError("Current mileage must be a number")
            .min(yup.ref("lastMeterReading"), "Current mileage cannot be less than last updated mileage"),
        location: yup.string().required("Location is required"),
        vendor: yup.string().required("Vendor is required"),
        isOutsideVendor: yup.boolean().default(false),
        workType: yup.string().required("Work Type is required"),
        date: yup.string().required("Date is required"),
        invoiceAmount: yup.number()
            .required("Invoice amount is required")
            .typeError("Invoice amount must be a number")
            .min(0, "Invoice amount cannot be negative"),
        comments: yup.string(),
        documentUrl: yup.string()
    });

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(workOrderSchema),
        defaultValues: {
            vehicleId: "",
            employee: "",
            vrn: "",
            vehicleType: "",
            make: "",
            lastMeterReading: 0,
            currentMeterReading: "",
            location: "",
            vendor: "",
            isOutsideVendor: false,
            workType: "",
            date: new Date().toISOString().split("T")[0],
            invoiceAmount: "",
            comments: "",
            documentUrl: ""
        }
    });

    const handleVehicleChange = async (e) => {
        const vId = e.target.value;
        setValue("vehicleId", vId);

        if (!vId) {
            setSelectedVehicle(null);
            setValue("vrn", "");
            setValue("vehicleType", "");
            setValue("make", "");
            setValue("lastMeterReading", 0);
            return;
        }

        const vehicle = await vehicles.find(v => v._id === vId);
        const booking = await bookings.find(b => b.assignedVehicle === vehicle?.VRN);
        if (booking) {
            setValue("employee", booking.employee);
        }
        if (vehicle) {
            setSelectedVehicle(vehicle);
            setValue("vrn", vehicle.VRN);
            setValue("vehicleType", vehicle.vehicleType);
            setValue("make", vehicle.make);
            setValue("lastMeterReading", vehicle.mileage || 0);
        }
    };

    const handleDocumentUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axios.post("/api/admin/uploadPhoto", formData);
            const url = response.data.imageUrl;
            setUploadedDoc({
                name: file.name,
                url: url
            });
            setValue("documentUrl", url, { shouldValidate: true });
            toast.success("Document uploaded successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to upload document");
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveDocument = () => {
        setUploadedDoc(null);
        setValue("documentUrl", "");
    };

    const onSubmit = (data) => {
        createWorkOrderMutation.mutate(data);
    };

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
                <Sidebar />
            </aside>

            <main className="flex-1 p-8 lg:p-10 max-w-7xl mx-auto w-full">
                {/* Header section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Work Orders</h1>
                        <p className="text-sm text-gray-500 mt-2">Manage vehicle maintenance requests, service logs, and workshop invoices.</p>
                    </div>
                    <button
                        onClick={() => setWorkOrderModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#243b55] text-white rounded-xl hover:bg-[#243b55]/95 shadow-md shadow-[#243b55]/10 font-semibold transition cursor-pointer self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Create Work Order
                    </button>
                </div>

                {/* Loading skeleton state */}
                {workOrdersLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white border border-gray-150 rounded-2xl p-6 h-48 animate-pulse flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="h-5 bg-gray-200 rounded w-2/3" />
                                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                                </div>
                                <div className="h-8 bg-gray-200 rounded-xl mt-6" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Error message state */}
                {workOrdersError && (
                    <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-sm font-semibold mb-6">
                        Error fetching work orders: {workOrdersError.message}
                    </div>
                )}

                {/* Empty state */}
                {workOrders && workOrders.length === 0 && !workOrdersLoading && (
                    <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl shadow-sm">
                        <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm font-medium">No work orders recorded yet.</p>
                    </div>
                )}

                {/* Work Orders List/Table */}
                {workOrders && workOrders.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        <th className="px-6 py-4">Vehicle / VRN</th>
                                        <th className="px-6 py-4">Logged By</th>
                                        <th className="px-6 py-4">Work Details</th>
                                        <th className="px-6 py-4">Vendor & Location</th>
                                        <th className="px-6 py-4">Invoice</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Document</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-xs text-gray-600">
                                    {workOrders.map((wo) => (
                                        <tr key={wo._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500">
                                                        <Car className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800 uppercase">{wo.vrn}</p>
                                                        <p className="text-[10px] text-gray-400">{wo.make} | {wo.vehicleType}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold text-gray-800">{wo.employeeName}</p>
                                                    <p className="text-[10px] text-gray-400">{wo.employeeEmail}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-bold text-[#243b55]">{wo.workType}</p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5 max-w-[200px] truncate" title={wo.comments}>{wo.comments || "No comments"}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-800">{wo.vendor}</p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">{wo.location} {wo.isOutsideVendor && <span className="text-amber-600 font-semibold">(Outside)</span>}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-bold text-emerald-600">Rs. {wo.invoiceAmount.toLocaleString()}</p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">Km: {wo.lastMeterReading} → {wo.currentMeterReading}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-500">{new Date(wo.date).toLocaleDateString()}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {wo.documentUrl ? (
                                                    <a
                                                        href={wo.documentUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 hover:underline"
                                                    >
                                                        <FileText className="w-3.5 h-3.5" />
                                                        View Doc
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400 italic">None</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Modal matching screenshot */}
                {workOrderModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-start p-4 overflow-y-auto">
                        <div className="bg-white rounded-xl border border-gray-150 shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in-95 duration-200">

                            {/* Header */}
                            <div className="bg-[#243b55] px-6 py-4 flex items-center justify-between text-white">
                                <div className="flex items-center gap-2">
                                    <Wrench className="w-4 h-4 animate-spin" />
                                    <h3 className="text-sm font-semibold">Create Work Order</h3>
                                </div>
                                <button
                                    onClick={() => { setWorkOrderModal(false); reset(); setSelectedVehicle(null); setUploadedDoc(null); }}
                                    className="text-gray-300 hover:text-white transition cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form matching double-column layout */}
                            <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex-1 overflow-y-auto space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Left Column */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                                Vehicle
                                            </label>
                                            <select
                                                onChange={handleVehicleChange}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                                                value={selectedVehicle?._id || ""}
                                            >
                                                <option value="">Select Vehicle</option>
                                                {vehicles?.map(v => (
                                                    <option key={v._id} value={v._id}>{v.VRN} ({v.make} - {v.model})</option>
                                                ))}
                                            </select>
                                            {errors.vehicleId && <p className="text-rose-500 text-[10px] mt-0.5">{errors.vehicleId.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                                Profile Image
                                            </label>
                                            <div className="border border-gray-200 rounded-lg p-2.5 flex items-center gap-3 bg-gray-50">
                                                {selectedVehicle?.vehicleImage ? (
                                                    <img
                                                        src={selectedVehicle.vehicleImage}
                                                        alt="Vehicle Profile"
                                                        className="w-14 h-14 rounded-md object-cover border border-gray-200 shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="w-14 h-14 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                                                        <Car className="w-6 h-6" />
                                                    </div>
                                                )}
                                                <div className="text-[10px] text-gray-400 font-medium">
                                                    {selectedVehicle ? "Vehicle Profile Image" : "No vehicle selected"}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                                Type
                                            </label>
                                            <input
                                                type="text"
                                                readOnly
                                                placeholder="Vehicle Type"
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-gray-100 focus:outline-none transition text-gray-500 cursor-not-allowed"
                                                {...register("vehicleType")}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                                Meter Reading (Last Updated)
                                            </label>
                                            <input
                                                type="number"
                                                readOnly
                                                placeholder="Last mileage"
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-gray-100 focus:outline-none transition text-gray-500 cursor-not-allowed"
                                                {...register("lastMeterReading")}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                                Location
                                            </label>
                                            <select
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                                                {...register("location")}
                                            >
                                                <option value="">Select Location</option>
                                                {locations.map(loc => (
                                                    <option key={loc} value={loc}>{loc}</option>
                                                ))}
                                            </select>
                                            {errors.location && <p className="text-rose-500 text-[10px] mt-0.5">{errors.location.message}</p>}
                                        </div>

                                        <div className="flex items-center gap-2.5 pt-2">
                                            <input
                                                type="checkbox"
                                                id="isOutsideVendor"
                                                className="w-4 h-4 text-[#243b55] border-gray-300 rounded focus:ring-[#243b55]/30 cursor-pointer"
                                                {...register("isOutsideVendor")}
                                            />
                                            <label htmlFor="isOutsideVendor" className="text-xs font-semibold text-gray-600 cursor-pointer">
                                                Outside Vendor
                                            </label>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                                Date
                                            </label>
                                            <input
                                                type="date"
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                                                {...register("date")}
                                            />
                                            {errors.date && <p className="text-rose-500 text-[10px] mt-0.5">{errors.date.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                                Invoice Amount
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Enter amount"
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                                                {...register("invoiceAmount")}
                                            />
                                            {errors.invoiceAmount && <p className="text-rose-500 text-[10px] mt-0.5">{errors.invoiceAmount.message}</p>}
                                        </div>

                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                                Employee
                                            </label>
                                            <input
                                                type="text"
                                                readOnly
                                                placeholder="Employee"
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-gray-100 focus:outline-none transition text-gray-500 cursor-not-allowed"
                                                {...register("employee")}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                                VRN
                                            </label>
                                            <input
                                                type="text"
                                                readOnly
                                                placeholder="Vehicle Registration Number"
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-gray-100 focus:outline-none transition text-gray-500 cursor-not-allowed"
                                                {...register("vrn")}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                                Make
                                            </label>
                                            <input
                                                type="text"
                                                readOnly
                                                placeholder="Vehicle Make"
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-gray-100 focus:outline-none transition text-gray-500 cursor-not-allowed"
                                                {...register("make")}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                                Meter Reading (Current)
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Enter current reading"
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                                                {...register("currentMeterReading")}
                                            />
                                            {errors.currentMeterReading && <p className="text-rose-500 text-[10px] mt-0.5">{errors.currentMeterReading.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                                Vendor
                                            </label>
                                            <select
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                                                {...register("vendor")}
                                            >
                                                <option value="">Select Vendor</option>
                                                {vendors.map(vend => (
                                                    <option key={vend} value={vend}>{vend}</option>
                                                ))}
                                            </select>
                                            {errors.vendor && <p className="text-rose-500 text-[10px] mt-0.5">{errors.vendor.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                                Work Type
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Engine Oil, AC Service, Tyre Repair"
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                                                {...register("workType")}
                                            />
                                            {errors.workType && <p className="text-rose-500 text-[10px] mt-0.5">{errors.workType.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                                Upload Document
                                            </label>
                                            <input
                                                type="file"
                                                onChange={handleDocumentUpload}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                                                disabled={uploading}
                                            />
                                            {uploading && <p className="text-blue-500 text-[10px] mt-1 font-semibold animate-pulse">Uploading file...</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                                Comments
                                            </label>
                                            <textarea
                                                rows="2"
                                                placeholder="Enter description or notes"
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700 resize-none"
                                                {...register("comments")}
                                            />
                                        </div>
                                    </div>

                                </div>

                                {/* Document Table inside modal */}
                                <div className="border-t border-gray-100 pt-6">
                                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Documents List</h4>
                                    <table className="w-full text-left border-collapse border border-gray-150 rounded-lg overflow-hidden">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-150 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                <th className="px-4 py-2.5">Document Name</th>
                                                <th className="px-4 py-2.5 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-xs text-gray-600">
                                            {uploadedDoc ? (
                                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="px-4 py-2.5 font-medium text-gray-800">{uploadedDoc.name}</td>
                                                    <td className="px-4 py-2.5 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={handleRemoveDocument}
                                                            className="text-rose-600 hover:text-rose-800 font-bold inline-flex items-center gap-1 cursor-pointer"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ) : (
                                                <tr>
                                                    <td colSpan="2" className="px-4 py-6 text-center text-gray-400 italic">No document chosen.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer Buttons */}
                                <div className="border-t border-gray-100 pt-6 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => { setWorkOrderModal(false); reset(); setSelectedVehicle(null); setUploadedDoc(null); }}
                                        className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-xs font-semibold cursor-pointer"
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createWorkOrderMutation.isPending || uploading}
                                        className="px-5 py-2.5 bg-[#243b55] text-white rounded-lg hover:bg-[#243b55]/95 transition text-xs font-semibold cursor-pointer shadow-md shadow-[#243b55]/15"
                                    >
                                        {createWorkOrderMutation.isPending ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default WorkOrderManagementAdmin;
