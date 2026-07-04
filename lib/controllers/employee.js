import connectDB from "@/lib/mongodb";
import Booking from "@/app/models/BookingModel";
import User from "@/app/models/UserModel";
import Joi from "joi";
import { verifyToken } from "@/lib/utils/tokenUtils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Alert from "@/app/models/AlertsModel";

const bookingSchema = Joi.object({
    bookingFor: Joi.string().required(),
    allowanceStaff: Joi.boolean().required(),
    date: Joi.date().required(),
    time: Joi.string().required(),
    multipleDay: Joi.boolean().required(),
    toDate: Joi.date().allow("", null),
    toTime: Joi.string().allow("", null),
    selfDriving: Joi.boolean().required(),
    rentedCar: Joi.boolean().required(),
    purpose: Joi.string().required(),
    comments: Joi.string().allow(""),
    bookingNature: Joi.string().required(),
    locationType: Joi.string().required(),
    department: Joi.string().required(),
    location: Joi.string().required(),
    status: Joi.string().required(),
});

export async function createBooking(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { error } = bookingSchema.validate(body);
        if (error) {
            return NextResponse.json({ message: error.details[0].message }, { status: 400 });
        }

        if (body.toDate === "") body.toDate = null;
        if (body.toTime === "") body.toTime = null;


        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Token not found" }, { status: 404 });
        }

        const decoded = await verifyToken(token);

        if (!decoded) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const alreadyAssigned = await Booking.findOne({ employee: decoded?.email, status: { $nin: ['Completed', 'Rejected'] } });
        if (alreadyAssigned) {
            return NextResponse.json({ message: "You already have an assigned booking" }, { status: 400 });
        }

        const mappedBody = {
            bookingFor: body.bookingFor,
            allowanceStaff: body.allowanceStaff,
            date: body.date,
            time: body.time,
            multipleDay: body.multipleDay,
            toDate: body.toDate,
            toTime: body.toTime,
            selfDriving: body.selfDriving,
            rentedCar: body.rentedCar,
            purpose: body.purpose,
            comments: body.comments,
            bookingNature: body.bookingNature,
            locationType: body.locationType,
            department: body.department,
            employee: decoded?.email,
            location: body.location,
            status: body.status,
        };

        const booking = await Booking.create(mappedBody);
        return NextResponse.json({ booking }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to create booking" }, { status: 500 });
    }
}

export const getEmployees = async () => {
    try {
        await connectDB();
        const employees = await User.find({ role: 'employee' });
        return NextResponse.json({ employees }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get employees" }, { status: 500 });
    }
}

export const cancelBooking = async (req) => {
    try {
        await connectDB();
        const { bookingId } = await req.json();
        const booking = await Booking.findByIdAndDelete(bookingId);
        return NextResponse.json({ booking }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to cancel booking" }, { status: 500 });
    }
}

export const getBookingByEmail = async () => {
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

        const booking = await Booking.find({ employee: decoded?.email });
        return NextResponse.json({ booking }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get booking by id" }, { status: 500 });
    }
}

export const getAlertsByEmail = async () => {
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

        const alerts = await Alert.find({ employee: decoded?.email });
        return NextResponse.json({ alerts }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get alerts by email" }, { status: 500 });
    }
}

export const getCompletedBookingsByEmail = async () => {
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

        const bookings = await Booking.find({ employee: decoded?.email, status: 'Completed' });
        return NextResponse.json({ bookings, booking: bookings }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get completed bookings" }, { status: 500 });
    }
}