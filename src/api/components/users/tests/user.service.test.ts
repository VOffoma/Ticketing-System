import { UserRole } from '../user.interface';
import userService from '../user.service';
import db from '../../../../utils/db';
import dummyData from '../../../../utils/dummyData';

beforeAll(async () => {
	await db.open();
});

afterAll(async () => {
	await db.close();
});

describe('UserService', () => {
	describe('updateUserRole function', () => {
		it('should return an object containing the updated property when given a valid update object', async () => {
			const dummyUser = dummyData.createDummyUser();
			const savedUser = await dummyData.registerDummyUser(dummyUser);

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
			const dummyUser = dummyData.createDummyUser();
			const savedUser = await dummyData.registerDummyUser(dummyUser);

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
});
