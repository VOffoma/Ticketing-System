import ticketService from '../ticket.service';
import db from '../../../../utils/db';
import {
	createDummyTicket,
	saveDummyTicket,
	createDummyComment,
	saveDummyComment
} from './dummyData';
import { registerDummyUser, createDummyUser } from '../../auth/tests/dummyData';
import { TicketStatus } from '../ticket.interface';

beforeAll(async () => {
	await db.open();
});

afterAll(async () => {
	await db.close();
});

describe('TicketService', () => {
	describe('CreateTicket function', () => {
		it('should return an object containing the initial properties when valid input is given', async () => {
			const dummyUser = createDummyUser();
			const savedUser = await registerDummyUser(dummyUser);

			const dummyTicket = createDummyTicket(savedUser._id);
			await saveDummyTicket(dummyTicket);

			await expect(ticketService.createTicket(dummyTicket)).resolves.toMatchObject({
				content: dummyTicket.content,
				status: dummyTicket.status,
				title: dummyTicket.title
			});
		});

		it('should throw an error when an invalid input is given', async () => {
			const dummyUser = createDummyUser();
			const savedUser = await registerDummyUser(dummyUser);

			const dummyTicket = createDummyTicket(savedUser._id);
			dummyTicket.author = '';

			await expect(ticketService.createTicket(dummyTicket)).rejects.toThrowError();
		});

		afterAll(async () => {
			await db.removeAllDocuments('tickets');
		});
	});

	describe('GetAllTickets function', () => {
		it('should return an array containing a single ticket object when there is just one ticket', async () => {
			const dummyUser = createDummyUser();
			const savedUser = await registerDummyUser(dummyUser);

			const dummyTicket = createDummyTicket(savedUser._id);
			await saveDummyTicket(dummyTicket);

			await expect(
				ticketService.getAllTickets(savedUser._id, savedUser.role)
			).resolves.toHaveLength(1);
		});

		afterAll(async () => {
			await db.removeAllDocuments('tickets');
		});
	});

	describe('getTicketById function', () => {
		it('should return an object containing ticketInfo when given a valid ticketId', async () => {
			const dummyUser = createDummyUser();
			const savedUser = await registerDummyUser(dummyUser);

			const dummyTicket = createDummyTicket(savedUser._id);
			const savedTicket = await saveDummyTicket(dummyTicket);

			await expect(ticketService.getTicketById(savedTicket._id)).resolves.toMatchObject(
				dummyTicket
			);
		});

		it('should throw an error when the ticketId does not exist', async () => {
			const ticketId = 'eieeieiiww';
			await expect(ticketService.getTicketById(ticketId)).rejects.toThrowError();
		});

		afterAll(async () => {
			await db.removeAllDocuments('tickets');
		});
	});

	describe('updateTicketStatus function', () => {
		it('should return an object containing the updated property when given a valid update object', async () => {
			const dummyUser = createDummyUser();
			const savedUser = await registerDummyUser(dummyUser);

			const dummyTicket = createDummyTicket(savedUser._id);
			const savedTicket = await saveDummyTicket(dummyTicket);

			const ticketUpdate = {
				Id: savedTicket._id,
				updatedStatus: 'INPROGRESS'
			};
			await expect(ticketService.updateTicketStatus(ticketUpdate)).resolves.toHaveProperty(
				'status',
				'INPROGRESS'
			);
		});

		it('should throw an error when the ticketId does not exist', async () => {
			const dummyUser = createDummyUser();
			const savedUser = await registerDummyUser(dummyUser);

			const dummyTicket = createDummyTicket(savedUser._id);
			await saveDummyTicket(dummyTicket);

			const ticketUpdate = {
				Id: 'ksjseiksks',
				updatedStatus: 'INPROGRESS'
			};
			await expect(ticketService.updateTicketStatus(ticketUpdate)).rejects.toThrowError();
		});

		it('should throw an error when the status property receives an invalid value', async () => {
			const dummyUser = createDummyUser();
			const savedUser = await registerDummyUser(dummyUser);

			const dummyTicket = createDummyTicket(savedUser._id);
			const savedTicket = await saveDummyTicket(dummyTicket);

			const ticketUpdate = {
				Id: savedTicket._id,
				updatedStatus: 'happy'
			};
			await expect(ticketService.updateTicketStatus(ticketUpdate)).rejects.toThrowError();
		});

		afterAll(async () => {
			await db.removeAllDocuments('tickets');
		});
	});

	describe('getAllCommentsOnaTicket function', () => {
		it('should return an array containing comments of a ticket when a valid ticketId is given', async () => {
			const dummyUser = createDummyUser();
			const savedUser = await registerDummyUser(dummyUser);

			const dummyTicket = createDummyTicket(savedUser._id);
			const savedTicket = await saveDummyTicket(dummyTicket);

			const dummyComment = createDummyComment(savedUser._id, savedTicket._id);
			await saveDummyComment(dummyComment);

			await expect(
				ticketService.getAllCommentsOnATicket(savedTicket._id)
			).resolves.toHaveLength(1);
		});

		it('should throw an error when the ticketId does not exist', async () => {
			const dummyUser = createDummyUser();
			const savedUser = await registerDummyUser(dummyUser);

			const dummyTicket = createDummyTicket(savedUser._id);
			const savedTicket = await saveDummyTicket(dummyTicket);

			const dummyComment = createDummyComment(savedUser._id, savedTicket._id);
			await saveDummyComment(dummyComment);

			await expect(
				ticketService.getAllCommentsOnATicket('jsjsjsheue')
			).rejects.toThrowError();
		});

		afterAll(async () => {
			await db.removeAllDocuments('tickets');
		});
	});

	describe('addCommentToTicket function', () => {
		it('should return an object containing the initial properties when valid input is given', async () => {
			const dummyUser = createDummyUser();
			const savedUser = await registerDummyUser(dummyUser);

			const dummyTicket = createDummyTicket(savedUser._id);
			const savedTicket = await saveDummyTicket(dummyTicket);

			const dummyComment = createDummyComment(savedUser._id, savedTicket._id);
			await saveDummyComment(dummyComment);

			await expect(ticketService.addCommentToTicket(dummyComment)).resolves.toMatchObject(
				dummyComment
			);
		});

		it('should throw an error when an invalid input is given', async () => {
			const dummyUser = createDummyUser();
			const savedUser = await registerDummyUser(dummyUser);

			const dummyTicket = createDummyTicket(savedUser._id);
			await saveDummyTicket(dummyTicket);

			const dummyComment = {
				commentAuthor: '',
				ticketId: '',
				content: ''
			};

			await expect(ticketService.addCommentToTicket(dummyComment)).rejects.toThrowError();
		});

		afterAll(async () => {
			await db.removeAllDocuments('tickets');
		});
	});

	describe('generateTicketReport function', () => {
		it('should return an object containing csv', async () => {
			const dummyUser = createDummyUser();
			const savedUser = await registerDummyUser(dummyUser);

			const dummyTicket = createDummyTicket(savedUser._id);
			const savedTicket = await saveDummyTicket(dummyTicket);
			await savedTicket.updateOne({ status: TicketStatus.SOLVED });

			await expect(ticketService.generateTicketReport()).resolves.toHaveProperty('csvData');
		});

		afterAll(async () => {
			await db.removeAllDocuments('tickets');
		});
	});
});
