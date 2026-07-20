import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    vehicleImage: {
        type: String
    },
    VRN: {
        type: String,
        required: true,
    },
    regCity: {
        type: String,
        required: true,
    },
    assignedTo: {
        type: String,
    },
    capDate: {
        type: Date,
        required: true,
    },
    vehicleType: {
        type: String,
        required: true,
    },
    dept: {
        type: String,
        required: true,
    },
    chasisNo: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    mileage: {
        type: Number,
        required: true,
    },
    routePermitExpiry: {
        type: Date,
    },
    seatCapacity: {
        type: Number,
        required: true,
    },
    remarks: {
        type: String,
        required: true,
    },
    assetNo: {
        type: String,
        required: true,
    },
    fileNo: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    make: {
        type: String,
        required: true,
    },
    altDate: {
        type: Date,
    },
    region: {
        type: String,
        required: true,
    },
    engineNo: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    fuelCapacity: {
        type: String,
        required: true,
    },
    docUpload: {
        type: String
    },
    exciseTaxExpiry: {
        type: Date,
        required: true,
    },
    insuranceExpiry: {
        type: Date,
        required: true,
    },
    vehicleStatus: {
        type: String,
        required: true,
    },
    driver: {
        type: String
    }
})

const Vehicle = mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;