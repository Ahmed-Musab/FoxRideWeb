'use client';

import toast from "react-hot-toast";
import Sidebar from "./Sidebar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Check } from "lucide-react";

const ComplaintManagementAdmin = () => {

    const queryClient = useQueryClient();

    const getComplaints = async () => {
        try {
            const response = await axios.get("/api/admin/getComplaints");
            return response.data.complaints;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load complaints");
        }
    };

    const { data: complaints, isLoading: complaintsLoading, error: complaintsError } = useQuery({
        queryKey: ["complaints"],
        queryFn: getComplaints,
    });

    const completeComplaintMutation = useMutation({
        mutationFn: async (complaintID) => {
            const response = await axios.put("/api/admin/completeComplaint", { complaintID });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["complaints"]);
            toast.success("Complaint completed successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to complete complaint");
        }
    });

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
                </div>

                {
                    complaintsLoading ? (
                        <div>Loading...</div>
                    ) : complaintsError ? (
                        <div>Error loading complaints</div>
                    ) : complaints?.length === 0 ? (
                        <div>No complaints found</div>
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
                                    <p className="text-gray-500 text-xs">
                                        Against: {complaint.complaintAgainst} | Date: {complaint.complaintDate ? new Date(complaint.complaintDate).toLocaleDateString() : ""} | Status: {complaint.status}
                                    </p>
                                    <p className="text-gray-500 text-xs mt-2">Complaint By: {complaint.employee}</p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => completeComplaintMutation.mutate(complaint._id)}
                                            className={`flex items-center gap-1 px-2.5 py-1.5 bg-[#243b55]/5 text-[#243b55] hover:bg-[#243b55]/10 rounded-lg text-[11px] font-bold transition ${complaint.status === 'Completed' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                            disabled={complaint.status === 'Completed'}
                                        >
                                            <Check className="w-3 h-3" />
                                            {complaint.status === 'Completed' ? 'Completed' : 'Complete Complaint'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                }

            </main>
        </div>
    );
}

export default ComplaintManagementAdmin;