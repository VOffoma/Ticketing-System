import faker from 'faker';
import { Comment } from '../api/components/comments/comment.model';
import TicketModel from '../api/components/tickets/ticket.model';
import { TicketStatus } from '../api/components/tickets/ticket.interface';
import { User } from '../api/components/users/user.model';

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

export function createDummyUser() {
	return {
		email: faker.internet.email(),
		password: faker.internet.password(),
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName()
	};
}

export function createDummyCredentials() {
	return {
		email: faker.internet.email(),
		password: faker.internet.password()
	};
}

export async function registerDummyUser(dummyUser) {
	const dbUser = new User(dummyUser);
	const savedUser = await dbUser.save();
	return savedUser;
}

export default {
	registerDummyUser,
	createDummyUser,
	createDummyComment,
	createDummyCredentials,
	createDummyTicket,
	saveDummyComment,
	saveDummyTicket
};
