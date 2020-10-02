import faker from 'faker';
import { User } from '../../users/user.model';

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
