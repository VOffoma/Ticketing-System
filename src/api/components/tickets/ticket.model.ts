import { Schema, Model, model } from 'mongoose';
import { Ticket } from './ticket.interface';

const ticketSchema = new Schema(
	{
		author: {
			ref: 'User',
			type: Schema.Types.ObjectId
		},
		content: {
			type: String,
			required: 'Please enter a ticket content'
		},
		title: {
			type: String,
			required: 'Please enter a ticket title'
		},
		status: {
			type: String,
			enum: ['OPEN', 'INPROGRESS', 'CANCELLED', 'SOLVED'],
			default: 'OPEN',
			required: true
		},
		supportPerson: {
			ref: 'User',
			type: Schema.Types.ObjectId
		}
	},
	{ timestamps: true }
);

const ticketModel = model<Ticket>('Ticket', ticketSchema);

export default ticketModel;
