import { registerDummyUser, createDummyUser, createDummyCredentials } from './dummyData';
import authService from '../auth.service';
import db from '../../../../utils/db';

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
			const dummyUser = createDummyUser();
			const dummyCredentials = { email: dummyUser.email, password: dummyUser.password };
			await registerDummyUser(dummyUser);

			await expect(authService.authenticateUser(dummyCredentials)).resolves.toHaveProperty(
				'token'
			);
		});

		it('should reject with error if login does not exist', async () => {
			const dummyCredentials = createDummyCredentials();

			await expect(authService.authenticateUser(dummyCredentials)).rejects.toThrowError();
		});

		it('should reject with error if password is wrong', async () => {
			const dummyUser = await createDummyUser();
			const dummyCredentials = { email: dummyUser.email, password: 'lelsiejsmi' };
			await registerDummyUser(dummyUser);

			await expect(authService.authenticateUser(dummyCredentials)).rejects.toThrowError();
		});
	});

	describe('registerUser function', () => {
		it('should resolve with an object containing the initial properties when valid input is given', async () => {
			const dummyUser = await createDummyUser();

			await expect(authService.registerUser(dummyUser)).resolves.toMatchObject({
				firstName: dummyUser.firstName,
				lastName: dummyUser.lastName,
				email: dummyUser.email
			});
		});

		it('should resolves with false & valid error if duplicate', async () => {
			const dummyUser = await createDummyUser();

			await authService.registerUser(dummyUser);

			await expect(authService.registerUser(dummyUser)).rejects.toThrowError();
		});

		it('should reject if invalid input', async () => {
			const dummyUser = await createDummyUser();
			dummyUser.email = 'invalid.co';

			await expect(authService.registerUser(dummyUser)).rejects.toThrowError(
				'validation failed'
			);
		});
	});
});
