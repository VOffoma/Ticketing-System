import faker from 'faker';
import TicketModel from '../ticket.model';
import { TicketStatus } from '../ticket.interface';
import { Comment } from '../../comments/comment.model';
import { Types } from 'mongoose';

export function createDummyTicket(authorId) {
	return {
		content: faker.lorem.paragraph(),
		title: faker.lorem.sentence(),
		status: TicketStatus.OPEN,
		author: authorId
	};
}

export async function saveDummyTicket(dummyTicket) {
	const dbTicket = new TicketModel(dummyTicket);
	const savedTicket = await dbTicket.save();
	return savedTicket;
}

export function createDummyComment(userId, ticketId) {
	return {
		content: faker.lorem.paragraph(),
		commentAuthor: userId,
		ticketId
	};
}

export async function saveDummyComment(dummyComment) {
	const dbComment = new Comment(dummyComment);
	const savedComent = await dbComment.save();
	return savedComent;
}
