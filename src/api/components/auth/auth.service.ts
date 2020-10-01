import { User } from '../users/user.model';
import { UserBase, UserInputDTO, UserCredentialsDTO } from '../users/user.interface';

async function registerUser(userDetails: UserInputDTO): Promise<UserBase> {
	const user = new User(userDetails);
	const newUser = await user.save();
	return newUser;
}

async function authenticateUser(
	userCredentials: UserCredentialsDTO
): Promise<{ fullName: string; email: string; token: string }> {
	const { email, password } = userCredentials;
	const user = await User.findByCredentials(email, password);

	const authenticationInfo = await user.getAuthenticationInfo();
	return authenticationInfo;
}

export default {
	registerUser,
	authenticateUser
};
