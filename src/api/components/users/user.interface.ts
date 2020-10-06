import { Document } from 'mongoose';

export enum UserRole {
	USER = 'USER',
	SUPPORT = 'SUPPORT',
	ADMIN = 'ADMIN'
}

export interface UserBase extends Document {
	firstName: string;
	lastName: string;
	fullName: string;
	email: string;
	password: string;
	role: UserRole;
}
