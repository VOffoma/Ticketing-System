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

export interface UserInputDTO {
	firstName: string;
	lastName: string;
	password: string;
	email: string;
}

export interface UserCredentialsDTO {
	email: string;
	password: string;
}
