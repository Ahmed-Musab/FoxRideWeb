import Sidebar from "./Sidebar";
import { 
  ShieldCheck, 
  UserCheck, 
  Briefcase, 
  Truck,
  CheckCircle2,
  Car
} from "lucide-react";

const roleData = [
  {
    title: "Admin",
    badge: "Full Access",
    description: "Responsible for overall platform administration, user governance, and security controls.",
    icon: ShieldCheck,
    color: "indigo",
    accentClass: "bg-indigo-50 border-indigo-100 text-indigo-700",
    badgeClass: "bg-indigo-100 text-indigo-800",
    iconColor: "text-indigo-600",
    hoverBorder: "hover:border-indigo-300 hover:shadow-indigo-50",
    permissions: [
      "User account provisioning",
      "Role & security access control",
      "System audit & logging access",
      "Platform configuration overrides",
      "Global analytical access"
    ]
  },
  {
    title: "Employee",
    badge: "Operations",
    description: "Handles day-to-day operations, standard vehicle workflows, and direct customer interactions.",
    icon: UserCheck,
    color: "emerald",
    accentClass: "bg-emerald-50 border-emerald-100 text-emerald-700",
    badgeClass: "bg-emerald-100 text-emerald-800",
    iconColor: "text-emerald-600",
    hoverBorder: "hover:border-emerald-300 hover:shadow-emerald-50",
    permissions: [
      "Vehicle status updates",
      "Basic booking dispatching",
      "Customer check-in processing",
      "Incident logging",
      "Individual performance metrics"
    ]
  },
  {
    title: "Manager",
    badge: "Oversight",
    description: "Manages branch resources, schedules personnel, and reviews operational performance dashboards.",
    icon: Briefcase,
    color: "amber",
    accentClass: "bg-amber-50 border-amber-100 text-amber-700",
    badgeClass: "bg-amber-100 text-amber-800",
    iconColor: "text-amber-600",
    hoverBorder: "hover:border-amber-300 hover:shadow-amber-50",
    permissions: [
      "Employee shift scheduling",
      "Resource allocation approval",
      "Operational performance logs",
      "Customer escalation handling",
      "Branch-level data exports"
    ]
  },
  {
    title: "Transport Admin",
    badge: "Logistics",
    description: "Configures fleet schedules, handles carrier routing, and maintains physical vehicle inventories.",
    icon: Truck,
    color: "violet",
    accentClass: "bg-violet-50 border-violet-100 text-violet-700",
    badgeClass: "bg-violet-100 text-violet-800",
    iconColor: "text-violet-600",
    hoverBorder: "hover:border-violet-300 hover:shadow-violet-50",
    permissions: [
      "Fleet inventory management",
      "Route definition & optimization",
      "Carrier dispatch approvals",
      "Maintenance scheduling",
      "Transport capacity adjustments"
    ]
  },
  {
    title: 'Driver',
    badge: 'Driver',
    description: 'Driver will be able to manage bookings and vehicles',
    icon: Car,
    color: 'blue',
    accentClass: 'bg-blue-50 border-blue-100 text-blue-700',
    badgeClass: 'bg-blue-100 text-blue-800',
    iconColor: 'text-blue-600',
    hoverBorder: 'hover:border-blue-300 hover:shadow-blue-50',
    permissions: [
      "Driver will be able to check out the booking assigned to him",
      "Driver will be able to view the approved booking",
      "Driver will be able to view the assigned vehicle"
    ]
  }
];

const Roles = () => {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <Sidebar />
      </aside>
      <main className="flex-1 p-10 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Roles</h1>
          <p className="text-sm text-gray-500 mt-2">
            Configure, view, and inspect permissions assigned to each defined role in the FoxRide ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
          {roleData.map((role, index) => (
            <div 
              key={index} 
              className={`bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${role.hoverBorder}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl border ${role.accentClass}`}>
                    <role.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${role.badgeClass}`}>
                    {role.badge}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{role.title}</h2>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">{role.description}</p>
              </div>

              <div>
                <div className="border-t border-gray-100 pt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-3">Key Responsibilities</span>
                  <ul className="space-y-2">
                    {role.permissions.map((permission, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                        <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${role.iconColor}`} />
                        <span>{permission}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Roles;