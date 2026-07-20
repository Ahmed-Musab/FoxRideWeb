"use client";

import Sidebar from "./Sidebar";
import { useState } from "react";
import { X, Calendar, MapPin, Briefcase, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const BookingManagementEmployee = () => {

  const [booking, setBooking] = useState(false);
  const [hideBooking, setHideBooking] = useState([]);
  const queryClient = useQueryClient();

  const bookingSchema = yup.object().shape({
    bookingFor: yup.string().required("Selection is required"),
    allowanceStaff: yup.boolean(),
    date: yup.string().required("Start date is required"),
    time: yup.string().required("Start time is required"),
    multipleDay: yup.boolean(),
    toDate: yup.string().when("multipleDay", {
      is: true,
      then: (schema) => schema.required("End date is required"),
      otherwise: (schema) => schema.notRequired()
    }),
    toTime: yup.string().when("multipleDay", {
      is: true,
      then: (schema) => schema.required("End time is required"),
      otherwise: (schema) => schema.notRequired()
    }),
    selfDriving: yup.boolean(),
    rentedCar: yup.boolean(),
    purpose: yup.string().required("Purpose of booking is required"),
    comments: yup.string(),
    bookingNature: yup.string().required("Booking nature is required"),
    locationType: yup.string().required("Location type is required"),
    department: yup.string().required("Department is required"),
    location: yup.string().required("Location is required"),
  });

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: yupResolver(bookingSchema),
    defaultValues: {
      bookingFor: "Employee",
      allowanceStaff: false,
      multipleDay: false,
      selfDriving: false,
      rentedCar: false,
      bookingNature: "Pickup",
      locationType: "Single Location",
      department: "",
      comments: ""
    }
  });

  const isMultipleDay = watch("multipleDay");

  const getBookings = async () => {
    try {
      const response = await axios.get("/api/employee/getBookingByEmail");
      return response.data.booking;
    }
    catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch bookings");
      return [];
    }
  }

  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post("/api/employee/createBooking", {
        ...data,
        status: "Pending"
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]);
      setBooking(false);
      reset();
      toast.success("Booking created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create booking");
    }
  });

  const cancelBookingMutation = useMutation({
    mutationFn: async ({ bookingId }) => {
      const response = await axios.delete("/api/employee/cancelBooking", { data: { bookingId } });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]);
      toast.success("Booking cancelled successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  });

  const onSubmit = (data) => {
    createBookingMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <Sidebar />
      </aside>
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Booking Management</h1>
            <p className="text-sm text-gray-500 mt-2">Create and monitor vehicle booking logs, routing options, and driver assignments.</p>
          </div>
          <button
            onClick={() => setBooking(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#243b55] text-white rounded-xl hover:bg-[#243b55]/95 shadow-md shadow-[#243b55]/10 font-semibold transition cursor-pointer"
          >
            Create Booking
          </button>
        </div>

        {/* Bookings Display Grid */}
        <div className="mt-8">
          {bookingsLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-150 rounded-2xl p-6 h-56 animate-pulse flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                  <div className="h-9 bg-gray-200 rounded-xl mt-4" />
                </div>
              ))}
            </div>
          )}

          {bookingsError && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-sm font-semibold mb-6">
              Error fetching bookings: {bookingsError.message}
            </div>
          )}

          {bookings && (!Array.isArray(bookings) || bookings.length === 0) && (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-medium">No bookings logged yet.</p>
            </div>
          )}

          {bookings && Array.isArray(bookings) && bookings.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.filter(b => !hideBooking.includes(b._id)).map((b) => {
                const startD = b.date ? new Date(b.date).toLocaleDateString() : "";
                const endD = b.toDate ? new Date(b.toDate).toLocaleDateString() : "";
                return (
                  <div
                    key={b._id}
                    className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div>
                      {/* Title & Type */}
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 text-base truncate" title={b.purpose}>
                            {b.purpose}
                          </h3>
                          <p className="text-xs text-gray-400 font-medium mt-0.5">
                            Booked for: {b.bookingFor}
                          </p>
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex-shrink-0 ${b.bookingNature === "Pickup"
                            ? "bg-indigo-50 border-indigo-100 text-indigo-700"
                            : b.bookingNature === "Dropoff"
                              ? "bg-amber-50 border-amber-100 text-amber-700"
                              : "bg-gray-50 border-gray-150 text-gray-700"
                          }`}>
                          {b.bookingNature}
                        </span>
                      </div>

                      {/* Date & Time display */}
                      <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-3 my-3 text-xs text-gray-600 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="font-medium">
                            {b.multipleDay ? `From: ${startD} (${b.time})` : `${startD} at ${b.time}`}
                          </span>
                        </div>
                        {b.multipleDay && (
                          <div className="flex items-center gap-2 border-t border-gray-100 pt-1.5 mt-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="font-medium">
                              To: {endD} {b.toTime ? `(${b.toTime})` : ""}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Spec details */}
                      <div className="grid grid-cols-1 gap-2.5 py-3 text-xs text-gray-600 border-b border-gray-100/60 mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <Briefcase className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate">Dept: {b.department}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate" title={b.employee}>Staff: {b.employee}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate" title={b.location}>To: {b.location}</span>
                        </div>
                      </div>

                      {/* Booking options tags */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {b.selfDriving && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-semibold border border-emerald-100">
                            Self Driving
                          </span>
                        )}
                        {b.rentedCar && (
                          <span className="text-[10px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md font-semibold border border-sky-100">
                            Rented Car
                          </span>
                        )}
                        {b.allowanceStaff && (
                          <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-semibold border border-purple-100">
                            Allowance Staff
                          </span>
                        )}
                      </div>

                      {b.comments && (
                        <p className="text-[11px] text-gray-400 italic mt-3 bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                          "{b.comments}"
                        </p>
                      )}

                      <p className="text-[11px] text-gray-400 italic mt-3 bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                        Status: {b.status}
                      </p>

                      {b.status === "Completed" ?
                        <button onClick={() => setHideBooking((prev) => [...prev, b._id])}
                          className={"mt-3 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-semibold text-xs cursor-pointer"}
                        >
                          Hide Booking
                        </button>
                        :
                        <button 
                        onClick={() => cancelBookingMutation.mutate({ bookingId: b?._id })}
                        className="mt-3 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-semibold text-xs cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal */}
        {booking && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-gray-150">

              {/* Header */}
              <div className="bg-[#243b55] px-6 py-4 flex items-center justify-between text-white">
                <h3 className="text-base font-semibold tracking-wide">Create Booking</h3>
                <button
                  onClick={() => { setBooking(false); reset(); }}
                  className="text-gray-300 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 overflow-y-auto max-h-[80vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">

                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Booking For */}
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-xs font-semibold text-gray-600">Booking For</span>
                      <div className="flex gap-4">
                        <label className="inline-flex items-center text-xs text-gray-700 cursor-pointer">
                          <input
                            type="radio"
                            value="Employee"
                            className="mr-2 text-[#243b55] focus:ring-[#243b55]"
                            {...register("bookingFor")}
                          />
                          Employee
                        </label>
                        <label className="inline-flex items-center text-xs text-gray-700 cursor-pointer">
                          <input
                            type="radio"
                            value="Guest"
                            className="mr-2 text-[#243b55] focus:ring-[#243b55]"
                            {...register("bookingFor")}
                          />
                          Guest
                        </label>
                      </div>
                      {errors.bookingFor && <p className="text-rose-500 text-[10px] mt-0.5">{errors.bookingFor.message}</p>}
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                          {...register("date")}
                        />
                      </div>
                      {errors.date && <p className="text-rose-500 text-[10px] mt-0.5">{errors.date.message}</p>}
                    </div>

                    {/* Multiple Day Booking */}
                    <div className="flex items-center py-1">
                      <label className="inline-flex items-center text-xs font-semibold text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded text-[#243b55] focus:ring-[#243b55] mr-2.5 w-4 h-4 border-gray-200"
                          {...register("multipleDay")}
                        />
                        Multiple Day Booking
                      </label>
                    </div>

                    {/* To Date */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">To Date</label>
                      <input
                        type="date"
                        disabled={!isMultipleDay}
                        className={`w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs transition text-gray-700 focus:outline-none ${isMultipleDay ? "bg-white focus:border-[#243b55]" : "bg-gray-100 cursor-not-allowed"
                          }`}
                        {...register("toDate")}
                      />
                      {isMultipleDay && errors.toDate && <p className="text-rose-500 text-[10px] mt-0.5">{errors.toDate.message}</p>}
                    </div>

                    {/* Self Driving */}
                    <div className="flex items-center py-1">
                      <label className="inline-flex items-center text-xs font-semibold text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded text-[#243b55] focus:ring-[#243b55] mr-2.5 w-4 h-4 border-gray-200"
                          {...register("selfDriving")}
                        />
                        Self Driving
                      </label>
                    </div>

                    {/* Rented Car Required */}
                    <div className="flex items-center py-1">
                      <label className="inline-flex items-center text-xs font-semibold text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded text-[#243b55] focus:ring-[#243b55] mr-2.5 w-4 h-4 border-gray-200"
                          {...register("rentedCar")}
                        />
                        Rented Car Required
                      </label>
                    </div>

                    {/* Purpose of Booking */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Purpose of Booking
                      </label>
                      <input
                        type="text"
                        placeholder="Specify booking reason"
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                        {...register("purpose")}
                      />
                      {errors.purpose && <p className="text-rose-500 text-[10px] mt-0.5">{errors.purpose.message}</p>}
                    </div>

                    {/* Booking Nature */}
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-xs font-semibold text-gray-600">Booking Nature</span>
                      <div className="flex gap-4">
                        <label className="inline-flex items-center text-xs text-gray-700 cursor-pointer">
                          <input
                            type="radio"
                            value="Pickup"
                            className="mr-2 text-[#243b55] focus:ring-[#243b55]"
                            {...register("bookingNature")}
                          />
                          Pickup
                        </label>
                        <label className="inline-flex items-center text-xs text-gray-700 cursor-pointer">
                          <input
                            type="radio"
                            value="Dropoff"
                            className="mr-2 text-[#243b55] focus:ring-[#243b55]"
                            {...register("bookingNature")}
                          />
                          Dropoff
                        </label>
                        <label className="inline-flex items-center text-xs text-gray-700 cursor-pointer">
                          <input
                            type="radio"
                            value="N/A"
                            className="mr-2 text-[#243b55] focus:ring-[#243b55]"
                            {...register("bookingNature")}
                          />
                          N/A
                        </label>
                      </div>
                    </div>

                    {/* Location Type */}
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-xs font-semibold text-gray-600">Location Type</span>
                      <div className="flex gap-4">
                        <label className="inline-flex items-center text-xs text-gray-700 cursor-pointer">
                          <input
                            type="radio"
                            value="Single Location"
                            className="mr-2 text-[#243b55] focus:ring-[#243b55]"
                            {...register("locationType")}
                          />
                          Single Location
                        </label>
                        <label className="inline-flex items-center text-xs text-gray-700 cursor-pointer">
                          <input
                            type="radio"
                            value="Multiple Locations"
                            className="mr-2 text-[#243b55] focus:ring-[#243b55]"
                            {...register("locationType")}
                          />
                          Multiple Locations
                        </label>
                      </div>
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Department</label>
                      <select
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                        {...register("department")}
                      >
                        <option value="">--Please Select--</option>
                        <option value="Operations">Operations</option>
                        <option value="Logistics">Logistics</option>
                        <option value="Sales">Sales</option>
                        <option value="Human Resource">Human Resources</option>
                      </select>
                      {errors.department && <p className="text-rose-500 text-[10px] mt-0.5">{errors.department.message}</p>}
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="Enter location detail"
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                        {...register("location")}
                      />
                      {errors.location && <p className="text-rose-500 text-[10px] mt-0.5">{errors.location.message}</p>}
                    </div>

                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Allowance Staff */}
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-xs font-semibold text-gray-600">Allowance Staff</span>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded text-[#243b55] focus:ring-[#243b55] w-4 h-4 border-gray-200"
                          {...register("allowanceStaff")}
                        />
                      </label>
                    </div>

                    {/* Time */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                        {...register("time")}
                      />
                      {errors.time && <p className="text-rose-500 text-[10px] mt-0.5">{errors.time.message}</p>}
                    </div>

                    {/* Spacer to match layout */}
                    <div className="h-6 hidden md:block" />

                    {/* To Time */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Time {isMultipleDay && <span className="text-rose-500">*</span>}
                      </label>
                      <input
                        type="time"
                        disabled={!isMultipleDay}
                        className={`w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs transition text-gray-700 focus:outline-none ${isMultipleDay ? "bg-white focus:border-[#243b55]" : "bg-gray-100 cursor-not-allowed"
                          }`}
                        {...register("toTime")}
                      />
                      {isMultipleDay && errors.toTime && <p className="text-rose-500 text-[10px] mt-0.5">{errors.toTime.message}</p>}
                    </div>

                    {/* Spacers to match check heights */}
                    <div className="h-14 hidden md:block" />

                    {/* Comments */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Comments</label>
                      <input
                        type="text"
                        placeholder="Add additional instructions"
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs bg-white focus:outline-none focus:border-[#243b55] transition text-gray-700"
                        {...register("comments")}
                      />
                    </div>

                    {/* Spacer */}
                    <div className="h-14 hidden md:block" />

                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 justify-end pt-6 border-t border-gray-100 mt-8">
                  <button
                    type="button"
                    onClick={() => { setBooking(false); reset(); }}
                    className="py-2 px-6 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-6 bg-[#243b55] text-white hover:bg-[#243b55]/90 text-xs font-semibold rounded-xl transition cursor-pointer"
                  >
                    Create Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default BookingManagementEmployee;