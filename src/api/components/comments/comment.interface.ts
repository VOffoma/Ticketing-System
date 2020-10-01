import { Document, Types } from 'mongoose';
import { UserBase } from '../users/user.interface';
import { Ticket } from '../tickets/ticket.interface';

export interface CommentBase extends Document {
	content: string;
	ticketId: Types.ObjectId | Ticket;
	commentAuthor: Types.ObjectId | UserBase;
}

export interface CommentInputDTO {
	comment: CommentBase['content'];
	ticketId: CommentBase['ticketId'];
	commentAuthor: CommentBase['commentAuthor'];
}
