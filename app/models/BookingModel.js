import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    bookingFor: {
        type: String,
        required: true,
        enum: ["Employee", "Guest"],
    },
    allowanceStaff: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    multipleDay: {
        type: Boolean,
        default: false,
    },
    toDate: {
        type: Date,
    },
    toTime: {
        type: String,
    },
    selfDriving: {
        type: Boolean,
        default: false,
    },
    rentedCar: {
        type: Boolean,
        default: false,
    },
    purpose: {
        type: String,
        required: true,
    },
    comments: {
        type: String,
    },
    bookingNature: {
        type: String,
        required: true,
        enum: ["Pickup", "Dropoff", "N/A"],
    },
    locationType: {
        type: String,
        required: true,
        enum: ["Single Location", "Multiple Locations"],
    },
    department: {
        type: String,
        required: true,
    },
    employee: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Approved", "Rejected", "Completed", "In Progress"],
    },
    assignedVehicle: {
        type: String,
    },
    driver: {
        type: String,
    }
}, { timestamps: true });

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;