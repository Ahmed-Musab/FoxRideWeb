"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useSidebar } from "@/app/context/SidebarContext";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Car,
  CalendarCheck,
  Bell,
  ShieldCheck,
  LogOut,
  ChevronsRight,
  ChevronsLeft
} from "lucide-react";
import toast from "react-hot-toast";

const Sidebar = () => {

  const { user, role, logout } = useAuth();
  const { isMinimized, setIsMinimized } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const sidebarRef = useRef(null);

  useEffect(() => {
    const parent = sidebarRef.current?.parentElement;
    if (parent && parent.tagName === 'ASIDE') {
      parent.classList.add('transition-all', 'duration-300', 'h-screen', 'sticky', 'top-0');
      if (isMinimized) {
        parent.classList.remove('w-64', 'p-6');
        parent.classList.add('w-20', 'p-4');
      } else {
        parent.classList.remove('w-20', 'p-4');
        parent.classList.add('w-64', 'p-6');
      }
    }
  }, [isMinimized]);

  let links = [];

  if (role === 'admin') {
    links = [
      {
        name: "Dashboard",
        href: "/pages/adminDashboardPage",
        icon: LayoutDashboard,
      },
      {
        name: "Users",
        href: "/pages/usersPage",
        icon: Users,
      },
      {
        name: "Vehicle Management",
        href: "/pages/vehicleManagementAdminPage",
        icon: Car,
      },
      {
        name: "Booking Management",
        href: "/pages/bookingManagementAdminPage",
        icon: CalendarCheck,
      },
      {
        name: "Alerts",
        href: "/pages/alertManagementAdminPage",
        icon: Bell,
      },
      {
        name: "Roles",
        href: "/pages/rolesPage",
        icon: ShieldCheck,
      }
    ];

  }
  else if (role === 'employee') {
    links = [
      {
        name: "Dashboard",
        href: "/pages/adminDashboardPage",
        icon: LayoutDashboard,
      },
      {
        name: "Vehicle Management",
        href: "/pages/vehicleManagementEmployeePage",
        icon: Car,
      },
      {
        name: "Booking Management",
        href: "/pages/bookingManagementEmployeePage",
        icon: CalendarCheck,
      },
      {
        name: "Alerts",
        href: "/pages/alertManagementEmployeePage",
        icon: Bell,
      }
    ];
  }

  else if (role === 'manager') {
    links = [
      {
        name: "Dashboard",
        href: "/pages/managerDashboardPage",
        icon: LayoutDashboard,
      },
      {
        name: "Bookings",
        href: "/pages/bookingManagementManagerPage",
        icon: CalendarCheck,
      },
      {
        name: "Alerts",
        href: "/pages/alertManagementEmployeePage",
        icon: Bell,
      }
    ];
  }
  else if (role === 'driver') {
    links = [
      {
        name: "Dashboard",
        href: "/pages/driverDashboardPage",
        icon: LayoutDashboard,
      },
      {
        name: "Vehicles",
        href: "/pages/vehicleManagementEmployeePage",
        icon: LayoutDashboard,
      }
    ];
  }

  else {
    links = [
      {
        name: "Dashboard",
        href: "/pages/transportAdminDashboardPage",
        icon: LayoutDashboard,
      },
      {
        name: "Alerts",
        href: "/pages/alertManagementAdminPage",
        icon: Bell,
      },
      {
        name: "Bookings",
        href: "/pages/bookingManagementTransportAdminPage",
        icon: CalendarCheck,
      }
    ];
  }

  const logoutHandler = () => {
    logout();
    router.push('/pages/loginPage');
    toast.success('Logout successful');
  }

  const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : "";

  return (
    <div ref={sidebarRef} className="flex flex-col h-full justify-between flex-1 relative">
      <div>
        <div className={`flex  mb-2 ${isMinimized ? 'justify-center' : 'justify-end'}`}>
          {isMinimized ? (
            <button onClick={() => setIsMinimized(false)} className="bg-white rounded-full border border-gray-200 p-1.5 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer">
              <ChevronsRight className="w-4 h-4 text-gray-600" />
            </button>
          ) : (
            <button onClick={() => setIsMinimized(true)} className="bg-white rounded-full border border-gray-200 p-1.5 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer">
              <ChevronsLeft className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>

        {/* Header / Brand */}
        <div className={`flex items-center border-b border-gray-100 mb-6 ${isMinimized ? "justify-center py-2" : "gap-3 px-2 py-4"}`}>
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#243b55]/10 flex items-center justify-center p-1 border border-[#243b55]/20 shadow-sm flex-shrink-0">
            <Image src="/logo.png" alt="FoxRide Logo" width={32} height={32} className="object-contain" />
          </div>
          {!isMinimized && (
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 tracking-tight text-lg leading-none">Fox Ride</span>
              <span className="text-[10px] font-semibold text-[#243b55] uppercase tracking-wider mt-1">{displayRole || 'User'} Portal</span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {links.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={index}
                href={link.href}
                title={isMinimized ? link.name : ""}
                className={`flex items-center transition-all duration-200 group ${isMinimized ? "justify-center p-3" : "gap-3 px-4 py-3"
                  } ${isActive
                    ? "bg-[#243b55] text-white shadow-md shadow-[#243b55]/10"
                    : "text-gray-600 hover:text-[#243b55] hover:bg-[#243b55]/5"
                  } rounded-xl`}
              >
                <link.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 flex-shrink-0 ${isActive ? "text-white" : "text-gray-400 group-hover:text-[#243b55]"
                  }`} />
                {!isMinimized && <span className="font-medium text-sm">{link.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-gray-100 mt-auto">
        {user && !isMinimized && (
          <div className="px-4 py-3 mb-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col">
            <span className="text-xs font-semibold text-gray-700 truncate">{user?.name || user?.email}</span>
          </div>
        )}
        <button
          onClick={logoutHandler}
          title={isMinimized ? "Logout" : ""}
          className={`w-full flex items-center rounded-xl text-gray-600 hover:text-rose-600 hover:bg-rose-50/50 transition-all duration-200 group cursor-pointer ${isMinimized ? "justify-center p-3" : "gap-3 px-4 py-3"
            }`}
        >
          <LogOut className="w-5 h-5 text-gray-400 group-hover:text-rose-600 transition-transform duration-200 group-hover:translate-x-0.5 flex-shrink-0" />
          {!isMinimized && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </div>
  )
}

export default Sidebar