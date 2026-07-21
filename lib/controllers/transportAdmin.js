import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Booking from "@/app/models/BookingModel";
import WorkOrder from "@/app/models/WorkOrderModel";

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

export const updateBooking = async (req) => {
    try {
        await connectDB();
        const body = await req.json();
        const bookingID = body.bookingID || body.bookingId;
        const VRN = body.vehicleVRN;
        const driver = body.driver;

        const alreadyAssignedVehicle = await Booking.findOne({ assignedVehicle: VRN, status: { $nin: ['Completed', 'Rejected'] } })
        if (alreadyAssignedVehicle) {
            return NextResponse.json({ message: "Vehicle is already assigned for another booking" }, { status: 400 });
        }

        const alreadyAssignedDriver = await Booking.findOne({ driver: driver, status: { $nin: ['Completed', 'Rejected'] } })
        if (alreadyAssignedDriver) {
            return NextResponse.json({ message: "Driver is already assigned for another booking" }, { status: 400 });
        }

        const booking = await Booking.findByIdAndUpdate(bookingID, { assignedVehicle: VRN, driver: driver }, { new: true });
        return NextResponse.json({ booking }, { status: 200 });

    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to update booking" }, { status: 500 });
    }
}

export const updateWorkOrder = async (req) => {
    try {
        await connectDB();
        const body = await req.json();
        const workOrder = await WorkOrder.findByIdAndUpdate(body.workOrderId, { status: body.status }, { new: true });
        return NextResponse.json({ workOrder }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to update work order" }, { status: 500 });
    }
}

export const getAllPendingBookings = async () => {
    try {
        await connectDB();
        const bookings = await Booking.find({ status: "Pending" });
        return NextResponse.json({ bookings }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get all pending bookings" }, { status: 500 });
    }
}

export const getAllApprovedBookings = async () => {
    try {
        await connectDB();
        const bookings = await Booking.find({ status: "Approved" });
        return NextResponse.json({ bookings }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get all approved bookings" }, { status: 500 });
    }
}

export const getAllCompletedBookings = async () => {
    try {
        await connectDB();
        const bookings = await Booking.find({ status: "Completed" });
        return NextResponse.json({ bookings }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get all completed bookings" }, { status: 500 });
    }
}

export const getAllRejectedBookings = async () => {
    try {
        await connectDB();
        const bookings = await Booking.find({ status: "Rejected" });
        return NextResponse.json({ bookings }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get all rejected bookings" }, { status: 500 });
    }
}

export const getRecentPendingBooking = async () => {
    try {
        await connectDB();
        const bookings = await Booking.find({ status: "Pending" }).sort({ createdAt: -1 }).limit(1);
        return NextResponse.json({ bookings }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get recent pending bookings" }, { status: 500 });
    }
}

export const getRecentApprovedBooking = async () => {
    try {
        await connectDB();
        const bookings = await Booking.find({ status: "Approved" }).sort({ createdAt: -1 }).limit(1);
        return NextResponse.json({ bookings }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get recent approved bookings" }, { status: 500 });
    }
}

export const getRecentRejectedBooking = async () => {
    try {
        await connectDB();
        const bookings = await Booking.find({ status: "Rejected" }).sort({ createdAt: -1 }).limit(1);
        return NextResponse.json({ bookings }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get recent rejected bookings" }, { status: 500 });
    }
}

export const getRecentCompletedBooking = async () => {
    try {
        await connectDB();
        const bookings = await Booking.find({ status: "Completed" }).sort({ createdAt: -1 }).limit(1);
        return NextResponse.json({ bookings }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get recent completed bookings" }, { status: 500 });
    }
}

