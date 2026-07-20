import mongoose from "mongoose";

const workOrderSchema = new mongoose.Schema({
    vehicleId: {
        type: String,
        required: true,
    },
    employee: {
        type: String,
        required: true,
    },
    vrn: {
        type: String,
        required: true,
    },
    vehicleType: {
        type: String,
        required: true,
    },
    make: {
        type: String,
        required: true,
    },
    lastMeterReading: {
        type: Number,
        required: true,
    },
    currentMeterReading: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    vendor: {
        type: String,
        required: true,
    },
    isOutsideVendor: {
        type: Boolean,
        default: false,
    },
    workType: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    documentUrl: {
        type: String,
    },
    invoiceAmount: {
        type: Number,
        required: true,
    },
    comments: {
        type: String,
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Approved", "Completed"]
    }
}, { timestamps: true });

const WorkOrder = mongoose.models.WorkOrder || mongoose.model("WorkOrder", workOrderSchema);
export default WorkOrder;
