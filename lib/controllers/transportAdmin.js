import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Booking from "@/app/models/BookingModel";
import Vehicle from "@/app/models/VehicleModel";

export const getApprovedBookings = async (req) => {
    try {
        await connectDB();
        const bookings = await Booking.find({ status: "Approved" });
        return NextResponse.json({ bookings }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get approved bookings" }, { status: 500 });
    }
}

export const assignVehicle = async (req) => {
    try {
        await connectDB();
        const { bookingID, vehicleVRN } = await req.json();
        const vehicle = await Vehicle.findOne({ VRN: vehicleVRN })
        if (!vehicle) {
            return NextResponse.json({ message: "Vehicle not found" }, { status: 404 });
        }
        const booking = await Booking.findByIdAndUpdate(bookingID, { assignedVehicle: vehicleVRN, driver: vehicle.driver || vehicle.assignedTo }, { new: true });
        return NextResponse.json({ booking }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to assign vehicle" }, { status: 500 });
    }
}