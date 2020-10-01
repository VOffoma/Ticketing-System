import { Document, Types } from 'mongoose';
import { UserBase } from '../users/user.interface';
import { Ticket } from '../tickets/ticket.interface';

export default interface Comment extends Document {
	content: string;
	ticketId: Types.ObjectId | Ticket;
	commentAuthor: Types.ObjectId | UserBase;
}
