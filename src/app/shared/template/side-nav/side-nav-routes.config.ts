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
    title: 'Records Management',
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
        path: '/records/patients',
        title: 'Patients',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      },
      {
        path: '/records/sponsorship-permit',
        title: 'Sponsorship Permit',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      },
      {
        path: '/records/request-consultation',
        title: 'Request Consultation',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      },
      {
        path: '/records/appointments',
        title: 'Appointments',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      },
      {
        path: '/records/walkin-registration',
        title: 'Walk-in Registration',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      }
      ,
      {
        path: '/records/records-report',
        title: 'Reports',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      }
    ]
  },
  {
    path: '/opd',
    title: 'OPD Management',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'folder-open',
    submenu: [
      {
        path: '/opd/vitals',
        title: 'Vitals',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      }
    ]
  },
  {
    path: '/physician',
    title: 'Physician Management',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'plus-circle',
    submenu: [
      {
        path: '/physician/consultation',
        title: 'Consultation',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      },
      {
        path: '/physician/ivf-consultation',
        title: 'IVF Consultation',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      },
    ]
  },
  {
    path: '/lab-management',
    title: 'Laboratory Management',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'pushpin',
    submenu: [
      {
        path: '/lab-management/laboratory',
        title: 'Laboratory',
        iconType: '',
        iconTheme: '',
        icon: '',
        submenu: []
      }
    ]
  },
  {

    path: '/accounts',
    title: 'Accounts Management',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'money-collect',
    submenu: [
      {
        path: '/accounts/receipt',
        title: 'Payment',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      },
      {
        path: '/accounts/deposit',
        title: 'Deposit',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      },
      {
        path: '/accounts/discount',
        title: 'Discount',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      },
    ]
  },
  {
    path: '/stores-management',
    title: 'Stores Management',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'medicine-box',
    submenu: [
      {
        path: '/stores-management/stock-adjustment',
        title: 'Stock Adjustment',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      },
      {
        path: '/stores-management/stock-adjustment-approval/search',
        title: 'Stock Adjustment Search',
        iconType: '',
        icon: '',
        iconTheme: '',
        submenu: []
      }
    ]
  }
];
