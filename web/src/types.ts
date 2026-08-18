// types.ts
import type { ReactNode } from 'react';

export type Permission = 
    | 'view_reports'
    | 'view_interchat'
    | 'write_news'
    | 'manage_profiles'
    | 'manage_vehicles'
    | 'manage_charges';

export interface Role {
    job_grade: number;
    permissions: Permission[];
    is_boss: boolean;
}

export interface UserProfile {
    identifier: string;
    name: string;
    callsign: string;
    job_grade: number;
    mdt_active: boolean;
}

export interface PageProps {
    currentUser: UserProfile;
    children?: ReactNode;
}

export interface Officer {
    id: string; // this maps to identifier
    name: string;
    job_grade: number;
}

export interface WantedItem {
    id: number;
    title: string;
    description: string;
    priority: string;
    issuer: string;
    timestamp: number;
}

export interface BoloItem {
    id: number;
    title: string;
    details: string;
    status: string;
    timestamp: number;
}

export interface NewsItem {
    id: number;
    title: string;
    content: string;
    author: string;
    required_grade: number;
    timestamp: number;
}