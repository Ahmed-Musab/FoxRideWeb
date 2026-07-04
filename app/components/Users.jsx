"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Edit2, Trash2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const getRoleBadgeClass = (role) => {

  switch (role) {
    case "admin":
      return "bg-indigo-50 border-indigo-100 text-indigo-700";
    case "employee":
      return "bg-emerald-50 border-emerald-100 text-emerald-700";
    case "manager":
      return "bg-amber-50 border-amber-100 text-amber-700";
    case "transportAdmin":
      return "bg-violet-50 border-violet-100 text-violet-700";
    default:
      return "bg-gray-50 border-gray-100 text-gray-700";
  }
};

const Users = () => {
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState(null);
  const { user, setUser } = useAuth();
  const [addUser, setAddUser] = useState(false);

  const userSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    role: yup.string().required()
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(userSchema),
  });

  const getUsers = async () => {
    const response = await axios.get("/api/auth/getUsers");
    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, role, email }) => axios.put("/api/auth/updateUser", { id, role, email }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });

if (user?._id === variables.id) {
      setUser((prev) => ({
        ...prev,
        email: variables.email,
        role: variables.role,
      }));
    }
      setEditingUser(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete("/api/auth/deleteUser", { data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  });

  const addUserMutation = useMutation({
    mutationFn: ({email, password, role}) => axios.post("/api/admin/addUser", {email, password, role}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User added successfully");
      setAddUser(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add user");
    }
  })

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <Sidebar />
      </aside>
      
      <main className="flex-1 p-10 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Users</h1>
            <p className="text-sm text-gray-500 mt-2">
              View user directories, update account levels, or manage roles within Fox Ride.
            </p>
          </div>
          <button 
            onClick={() => setAddUser(true)} 
            className="flex items-center gap-2 px-5 py-2.5 bg-[#243b55] text-white rounded-xl hover:bg-[#243b55]/95 shadow-md shadow-[#243b55]/10 font-semibold transition cursor-pointer"
          >
            Add User
          </button>
        </div>

{addUser && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-in zoom-in-95 duration-200">
      <form onSubmit={handleSubmit(addUserMutation.mutate)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Add New User</h2>
        <button onClick={() => setAddUser(false)} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Email"
          {...register("email")}
          className="w-full px-4 py-2 border border-gray-200 rounded-xl"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="w-full px-4 py-2 border border-gray-200 rounded-xl"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        <select 
        {...register("role")}
        className="w-full px-4 py-2 border border-gray-200 rounded-xl">
          <option value="">Select Role</option>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="transportAdmin">Transport Admin</option>
          <option value="driver">Driver</option>
        </select>
        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-xl cursor-pointer">
          Add User
        </button>
      </div>
      </form>
    </div>
  </div>
)}

        <div>
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-150 rounded-2xl p-6 h-36 animate-pulse flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/4" />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <div className="h-8 bg-gray-250 rounded-xl flex-1" />
                    <div className="h-8 bg-gray-250 rounded-xl flex-1" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-sm font-semibold">
              Error fetching users. Please check your database connection or authentication status.
            </div>
          )}

          {data?.users && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.users.map((user) => (
                <div key={user._id} className="bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#243b55]/10 border border-[#243b55]/20 flex items-center justify-center text-[#243b55] font-bold text-sm">
                        {user.email.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate" title={user.email}>
                          {user.email}
                        </p>
                        <span className={`inline-block text-[10px] border font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mt-1 ${getRoleBadgeClass(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-100 mt-4">
                    <button 
                      onClick={() => setEditingUser({ id: user._id, email: user.email, role: user.role })} 
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button 
                      onClick={() => { if (confirm(`Are you sure you want to delete ${user.email}?`)) deleteMutation.mutate(user._id); }} 
                      disabled={deleteMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-semibold rounded-xl transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h3 className="text-lg font-bold text-gray-900">Edit User</h3>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-[#243b55] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">System Role</label>
                <select 
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-[#243b55] bg-white transition"
                >
                  <option value="admin">Admin</option>
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="transportAdmin">Transport Admin</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-4 border-t border-gray-100">
              <button 
                onClick={() => setEditingUser(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => updateMutation.mutate(editingUser)}
                disabled={updateMutation.isPending}
                className="flex-1 py-2.5 bg-[#243b55] text-white hover:bg-[#243b55]/90 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;