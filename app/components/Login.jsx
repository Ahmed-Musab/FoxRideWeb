'use client';

import Link from "next/link";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "react-hot-toast";

const Login = () => {

    const router = useRouter();
    const { login, role, setRole } = useAuth();

    const loginSchema = yup.object().shape({
        email: yup.string().email("Email is invalid").required("Email is required"),
        password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema),
    })

    const submitHandler = async (data) => {
        try {
            const response = await axios.post('/api/auth/loginUser', {
                email: data?.email,
                password: data?.password,
                role: role
            });

            await login(response.data);

            switch (role) {
                case 'admin':
                    router.push('/pages/adminDashboardPage');
                    break;
                case 'employee':
                    router.push('/pages/employeeDashboardPage');
                    break;
                case 'manager':
                    router.push('/pages/managerDashboardPage');
                    break;
                case 'transportAdmin':
                    router.push('/pages/transportAdminDashboardPage');
                    break;
                case 'driver':
                    router.push('/pages/driverDashboardPage');
                    break;
                default:
                    break;
            }
            toast.success('Login successful');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    }

    return (
        <div>
            <div className="w-[400px] min-h-[300px] rounded-t-xl absolute top-1/3 left-1/6 bg-white z-10 shadow-2xl shadow-gray-300 shadow-inner">
                <div className='border-b flex justify-center py-2 text-xl font-semibold'>Login</div>
                <div className="px-3 flex items-center justify-between my-5 gap-x-1.5 bg-gray-50 px-1.5 rounded-lg border border-gray-100 mx-4">
                    <button
                        type="button"
                        className={`text-xs py-2 rounded-md w-full cursor-pointer transition-all duration-200 font-medium ${role === "admin"
                            ? "bg-[#243b55] text-white shadow-sm"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                        onClick={() => setRole("admin")}
                    >
                        Admin
                    </button>
                    <button
                        type="button"
                        className={`text-xs py-2 rounded-md w-full cursor-pointer transition-all duration-200 font-medium ${role === "employee"
                            ? "bg-[#243b55] text-white shadow-sm"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                        onClick={() => setRole("employee")}
                    >
                        Employee
                    </button>
                    <button
                        type="button"
                        className={`text-xs py-2 rounded-md w-full cursor-pointer transition-all duration-200 font-medium ${role === "manager"
                            ? "bg-[#243b55] text-white shadow-sm"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                        onClick={() => setRole("manager")}
                    >
                        Manager
                    </button>
                    <button
                        type="button"
                        className={`text-[11px] py-2 rounded-md w-full cursor-pointer transition-all duration-200 font-medium whitespace-nowrap overflow-hidden text-ellipsis ${role === "transportAdmin"
                            ? "bg-[#243b55] text-white shadow-sm"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                        title="Transport Admin"
                        onClick={() => setRole("transportAdmin")}
                    >
                        Transport
                    </button>
                    <button
                        type="button"
                        className={`text-[11px] py-2 rounded-md w-full cursor-pointer transition-all duration-200 font-medium whitespace-nowrap overflow-hidden text-ellipsis ${role === "driver"
                            ? "bg-[#243b55] text-white shadow-sm"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                        title="Driver"
                        onClick={() => setRole("driver")}
                    >
                        Driver
                    </button>
                </div>
                <div className='p-5'>
                    <form onSubmit={handleSubmit(submitHandler)}>
                        <input type='text' placeholder='Email' className='w-full border border-gray-300 p-2 rounded' {...register('email')} />
                        <p className="text-red-500 text-xs">{errors.email?.message}</p>
                        <input type='password' placeholder='Password' className='w-full border border-gray-300 p-2 rounded mt-4' {...register('password')} />
                        <p className="text-red-500 text-xs">{errors.password?.message}</p>
                        <button type='submit' className='w-full bg-[#243b55] text-white p-2 rounded mt-4'>Login</button>
                    </form>
                    <p className='text-center text-gray-500 mt-4'>Don't have an account? <Link href='/pages/registerPage' className='text-[#243b55] cursor-pointer hover:font-semibold'>Register</Link></p>
                </div>
            </div>
            <div className='grid grid-cols-3 h-screen'>
                <div className='col-span-1 border flex justify-center'>
                    <img src='/logo.png' className='w-[100px] h-[100px] mx-auto my-10' alt="FoxRide" />
                </div>
                <div style={{ backgroundImage: "url('/bg1.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} className="col-span-2 border">
                </div>
            </div>
        </div>
    )
}

export default Login