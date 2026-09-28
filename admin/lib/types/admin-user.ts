export interface AdminUserListItem {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  role: { id: string; name: string };
  createdAt: string;
}

export interface CreateAdminUserInput {
  name: string;
  email: string;
  password: string;
  roleId: string;
}

export interface Permission {
  id: string;
  key: string;
}

export interface RolePermissionLink {
  permission: Permission;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: RolePermissionLink[];
}

export interface CreateRoleInput {
  name: string;
  description?: string;
  permissionKeys: string[];
}
