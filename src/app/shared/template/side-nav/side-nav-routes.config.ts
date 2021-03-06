import { SideNavInterface } from '../../interfaces/side-nav.type';
export const ROUTES: SideNavInterface[] = [
  {
    path: '/dashboard/default',
    title: 'Dashboard',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'dashboard',
    submenu: []
  },
  {
    path: '/facility-management',
    title: 'Facility Management',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'home',
    submenu: []
  },
  {
    path: '/setup',
    title: 'System Configurations',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'setting',
    submenu: []
  },
  {
    path: '/user-management',
    title: 'User Management',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'team',
    submenu: [
      {
        path: '/user-management/create-user',
        title: 'Create User',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      },
      {
        path: '/user-management',
        title: 'View Users',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      },
      {
        path: '/user-management/roles',
        title: 'Roles',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      },
      {
        path: '/user-management/permissions',
        title: 'Permissions',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      },
      {
        path: '/user-management/modules',
        title: 'Modules',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      },
      {
        path: '/user-management/components',
        title: 'Components',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      }
    ]
  },
  {
    path: '/records',
    title: 'Records',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'book',
    submenu: [
      {
        path: '/records/folders/all',
        title: 'Folders',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      },
      {
        path: '/records/register-patient',
        title: 'Patients',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      },
      {
        path: '/records/search-patient',
        title: 'Search Patient Information',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      },
      {
        path: '',
        title: 'Request Consultation',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      },
      {
        path: '',
        title: 'Appointments',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      },
      {
        path: '',
        title: 'Walk-in Registration',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      }
    ]
  }
  // ,
  // {
  //   path: "",
  //   title: "Settings",
  //   iconType: "nzIcon",
  //   iconTheme: "outline",
  //   icon: "setting",
  //   submenu: []
  // }
];
