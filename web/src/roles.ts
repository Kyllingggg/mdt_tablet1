// roles.ts
import type { Role, Permission } from './types';

let rolesMap: Record<number, Role> = {};

export const setRoles = (roles: Role[]) => {
    rolesMap = {};
    roles.forEach(role => {
        rolesMap[role.job_grade] = role;
    });
};

export const hasPermission = (jobGrade: number, permission: Permission): boolean => {
    const role = rolesMap[jobGrade];
    if (!role) return false;
    if (role.is_boss) return true;
    try {
        // Parse permissions if they come as string from DB, otherwise use as array
        const perms: Permission[] = typeof role.permissions === 'string' ? JSON.parse(role.permissions) : role.permissions;
        return perms.includes(permission);
    } catch (e) {
        return false;
    }
};

export const getRoleName = (jobGrade: number): string => {
    // This is a basic mapping, you can expand this or fetch it from ESX grades
    const names: Record<number, string> = {
        10: 'Rigspolitichef',
        9: 'Politidirektør',
        8: 'Chefpolitiinspektør',
        7: 'Politiinspektør',
        6: 'Vicepolitiinspektør',
        5: 'Politikommissær',
        4: 'Politiassistent af 1. Grad',
        3: 'Politiassistent',
        2: 'Politibetjent',
        1: 'Politielev',
        0: 'Politikadet'
    };
    return names[jobGrade] || `Grade ${jobGrade}`;
};