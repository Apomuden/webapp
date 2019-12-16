import { SideNavInterface } from "../../interfaces/side-nav.type";
export const ROUTES: SideNavInterface[] = [
  {
    path: "/dashboard/default",
    title: "Dashboard",
    iconType: "nzIcon",
    iconTheme: "outline",
    icon: "dashboard",
    submenu: []
  },
  {
    path: "",
    title: "Records",
    iconType: "nzIcon",
    iconTheme: "outline",
    icon: "appstore",
    submenu: [
      {
        path: "",
        title: "New Patient Registration",
        iconType: "",
        icon: "",
        iconTheme: "",
        submenu: []
      },
      {
        path: "",
        title: "Search Patient Information",
        iconType: "",
        icon: "",
        iconTheme: "",
        submenu: []
      },
      {
        path: "",
        title: "Request Consultation",
        iconType: "",
        icon: "",
        iconTheme: "",
        submenu: []
      },
      {
        path: "",
        title: "Appointments",
        iconType: "",
        icon: "",
        iconTheme: "",
        submenu: []
      },
      {
        path: "",
        title: "Walk-in Registration",
        iconType: "",
        icon: "",
        iconTheme: "",
        submenu: []
      }
    ]
  },
  {
    path: "/user-management",
    title: "User Management",
    iconType: "nzIcon",
    iconTheme: "outline",
    icon: "appstore",
    submenu: [
      {
        path: "/user-management/create-user",
        title: "Create User",
        iconType: "",
        icon: "",
        iconTheme: "",
        submenu: []
      },
      {
        path: "/user-management",
        title: "View Users",
        iconType: "",
        icon: "",
        iconTheme: "",
        submenu: []
      },
      {
        path: "/user-management/roles",
        title: "Roles",
        iconType: "",
        icon: "",
        iconTheme: "",
        submenu: []
      }
    ]
  },
  {
    path: "",
    title: "Settings",
    iconType: "nzIcon",
    iconTheme: "outline",
    icon: "setting",
    submenu: []
  },
  {
    path:"/setup",
    title:"Setup",
    iconType: "nzIcon",
    iconTheme: "outline",
    icon: "setting",
    submenu: []
  }
];
