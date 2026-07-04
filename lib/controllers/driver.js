import connectDB from "@/lib/mongodb";
import Booking from "@/app/models/BookingModel";
import { verifyToken } from "@/lib/utils/tokenUtils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import User from "@/app/models/UserModel"

export const completeBooking = async (req) => {
    try {
        await connectDB();
        const { bookingID } = await req.json();
        
        const booking = await Booking.findByIdAndUpdate(
            bookingID, 
            { status: "Completed" },
            { new: true }
        );

        if (!booking) {
            return NextResponse.json({ message: "Booking not found" }, { status: 404 });
        }

        return NextResponse.json({ booking, message: "Booking completed successfully" }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to complete booking" }, { status: 500 });
    }
};

export const getApprovedBookingsByDriver = async (req) => {
    try {
        await connectDB();
        
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Token not found" }, { status: 404 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const bookings = await Booking.find({ 
            driver: decoded?.email, 
            status: "Approved" 
        });

        return NextResponse.json({ bookings }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to get approved bookings" }, { status: 500 });
    }
};

export const getBookingsByDriver = async (req) => {
    try {
        await connectDB();
        
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Token not found" }, { status: 404 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const bookings = await Booking.find({ 
            driver: decoded.email 
        });

        return NextResponse.json({ bookings }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to get driver bookings" }, { status: 500 });
    }
};

export const getDrivers = async () => {
    try {
        await connectDB();
        const drivers = await User.find({ role: "driver" });
        return NextResponse.json({ drivers }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get drivers" }, { status: 500 });
    }
}
