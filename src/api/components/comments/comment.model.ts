import { Schema, Model, model, Types } from 'mongoose';
import createError from 'http-errors';
import { CommentBase, CommentInputDTO } from './comment.interface';
import errorMessages from '../../../utils/errorMessages';

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
		timestamps: true,
		toJSON: {
			virtuals: true,
			getters: true
		}
	}
);

commentSchema.set('toJSON', {
	transform: function (doc, ret, options) {
		delete ret._id;
		delete ret.createdAt;
		delete ret.password;
	}
});

commentSchema.statics.saveComment = async function (
	ticketAuthor,
	commentInput
): Promise<CommentDocument> {
	const { ticketId } = commentInput;
	const comment = await this.findOne({ ticketId });

	// Here we are trying to ensure that a customer can only comment on a ticket
	//if and only if a support agent has commented on the ticket.
	// We do this by checking that the first comment to be added to the ticket is not from the ticket's author
	if (!comment && ticketAuthor.equals(commentInput.commentAuthor)) {
		throw new createError.Locked(errorMessages.MESSAGE_WAIT_FOR_SUPPORT_RESPONSE);
	}
	const savedComment = await new Comment(commentInput).save();
	return savedComment;
};

commentSchema.post('save', async function (doc, next) {
	await doc.populate('commentAuthor', 'firstName lastName -_id').execPopulate();
	next();
});

commentSchema.pre('find', function () {
	this.populate('commentAuthor', 'firstName lastName -_id');
});

export interface CommentDocument extends CommentBase {}

export interface CommentModel extends Model<CommentDocument> {
	saveComment(
		ticketAuthor: Types.ObjectId,
		commentInput: CommentInputDTO
	): Promise<CommentDocument>;
}

export const Comment: CommentModel = model<CommentDocument, CommentModel>('Comment', commentSchema);
