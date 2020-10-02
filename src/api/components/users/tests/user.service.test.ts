import userService from '../user.service';
import { UserRole } from '../user.interface';
import db from '../../../../utils/db';
import {
	createDummyTicket,
	saveDummyTicket,
	createDummyComment,
	saveDummyComment
} from '../../tickets/tests/dummyData';
import { TicketStatus } from '../../tickets/ticket.interface';
import { registerDummyUser, createDummyUser } from '../../auth/tests/dummyData';

beforeAll(async () => {
	await db.open();
});

afterAll(async () => {
	await db.close();
});

describe('UserService', () => {
	describe('updateUserRole function', () => {
		it('should return an object containing the updated property when given a valid update object', async () => {
			const dummyUser = createDummyUser();
			const savedUser = await registerDummyUser(dummyUser);

			const userUpdate = {
				userId: savedUser._id,
				newRole: UserRole.SUPPORT
			};
			await expect(userService.updateUserRole(userUpdate)).resolves.toHaveProperty(
				'role',
				'SUPPORT'
			);
		});

		it('should throw an error when the user does not exist', async () => {
			const userUpdate = {
				userId: 'eejsjs',
				newRole: UserRole.SUPPORT
			};
			await expect(userService.updateUserRole(userUpdate)).rejects.toThrowError();
		});

		it('should throw an error when the role property receives an invalid value', async () => {
			const dummyUser = createDummyUser();
			const savedUser = await registerDummyUser(dummyUser);

			const userUpdate = {
				userId: savedUser._id,
				newRole: 'happy'
			};
			await expect(userService.updateUserRole(userUpdate)).rejects.toThrowError();
		});

		afterAll(async () => {
			await db.removeAllDocuments('tickets');
		});
	});

	describe('assignTicketToSupport function', () => {
		it('should return an object containing the updated property when given a valid update object', async () => {
			const dummyUser = createDummyUser();
			const savedUser = await registerDummyUser(dummyUser);
			await savedUser.updateOne({ role: UserRole.SUPPORT });

			const dummyTicket = createDummyTicket(savedUser._id);
			const savedTicket = await saveDummyTicket(dummyTicket);

			const ticketAssignment = {
				ticketId: savedTicket._id,
				supportPersonId: savedUser._id
			};

			await expect(
				userService.assignTicketToSupport(ticketAssignment)
			).resolves.toHaveProperty('supportPerson', savedUser._id);
		});

		it('should throw an error when the ticketId does not exist', async () => {
			const dummyUser = createDummyUser();
			const savedUser = await registerDummyUser(dummyUser);
			await savedUser.updateOne({ role: UserRole.SUPPORT });

			const ticketAssignment = {
				ticketId: 'heiseueujs',
				supportPersonId: savedUser._id
			};
			await expect(
				userService.assignTicketToSupport(ticketAssignment)
			).rejects.toThrowError();
		});

		it('should throw an error when supportPersonId is invalid ', async () => {
			const dummyUser = createDummyUser();
			const savedUser = await registerDummyUser(dummyUser);

			const dummyTicket = createDummyTicket(savedUser._id);
			const savedTicket = await saveDummyTicket(dummyTicket);

			const ticketAssignment = {
				ticketId: savedTicket._id,
				supportPersonId: savedUser._id
			};
			await expect(
				userService.assignTicketToSupport(ticketAssignment)
			).rejects.toThrowError();
		});

		afterAll(async () => {
			await db.removeAllDocuments('tickets');
		});
	});
});
