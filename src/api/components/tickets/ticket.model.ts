import { Schema, Model, model } from 'mongoose';
import { Ticket } from './ticket.interface';

const ticketSchema = new Schema(
	{
		author: {
			ref: 'User',
			type: Schema.Types.ObjectId,
			immutable: true
		},
		content: {
			type: String,
			required: 'Please enter a ticket content',
			immutable: true
		},
		title: {
			type: String,
			required: 'Please enter a ticket title',
			immutable: true
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

ticketSchema.post('save', async function (doc, next) {
	await doc.populate('author').execPopulate();
	next();
});

ticketSchema.post('findById', async function (doc, next) {
	await doc
		.populate('author')
		.populate('supportPerson', 'firstName lastName -_id')
		.execPopulate();
	next();
});

const ticketModel = model<Ticket>('Ticket', ticketSchema);

export default ticketModel;
