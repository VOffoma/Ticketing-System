import faker from 'faker';
import { User } from '../../users/user.model';

type SavedDummyUser = { email: string; role: string; firstName: string; lastName };
type DummyUser = { email: string; password: string; firstName: string; lastName };

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

export async function registerDummyUser(dummyUser: DummyUser): Promise<SavedDummyUser> {
	const user = createDummyUser();
	const dbUser = new User(user);
	const savedUser = await dbUser.save();
	return savedUser;
}
