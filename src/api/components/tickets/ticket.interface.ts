import { Document, Types } from 'mongoose';
import Comment from '../comments/comment.interface';
import { UserBase } from '../users/user.interface';

export enum TicketStatus {
	OPEN = 'OPEN',
	INPROGRESS = 'INPROGRESS',
	CANCELLED = 'CANCELLED',
	SOLVED = 'SOLVED'
}

export interface Ticket extends Document {
	author: Types.ObjectId | UserBase;
	content: string;
	title: string;
	status: TicketStatus;
	supportPerson: Types.ObjectId | UserBase;
}

export interface TicketInputDTO {
	author: Ticket['author'];
	content: Ticket['content'];
	title: Ticket['title'];
}
