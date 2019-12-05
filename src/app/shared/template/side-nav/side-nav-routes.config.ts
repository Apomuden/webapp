import { SideNavInterface } from "../../interfaces/side-nav.type";
export const ROUTES: SideNavInterface[] = [
  {
    path: "",
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
    path: "",
    title: "User Management",
    iconType: "nzIcon",
    iconTheme: "outline",
    icon: "appstore",
    submenu: [
      {
        path: "",
        title: "Create User",
        iconType: "",
        icon: "",
        iconTheme: "",
        submenu: []
      },
      {
        path: "",
        title: "View Users",
        iconType: "",
        icon: "",
        iconTheme: "",
        submenu: []
      },
      {
        path: "",
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
  }
];
