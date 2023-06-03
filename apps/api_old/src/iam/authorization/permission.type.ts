import { ReportsPermission } from '../../reports/reports.permission';

// all permissions from the application
export const Permission = {
  ...ReportsPermission,
};

export type PermissionType = ReportsPermission;
