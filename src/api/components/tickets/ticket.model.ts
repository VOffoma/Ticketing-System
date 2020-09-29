import * as mongoose from 'mongoose';
import { Ticket } from './ticket.interface';

const ticketSchema = new mongoose.Schema({
	author: {
		type: String,
		required: true
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
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const ticketModel = mongoose.model<Ticket>('Ticket', ticketSchema);

export default ticketModel;
