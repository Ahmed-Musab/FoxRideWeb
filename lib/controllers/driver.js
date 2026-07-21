import connectDB from "@/lib/mongodb";
import Booking from "@/app/models/BookingModel";
import { verifyToken } from "@/lib/utils/tokenUtils";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import User from "@/app/models/UserModel"

async function getToken(req) {
    try {
        const cookieStore = await cookies();
        let token = cookieStore.get("token")?.value;
        if (!token) {
            const headersList = await headers();
            const authHeader = headersList.get("Authorization") || headersList.get("authorization");
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }
        if (!token && req) {
            const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }
        return token;
    } catch (e) {
        if (req) {
            const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
            if (authHeader && authHeader.startsWith("Bearer ")) {
                return authHeader.substring(7);
            }
        }
        return null;
    }
}

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

        const token = await getToken(req);

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

        const token = await getToken(req);

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

export const getPendingBookingsByDriver = async (req) => {
    try {
        await connectDB();

        const token = await getToken(req);

        if (!token) {
            return NextResponse.json({ message: "Token not found" }, { status: 404 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const bookings = await Booking.find({
            driver: decoded.email,
            status: "Pending"
        });

        return NextResponse.json({ bookings }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to get pending bookings" }, { status: 500 });
    }
};

export const getCompletedBookingsByDriver = async (req) => {
    try {
        await connectDB();

        const token = await getToken(req);

        if (!token) {
            return NextResponse.json({ message: "Token not found" }, { status: 404 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const bookings = await Booking.find({
            driver: decoded.email,
            status: "Completed"
        });

        return NextResponse.json({ bookings }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to get completed bookings" }, { status: 500 });
    }
};

export const getRejectedBookingsByDriver = async (req) => {
    try {
        await connectDB();

        const token = await getToken(req);

        if (!token) {
            return NextResponse.json({ message: "Token not found" }, { status: 404 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const bookings = await Booking.find({
            driver: decoded.email,
            status: "Rejected"
        });

        return NextResponse.json({ bookings }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to get rejected bookings" }, { status: 500 });
    }
};

export const getRecentPendingBookingByDriver = async (req) => {
    try {
        await connectDB();

        const token = await getToken(req);

        if (!token) {
            return NextResponse.json({ message: "Token not found" }, { status: 404 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const bookings = await Booking.find({
            driver: decoded.email,
            status: "Pending"
        }).sort({ createdAt: -1 }).limit(1);

        return NextResponse.json({ bookings }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to get recent pending bookings" }, { status: 500 });
    }
};

export const getRecentApprovedBookingByDriver = async (req) => {
    try {
        await connectDB();

        const token = await getToken(req);

        if (!token) {
            return NextResponse.json({ message: "Token not found" }, { status: 404 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const bookings = await Booking.find({
            driver: decoded.email,
            status: "Approved"
        }).sort({ createdAt: -1 }).limit(1);

        return NextResponse.json({ bookings }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to get recent approved bookings" }, { status: 500 });
    }
};

export const getRecentRejectedBookingByDriver = async (req) => {
    try {
        await connectDB();

        const token = await getToken(req);

        if (!token) {
            return NextResponse.json({ message: "Token not found" }, { status: 404 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const bookings = await Booking.find({
            driver: decoded.email,
            status: "Rejected"
        }).sort({ createdAt: -1 }).limit(1);

        return NextResponse.json({ bookings }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to get recent rejected bookings" }, { status: 500 });
    }
};

export const startTrip = async (req) => {
    try {
        await connectDB();
        const body = await req.json();
        const bookingID = body.bookingID
        const existingBooking = await Booking.findOne({
            bookingID: bookingID,
            status: "Approved"
        });
        if (!existingBooking) {
            return NextResponse.json({ message: "Booking not found or not approved" }, { status: 404 });
        }
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingID,
            { status: "In Progress" },
            { new: true }
        );
        if (!updatedBooking) {
            return NextResponse.json({ message: "Failed to update booking" }, { status: 500 });
        }
        return NextResponse.json({ updatedBooking }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to start trip" }, { status: 500 });
    }
};

export const completeTrip = async (req) => {
    try {
        await connectDB();
        const body = await req.json();
        const existingBooking = await Booking.findOne({
            _id: body.bookingId,
            status: "In Progress"
        });
        if (!existingBooking) {
            return NextResponse.json({ message: "Booking not found or not in progress" }, { status: 404 });
        }
        const updatedBooking = await Booking.findByIdAndUpdate(
            body.bookingId,
            { status: "Completed" },
            { new: true }
        );
        if (!updatedBooking) {
            return NextResponse.json({ message: "Failed to update booking" }, { status: 500 });
        }
        return NextResponse.json({ updatedBooking }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to complete trip" }, { status: 500 });
    }
};