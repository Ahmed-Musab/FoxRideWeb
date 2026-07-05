import { generateToken } from "@/lib/utils/tokenUtils";
import connectDB from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import User from "@/app/models/UserModel";
import Joi from "joi";
import { NextResponse } from "next/server";

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().required(),
    secretKey: Joi.string().valid(process.env.SECRET_KEY || "SECRET_KEY_NOT_SET_IN_ENVIRONMENT").required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("admin", "employee", "manager", "transportAdmin", "driver").required()
});

// Register handler
export const register = async (req) => {
    try {
        await connectDB();
        const body = await req.json();
        const { error } = registerSchema.validate(body);
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
        return NextResponse.json({ message: "Failed to register user" }, { status: 500 });
    }
}

export const login = async (req) => {
    try {
        await connectDB();
        const body = await req.json();
        const { error } = loginSchema.validate(body);
        if (error) {
            return NextResponse.json({ message: error.details[0].message }, { status: 400 });
        }
        const { email, password, role } = body;
        const userExists = await User.findOne({ email });

        if (!userExists) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, userExists.password);

        if (!isPasswordValid) {
            return NextResponse.json({ message: "Invalid password" }, { status: 400 });
        }

        if (userExists.role !== role) {
            return NextResponse.json({ message: "You're not authorized to login as " + role }, { status: 403 });
        }

        const token = await generateToken(userExists);

        const response = NextResponse.json({
            message: "Login successful",
            token,
            user: {
                id: userExists._id,
                email: userExists.email,
                role: userExists.role
            }
        }, { status: 200 });
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60, // 1 day in seconds
            sameSite: "strict",
            path: "/",
        });

        return response;
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to login" }, { status: 500 });
    }
}

export const getUsers = async () => {
    try {
        await connectDB();
        const users = await User.find({});
        return users;
    }
    catch (error) {
        console.log(error);
        return { message: "Failed to fetch users", status: 500 };

    }
}

export const updateUser = async (req) => {
    try {
        await connectDB();
        const body = await req.json();
        const userExists = await User.findById(body.id);
        if (!userExists) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        userExists.role = body.role;
        userExists.email = body.email;
        await userExists.save();
        return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return { message: "Failed to update user", status: 500 };
    }
}

export const deleteUser = async (req) => {
    try {
        await connectDB();
        const body = await req.json();
        const userExists = await User.findById(body.id);
        if (!userExists) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        await User.findByIdAndDelete(body.id);
        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Failed to delete user" }, { status: 500 });
    }
}

export const logoutUser = async (req) => {
    const response = NextResponse.json({ message: 'Logout successful' }, { status: 200 });

    // Clear the token cookie by setting its expiration date in the past
    response.cookies.set('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(0),
        path: '/',
    });

    return response;
}
