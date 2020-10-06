import authService from '../auth.service';
import db from '../../../../utils/db';
import dummyData from '../../../../utils/dummyData';

beforeAll(async () => {
	await db.open();
});

afterAll(async () => {
	await db.removeAllDocuments('users');
	await db.close();
});

describe('AuthService', () => {
	describe('authenticateUser', () => {
		it('should return JWT token to a valid login credentials', async () => {
			const dummyUser = dummyData.createDummyUser();
			const dummyCredentials = { email: dummyUser.email, password: dummyUser.password };
			await dummyData.registerDummyUser(dummyUser);

			await expect(authService.authenticateUser(dummyCredentials)).resolves.toHaveProperty(
				'token'
			);
		});

		it('should reject with error if login does not exist', async () => {
			const dummyCredentials = dummyData.createDummyCredentials();

			await expect(authService.authenticateUser(dummyCredentials)).rejects.toThrowError();
		});

		it('should reject with error if password is wrong', async () => {
			const dummyUser = await dummyData.createDummyUser();
			const dummyCredentials = { email: dummyUser.email, password: 'lelsiejsmi' };
			await dummyData.registerDummyUser(dummyUser);

			await expect(authService.authenticateUser(dummyCredentials)).rejects.toThrowError();
		});
	});

	describe('registerUser function', () => {
		it('should resolve with an object containing the initial properties when valid input is given', async () => {
			const dummyUser = await dummyData.createDummyUser();

			await expect(authService.registerUser(dummyUser)).resolves.toMatchObject({
				firstName: dummyUser.firstName,
				lastName: dummyUser.lastName,
				email: dummyUser.email
			});
		});

		it('should resolves with false & valid error if duplicate', async () => {
			const dummyUser = await dummyData.createDummyUser();

			await authService.registerUser(dummyUser);

			await expect(authService.registerUser(dummyUser)).rejects.toThrowError();
		});

		it('should reject if invalid input', async () => {
			const dummyUser = await dummyData.createDummyUser();
			dummyUser.email = 'invalid.co';

			await expect(authService.registerUser(dummyUser)).rejects.toThrowError(
				'validation failed'
			);
		});
	});
});
