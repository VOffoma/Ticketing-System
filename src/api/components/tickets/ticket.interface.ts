import { Document } from 'mongoose';

export enum TicketStatus {
	OPEN = 'OPEN',
	INPROGRESS = 'INPROGRESS',
	CANCELLED = 'CANCELLED',
	SOLVED = 'SOLVED'
}
export interface TicketInfo {
	author: string;
	content: string;
	title: string;
}
export interface Ticket extends Document {
	author: string;
	content: string;
	title: string;
	status: TicketStatus;
}
