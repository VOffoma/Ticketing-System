import ticketService from './ticket.service';
import db from '../../utils/db';

beforeAll(async () => {
	await db.open();
});

afterAll(async () => {
	await db.close();
});

afterEach(async () => {
	await db.removeAllDocuments('tickets');
});

describe('The TicketService', () => {
	describe('CreateTicket function', () => {
		it('should resolve with an object containing the initial properties', async () => {
			const ticketInfo = {
				author: 'Exinne',
				title: 'poor cake quality',
				content: 'too bad'
			};
			await expect(ticketService.createTicket(ticketInfo)).resolves.toMatchObject(ticketInfo);
		});

		it('should reject when an invalid input is sent', async () => {
			const ticketInfo = {
				author: '',
				title: 'poor cake quality',
				content: 'too bad'
			};
			await expect(ticketService.createTicket(ticketInfo)).rejects.toThrowError();
		});
	});

	describe('GetAllTickets function', () => {
		it('should resolve with an array containing a single ticket object', async () => {
			const ticketInfo = {
				author: 'Zinne',
				title: 'poor cake quality',
				content: 'too bad'
			};
			await ticketService.createTicket(ticketInfo);
			await expect(ticketService.getAllTickets()).resolves.toHaveLength(1);
		});
	});

	describe('getTicketById function', () => {
		it('should resolve with an object containing ticketInfo', async () => {
			const ticketInfo = {
				author: 'Zinne',
				title: 'poor cake quality',
				content: 'too bad'
			};
			const ticket = await ticketService.createTicket(ticketInfo);
			await expect(ticketService.getTicketById(ticket._id)).resolves.toMatchObject(
				ticketInfo
			);
		});

		it('should reject when the ticketId does not exist', async () => {
			const ticketId = 'eieeieiiww';
			await expect(ticketService.getTicketById(ticketId)).rejects.toThrowError();
		});
	});

	describe('updateTicketStatus function', () => {
		it('should resolve with an object containing the updated property', async () => {
			const ticketInfo = {
				author: 'Zinne',
				title: 'poor cake quality',
				content: 'too bad'
			};
			const ticket = await ticketService.createTicket(ticketInfo);
			const ticketUpdate = {
				Id: ticket._id,
				updatedStatus: 'INPROGRESS'
			};
			await expect(ticketService.updateTicketStatus(ticketUpdate)).resolves.toHaveProperty(
				'status',
				'INPROGRESS'
			);
		});

		it('should reject when the ticketId does not exist', async () => {
			const ticketUpdate = {
				Id: 'ksjseiksks',
				updatedStatus: 'InProgress'
			};
			await expect(ticketService.updateTicketStatus(ticketUpdate)).rejects.toThrowError();
		});

		it('should reject when the status property receives an invalid value', async () => {
			const ticketInfo = {
				author: 'Zinne',
				title: 'poor cake quality',
				content: 'too bad'
			};
			const ticket = await ticketService.createTicket(ticketInfo);
			const ticketUpdate = {
				Id: ticket._id,
				updatedStatus: 'happy'
			};
			await expect(ticketService.updateTicketStatus(ticketUpdate)).rejects.toThrowError();
		});
	});
});
