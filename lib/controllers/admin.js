import connectDB from "@/lib/mongodb";
import Vehicle from "@/app/models/VehicleModel";
import Joi from "joi";
import { NextResponse } from "next/server";
import User from "@/app/models/UserModel";
import bcrypt from "bcryptjs";
import Booking from "@/app/models/BookingModel";
import Alert from "@/app/models/AlertsModel";
import { verifyToken } from "@/lib/utils/tokenUtils";
import { cookies } from "next/headers";

const vehicleSchema = Joi.object({
    vehicleImage: Joi.string().required(),
    vrn: Joi.number().required(),
    registerCity: Joi.string().required(),
    driver: Joi.string().required(),
    capDate: Joi.string().required(),
    vehicleType: Joi.string().required(),
    department: Joi.string().required(),
    chassisNumber: Joi.string().required(),
    color: Joi.string().required(),
    currentMileage: Joi.string().required(),
    vehiclePrice: Joi.number().required(),
    routePermitExpiry: Joi.string().required(),
    seatingCapacity: Joi.string().required(),
    remarks: Joi.string().required(),
    assetNumber: Joi.string().required(),
    fileNumber: Joi.string().required(),
    city: Joi.string().required(),
    vehicleMake: Joi.string().required(),
    alternateDate: Joi.string().required(),
    region: Joi.string().required(),
    engineNumber: Joi.string().required(),
    model: Joi.string().required(),
    fuelTankCapacity: Joi.string().required(),
    document: Joi.string().required(),
    exciseTaxExpiry: Joi.string().required(),
    insuranceExpiry: Joi.string().required(),
    vehicleStatus: Joi.string().required(),
});

const addUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().required()
});

const alertSchema = Joi.object({
    VRN: Joi.string().required(),
    alertName: Joi.string().required(),
    isActive: Joi.boolean().default(false),
    alertType: Joi.string().required(),
    alertDate: Joi.date().required()
});

export const addVehicle = async (req) => {
    try {
        await connectDB();
        const body = await req.json();
        const { error } = vehicleSchema.validate(body);
        if (error) {
            return NextResponse.json({ error: error.details[0].message }, { status: 400 });
        }

        const vehicleExists = await Vehicle.findOne({ VRN: body.vrn });
        if (vehicleExists) {
            return NextResponse.json({ message: "Vehicle with this VRN already exists" }, { status: 400 });
        }

        const vehiclesWithThisDriver = await Vehicle.findOne({driver: body.driver})

        if(vehiclesWithThisDriver){
            return NextResponse.json({message: "Vehicle with this driver already exists"}, {status: 400})
        }

        const mappedBody = {
            vehicleImage: body.vehicleImage,
            VRN: body.vrn,
            regCity: body.registerCity,
            driver: body.driver,
            assignedTo: body.driver,
            capDate: body.capDate,
            vehicleType: body.vehicleType,
            dept: body.department,
            chasisNo: body.chassisNumber,
            color: body.color,
            mileage: body.currentMileage,
            routePermitExpiry: body.routePermitExpiry,
            seatCapacity: body.seatingCapacity,
            remarks: body.remarks,
            assetNo: body.assetNumber,
            fileNo: body.fileNumber,
            city: body.city,
            make: body.vehicleMake,
            altDate: body.alternateDate,
            region: body.region,
            engineNo: body.engineNumber,
            model: body.model,
            fuelCapacity: body.fuelTankCapacity,
            docUpload: body.document,
            exciseTaxExpiry: body.exciseTaxExpiry,
            insuranceExpiry: body.insuranceExpiry,
            vehicleStatus: body.vehicleStatus
        };

        const vehicle = await Vehicle.create(mappedBody);
        return NextResponse.json({ vehicle }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const getVehicles = async () => {
    try {
        await connectDB();
        const vehicles = await Vehicle.find({});
        return NextResponse.json({ vehicles }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const deleteVehicle = async (req) => {
    try {
        await connectDB();
        const body = await req.json();
        const vehicleExists = await Vehicle.findById(body.id);
        if (!vehicleExists) {
            return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
        }
        await Vehicle.findByIdAndDelete(body.id);
        return NextResponse.json({ message: "Vehicle deleted successfully" }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const addUser = async (req) => {
    try {
        await connectDB();
        const body = await req.json();
        const { error } = addUserSchema.validate(body);
        if (error) {
            return NextResponse.json({ message: error.details[0].message }, { status: 400 });
        }
        const { email, password, role } = body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            email,
            password: hashedPassword,
            role,
        });

        const newUser = await user.save();

        if (newUser) {
            return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
        }
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to add user" }, { status: 500 });
    }
}

export const getBookings = async () => {
    try {
        await connectDB();
        const bookings = await Booking.find();
        return NextResponse.json({ bookings }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get bookings" }, { status: 500 });
    }
}

export const createAlert = async (req) => {
    try {
        await connectDB();
        const body = await req.json();
        const { error } = alertSchema.validate(body);
        if (error) {
            return NextResponse.json({ message: error.details[0].message }, { status: 400 });
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Token not found" }, { status: 404 });
        }

        const decoded = await verifyToken(token);

        if (!decoded) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const mappedBody = {
            VRN: body?.VRN,
            alertName: body?.alertName,
            isActive: body?.isActive,
            alertType: body?.alertType,
            alertDate: body?.alertDate,
            employee: decoded?.email
        }
        await Alert.create(mappedBody);
        return NextResponse.json({ message: "Alert created successfully" }, { status: 201 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to create alert" }, { status: 500 });
    }
}

export const getAlerts = async () => {
    try {
        await connectDB();
        const alerts = await Alert.find();
        return NextResponse.json({ alerts }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to get alerts" }, { status: 500 });
    }
}

export const deleteAlert = async (req) => {
    try {
        await connectDB();
        const body = await req.json();
        const alertExists = await Alert.findById(body.id);
        if (!alertExists) {
            return NextResponse.json({ message: "Alert not found" }, { status: 404 });
        }
        await Alert.findByIdAndDelete(body.id);
        return NextResponse.json({ message: "Alert deleted successfully" }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to delete alert" }, { status: 500 });
    }
}