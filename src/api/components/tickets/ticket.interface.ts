import { Document, Types } from 'mongoose';

export enum TicketStatus {
	OPEN = 'OPEN',
	INPROGRESS = 'INPROGRESS',
	CANCELLED = 'CANCELLED',
	SOLVED = 'SOLVED'
}

export interface Ticket extends Document {
	author: Types.ObjectId;
	content: string;
	title: string;
	status: TicketStatus;
	supportPerson: Types.ObjectId;
}
