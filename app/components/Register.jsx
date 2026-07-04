'use client';

import Link from "next/link";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

const Register = () => {

    const router = useRouter();

    const registerSchema = yup.object().shape({
        email: yup.string().email("Email is invalid").required("Email is required"),
        password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
        secretKey: yup.string().required("Secret Key is required"),
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(registerSchema),
    })

    const submitHandler = async (data) => {
        try {
            await axios.post('/api/auth/registerUser', {
                email: data.email,
                password: data.password,
                secretKey: data.secretKey,
                role: 'admin'
            });
            router.push('/pages/loginPage');
            toast.success('Registered Successfully');
        }
        catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    }

    return (
        <div>
            <div className="w-[400px] min-h-[300px] rounded-t-xl absolute top-1/3 left-1/6 bg-white z-10 shadow-2xl shadow-gray-300 shadow-inner">
                <div className='border-b flex justify-center py-2 text-xl font-semibold'>Register</div>
                <div className='p-5'>
                    <form onSubmit={handleSubmit(submitHandler)}>
                        <input type='text' placeholder='Email' className='w-full border border-gray-300 p-2 rounded' {...register('email')} />
                        <p className="text-red-500 text-xs">{errors.email?.message}</p>
                        <input type='password' placeholder='Password' className='w-full border border-gray-300 p-2 rounded mt-4' {...register('password')} />
                        <p className="text-red-500 text-xs">{errors.password?.message}</p>
                        <input type='text' placeholder='Secret Key' className='w-full border border-gray-300 p-2 rounded mt-4' {...register('secretKey')} />
                        <p className="text-red-500 text-xs">{errors.secretKey?.message}</p>
                        <button type='submit' className='w-full bg-[#243b55] text-white p-2 rounded mt-4'>Register</button>
                    </form>
                    <p className='text-center text-gray-500 mt-4'>Already have an account? <Link href='/pages/loginPage' className='text-[#243b55] cursor-pointer hover:font-semibold'>Login</Link></p>
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

export default Register