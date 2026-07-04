import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Booking from "@/app/models/BookingModel";

export const approveBooking = async (req) => {
    try {
        await connectDB();
        const { bookingID } = await req.json();
        const booking = await Booking.findByIdAndUpdate(bookingID, { status: "Approved" });
        return NextResponse.json({ booking }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to approve booking" }, { status: 500 });
    }
}

export const rejectBooking = async (req) => {
    try {
        await connectDB();
        const { bookingID } = await req.json();
        const booking = await Booking.findByIdAndUpdate(bookingID, { status: "Rejected" });
        return NextResponse.json({ booking }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to reject booking" }, { status: 500 });
    }
}