import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
    complaintType: {
        type: String,
        required: true,
        enum: ["Car Problem", "Driver Problem", "Other"]
    },
    booking: {
        type: String,
        required: true
    },
    complaintAgainst: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true,
        enum: ["Low", "Medium", "High", "Critical"]
    },
    complaintDate: {
        type: Date,
        required: true
    },
    employee: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Completed"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Complaint = mongoose.models.Complaint || mongoose.model("Complaint", complaintSchema);
export default Complaint;