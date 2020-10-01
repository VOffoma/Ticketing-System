import { Schema, Model, model } from 'mongoose';
import Comment from './comment.interface';

const commentSchema = new Schema(
	{
		commentAuthor: {
			ref: 'User',
			type: Schema.Types.ObjectId
		},
		content: {
			type: String,
			required: [true, 'Please provide comment']
		},
		ticketId: {
			ref: 'Ticket',
			type: Schema.Types.ObjectId
		}
	},
	{
		timestamps: true
	}
);

const commentModel = model<Comment>('Comment', commentSchema);

export default commentModel;
