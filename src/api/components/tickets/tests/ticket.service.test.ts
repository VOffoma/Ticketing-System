import ticketService from '../ticket.service';
import db from '../../../utils/db';

// beforeAll(async () => {
// 	await db.open();
// });

// afterAll(async () => {
// 	await db.close();
// });

// describe.skip('TicketService', () => {
// 	describe('CreateTicket function', () => {
// 		it('should return an object containing the initial properties when valid input is given', async () => {
// 			const ticketInfo = {
// 				author: 'Exinne',
// 				title: 'poor cake quality',
// 				content: 'too bad'
// 			};
// 			await expect(ticketService.createTicket(ticketInfo)).resolves.toMatchObject(ticketInfo);
// 		});

// 		it('should throw an error when an invalid input is given', async () => {
// 			const ticketInfo = {
// 				author: '',
// 				title: 'poor cake quality',
// 				content: 'too bad'
// 			};
// 			await expect(ticketService.createTicket(ticketInfo)).rejects.toThrowError();
// 		});

// 		afterAll(async () => {
// 			await db.removeAllDocuments('tickets');
// 		});
// 	});

// 	describe('GetAllTickets function', () => {
// 		beforeAll(async () => {
// 			const ticketInfo = {
// 				author: 'Zinne',
// 				title: 'poor cake quality',
// 				content: 'too bad'
// 			};
// 			const ticket = await ticketService.createTicket(ticketInfo);
// 		});

// 		it('should return an array containing a single ticket object when there is just one ticket', async () => {
// 			await expect(ticketService.getAllTickets()).resolves.toHaveLength(1);
// 		});

// 		afterAll(async () => {
// 			await db.removeAllDocuments('tickets');
// 		});
// 	});

// 	describe('getTicketById function', () => {
// 		let ticketId, ticketInfo;
// 		beforeAll(async () => {
// 			ticketInfo = {
// 				author: 'Zinne',
// 				title: 'poor cake quality',
// 				content: 'too bad'
// 			};
// 			const ticket = await ticketService.createTicket(ticketInfo);
// 			ticketId = ticket._id;
// 		});

// 		it('should return an object containing ticketInfo when given a valid ticketId', async () => {
// 			await expect(ticketService.getTicketById(ticketId)).resolves.toMatchObject(ticketInfo);
// 		});

// 		it('should throw an error when the ticketId does not exist', async () => {
// 			const ticketId = 'eieeieiiww';
// 			await expect(ticketService.getTicketById(ticketId)).rejects.toThrowError();
// 		});

// 		afterAll(async () => {
// 			await db.removeAllDocuments('tickets');
// 		});
// 	});

// 	describe('updateTicketStatus function', () => {
// 		let ticketId;
// 		beforeAll(async () => {
// 			const ticketInfo = {
// 				author: 'Zinne',
// 				title: 'poor cake quality',
// 				content: 'too bad'
// 			};
// 			const ticket = await ticketService.createTicket(ticketInfo);
// 			ticketId = ticket._id;
// 		});

// 		it('should return an object containing the updated property when given a valid update object', async () => {
// 			const ticketUpdate = {
// 				Id: ticketId,
// 				updatedStatus: 'INPROGRESS'
// 			};
// 			await expect(ticketService.updateTicketStatus(ticketUpdate)).resolves.toHaveProperty(
// 				'status',
// 				'INPROGRESS'
// 			);
// 		});

// 		it('should throw an error when the ticketId does not exist', async () => {
// 			const ticketUpdate = {
// 				Id: 'ksjseiksks',
// 				updatedStatus: 'INPROGRESS'
// 			};
// 			await expect(ticketService.updateTicketStatus(ticketUpdate)).rejects.toThrowError();
// 		});

// 		it('should throw an error when the status property receives an invalid value', async () => {
// 			const ticketUpdate = {
// 				Id: ticketId,
// 				updatedStatus: 'happy'
// 			};
// 			await expect(ticketService.updateTicketStatus(ticketUpdate)).rejects.toThrowError();
// 		});

// 		afterAll(async () => {
// 			await db.removeAllDocuments('tickets');
// 		});
// 	});
// });
