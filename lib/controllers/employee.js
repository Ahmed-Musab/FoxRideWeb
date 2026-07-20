import connectDB from "@/lib/mongodb";
import Booking from "@/app/models/BookingModel";
import User from "@/app/models/UserModel";
import Joi from "joi";
import { verifyToken } from "@/lib/utils/tokenUtils";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import Alert from "@/app/models/AlertsModel";
import Complaint from "@/app/models/ComplaintModel";
import WorkOrder from "@/app/models/WorkOrderModel";
import Vehicle from "@/app/models/VehicleModel";

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

const complaintSchema = Joi.object({
    complaintType: Joi.string().required(),
    complaintAgainst: Joi.string().required(),
    priority: Joi.string().required(),
    complaintDate: Joi.date().required(),
    description: Joi.string().required(),
    booking: Joi.string().required()
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


        const token = await getToken(req);

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

export const getBookingByEmail = async (req) => {
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

        const bookings = await Booking.find({ employee: decoded?.email });
        return NextResponse.json({ bookings, booking: bookings }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get booking by id" }, { status: 500 });
    }
}

export const getAlertsByEmail = async (req) => {
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

        const alerts = await Alert.find({ employee: decoded?.email });
        return NextResponse.json({ alerts }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get alerts by email" }, { status: 500 });
    }
}

export const getCompletedBookingsByEmail = async (req) => {
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

        const bookings = await Booking.find({ employee: decoded?.email, status: 'Completed' });
        return NextResponse.json({ bookings, booking: bookings }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get completed bookings" }, { status: 500 });
    }
}

export const getApprovedBookingsByEmail = async (req) => {
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

        const bookings = await Booking.find({ employee: decoded?.email, status: 'Approved' });
        return NextResponse.json({ bookings }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get approved bookings" }, { status: 500 });
    }
}

export const getRejectedBookingsByEmail = async (req) => {
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

        const bookings = await Booking.find({ employee: decoded?.email, status: 'Rejected' });
        return NextResponse.json({ bookings }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get rejected bookings" }, { status: 500 });
    }
}

export const getPendingBookingsByEmail = async (req) => {
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

        const bookings = await Booking.find({ employee: decoded?.email, status: 'Pending' });
        return NextResponse.json({ bookings }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get pending bookings" }, { status: 500 });
    }
}

export const getRecentPendingBooking = async (req) => {
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

        const bookings = await Booking.find({ employee: decoded?.email, status: 'Pending' }).sort({ createdAt: -1 }).limit(1);
        return NextResponse.json({ booking: bookings }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get recent pending bookings" }, { status: 500 });
    }
}

export const getRecentApprovedBooking = async (req) => {
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

        const bookings = await Booking.find({ employee: decoded?.email, status: 'Approved' }).sort({ createdAt: -1 }).limit(1);
        return NextResponse.json({ booking: bookings }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get recent approved bookings" }, { status: 500 });
    }
}

export const getRecentRejectedBooking = async (req) => {
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

        const bookings = await Booking.find({ employee: decoded?.email, status: 'Rejected' }).sort({ createdAt: -1 }).limit(1);
        return NextResponse.json({ booking: bookings }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get recent rejected bookings" }, { status: 500 });
    }
}

export const addComplaint = async (req) => {
    try {
        await connectDB();
        const body = await req.json();
        const { error } = complaintSchema.validate(body);

        if (error) {
            return NextResponse.json({ message: error.details[0].message }, { status: 400 });
        }
        const token = await getToken(req);

        if (!token) {
            return NextResponse.json({ message: "Token not found" }, { status: 404 });
        }

        const decoded = await verifyToken(token);

        if (!decoded) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const mappedBody = {
            complaintType: body.complaintType,
            complaintAgainst: body.complaintAgainst,
            complaintDate: new Date(body.complaintDate),
            priority: body.priority,
            booking: body.booking,
            description: body.description,
            employee: decoded?.email,
            status: "Pending"
        };

        const complaint = await Complaint.create(mappedBody);
        return NextResponse.json({ complaint }, { status: 201 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to add complaint" }, { status: 500 });
    }
}

export const getComplaintsByEmail = async (req) => {
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

        const complaints = await Complaint.find({ employee: decoded?.email });
        return NextResponse.json({ complaints }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get complaints" }, { status: 500 });
    }
}

export const deleteComplaint = async (req) => {
    try {
        await connectDB();
        const { complaintID } = await req.json();
        const complaint = await Complaint.findByIdAndDelete(complaintID);
        return NextResponse.json({ complaint }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to delete complaint" }, { status: 500 });
    }
}

export const updateComplaint = async (req) => {
    try {
        await connectDB();
        const { complaintID, ...body } = await req.json();
        const complaint = await Complaint.findByIdAndUpdate(complaintID, body);
        return NextResponse.json({ complaint }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to update complaint" }, { status: 500 });
    }
}

const workOrderSchema = Joi.object({
    vehicleId: Joi.string().required(),
    vrn: Joi.string().required(),
    vehicleType: Joi.string().required(),
    make: Joi.string().required(),
    lastMeterReading: Joi.number().required(),
    currentMeterReading: Joi.number().required(),
    location: Joi.string().required(),
    vendor: Joi.string().required(),
    isOutsideVendor: Joi.boolean().default(false),
    workType: Joi.string().required(),
    date: Joi.date().required(),
    documentUrl: Joi.string().allow("", null),
    invoiceAmount: Joi.number().required(),
    comments: Joi.string().allow("", null)
});

export const getWorkOrders = async (req) => {
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

        const workOrders = await WorkOrder.find({
            $or: [
                { employee: decoded?.email },
                { employeeEmail: decoded?.email }
            ]
        }).sort({ createdAt: -1 });
        return NextResponse.json({ workOrders }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get work orders" }, { status: 500 });
    }
}

export const createWorkOrder = async (req) => {
    try {
        await connectDB();
        const body = await req.json();
        const { error } = workOrderSchema.validate(body);
        if (error) {
            return NextResponse.json({ message: error.details[0].message }, { status: 400 });
        }

        const vehicle = await Vehicle.findById(body.vehicleId);
        if (vehicle) {
            vehicle.mileage = body.currentMeterReading;
            await vehicle.save();
        }

        const token = await getToken(req);

        if (!token) {
            return NextResponse.json({ message: "Token not found" }, { status: 404 });
        }

        const decoded = await verifyToken(token);

        if (!decoded) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const workOrder = await WorkOrder.create({ ...body, employee: decoded.email, status: "Pending" });
        return NextResponse.json({ workOrder }, { status: 201 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: error.message || "Failed to create work order" }, { status: 500 });
    }
}