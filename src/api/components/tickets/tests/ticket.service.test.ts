import db from '../../../../utils/db';
import dummyData from '../../../../utils/dummyData';
import { TicketStatus } from '../ticket.interface';
import ticketService from '../ticket.service';

beforeAll(async () => {
	await db.open();
});

afterAll(async () => {
	await db.close();
});

describe('TicketService', () => {
	describe('CreateTicket function', () => {
		it('should return an object containing the initial properties when valid input is given', async () => {
			const dummyUser = dummyData.createDummyUser();
			const savedUser = await dummyData.registerDummyUser(dummyUser);

			const dummyTicket = dummyData.createDummyTicket(savedUser._id);
			await dummyData.saveDummyTicket(dummyTicket);

			await expect(ticketService.createTicket(dummyTicket)).resolves.toMatchObject({
				content: dummyTicket.content,
				status: dummyTicket.status,
				title: dummyTicket.title
			});
		});

		it('should throw an error when an invalid input is given', async () => {
			const dummyUser = dummyData.createDummyUser();
			const savedUser = await dummyData.registerDummyUser(dummyUser);

			const dummyTicket = dummyData.createDummyTicket(savedUser._id);
			dummyTicket.author = '';

			await expect(ticketService.createTicket(dummyTicket)).rejects.toThrowError();
		});

		afterAll(async () => {
			await db.removeAllDocuments('tickets');
		});
	});

	describe('GetAllTickets function', () => {
		it('should return an array containing a single ticket object when there is just one ticket', async () => {
			const dummyUser = dummyData.createDummyUser();
			const savedUser = await dummyData.registerDummyUser(dummyUser);

			const dummyTicket = dummyData.createDummyTicket(savedUser._id);
			await dummyData.saveDummyTicket(dummyTicket);

			await expect(ticketService.getAllTickets(savedUser._id)).resolves.toHaveLength(1);
		});

		afterAll(async () => {
			await db.removeAllDocuments('tickets');
		});
	});

	describe('getTicketById function', () => {
		it('should return an object containing ticketInfo when given a valid ticketId', async () => {
			const dummyUser = dummyData.createDummyUser();
			const savedUser = await dummyData.registerDummyUser(dummyUser);

			const dummyTicket = dummyData.createDummyTicket(savedUser._id);
			const savedTicket = await dummyData.saveDummyTicket(dummyTicket);

			await expect(
				ticketService.getTicketById(savedTicket._id, {
					_id: savedUser._id,
					role: savedUser.role
				})
			).resolves.toMatchObject(dummyTicket);
		});

		it('should throw an error when the ticketId does not exist', async () => {
			const dummyUser = dummyData.createDummyUser();
			const savedUser = await dummyData.registerDummyUser(dummyUser);
			const ticketId = 'eieeieiiww';
			await expect(
				ticketService.getTicketById(ticketId, {
					_id: savedUser._id,
					role: savedUser.role
				})
			).rejects.toThrowError();
		});

		afterAll(async () => {
			await db.removeAllDocuments('tickets');
		});
	});

	// describe('updateTicketStatus function', () => {
	// 	it('should return an object containing the updated property when given a valid update object', async () => {
	// 		const dummyUser = dummyData.createDummyUser();
	// 		const savedUser = await dummyData.registerDummyUser(dummyUser);

	// 		const dummyTicket = dummyData.createDummyTicket(savedUser._id);
	// 		const savedTicket = await dummyData.saveDummyTicket(dummyTicket);

	// 		const ticketUpdate = {
	// 			Id: savedTicket._id,
	// 			updatedStatus: 'INPROGRESS'
	// 		};
	// 		await expect(ticketService.updateTicketStatus(ticketUpdate)).resolves.toHaveProperty(
	// 			'status',
	// 			'INPROGRESS'
	// 		);
	// 	});

	// 	it('should throw an error when the ticketId does not exist', async () => {
	// 		const dummyUser = dummyData.createDummyUser();
	// 		const savedUser = await dummyData.registerDummyUser(dummyUser);

	// 		const dummyTicket = dummyData.createDummyTicket(savedUser._id);
	// 		await dummyData.saveDummyTicket(dummyTicket);

	// 		const ticketUpdate = {
	// 			Id: 'ksjseiksks',
	// 			updatedStatus: 'INPROGRESS'
	// 		};
	// 		await expect(ticketService.updateTicketStatus(ticketUpdate)).rejects.toThrowError();
	// 	});

	// 	it('should throw an error when the status property receives an invalid value', async () => {
	// 		const dummyUser = dummyData.createDummyUser();
	// 		const savedUser = await dummyData.registerDummyUser(dummyUser);

	// 		const dummyTicket = dummyData.createDummyTicket(savedUser._id);
	// 		const savedTicket = await dummyData.saveDummyTicket(dummyTicket);

	// 		const ticketUpdate = {
	// 			Id: savedTicket._id,
	// 			updatedStatus: 'happy'
	// 		};
	// 		await expect(ticketService.updateTicketStatus(ticketUpdate)).rejects.toThrowError();
	// 	});

	// 	afterAll(async () => {
	// 		await db.removeAllDocuments('tickets');
	// 	});
	// });

	describe('generateTicketReport function', () => {
		it('should return an object containing csv', async () => {
			const dummyUser = dummyData.createDummyUser();
			const savedUser = await dummyData.registerDummyUser(dummyUser);

			const dummyTicket = dummyData.createDummyTicket(savedUser._id);
			const savedTicket = await dummyData.saveDummyTicket(dummyTicket);
			await savedTicket.updateOne({ status: TicketStatus.SOLVED });

			await expect(ticketService.generateTicketReport()).resolves.toHaveProperty('csvData');
		});

		afterAll(async () => {
			await db.removeAllDocuments('tickets');
		});
	});
});
