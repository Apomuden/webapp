import { Routes } from "@angular/router";

export const CommonLayout_ROUTES: Routes = [
  {
    path: "dashboard",
    loadChildren: () =>
      import("../../dashboard/dashboard.module").then(m => m.DashboardModule)
  },
  {
    path: "user-management",
    loadChildren: () =>
      import("../../user-management/user-management.module").then(
        m => m.UserManagementModule
      )
  }
];
