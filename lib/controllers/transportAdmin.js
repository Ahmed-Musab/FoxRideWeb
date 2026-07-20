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