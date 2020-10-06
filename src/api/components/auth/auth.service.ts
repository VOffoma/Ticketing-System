import { CreateUserDto, UserCredentialsDto } from '../users/user.dto';
import { UserBase } from '../users/user.interface';
import { User } from '../users/user.model';

/**
 *
 * @param userDetails
 * @returns a new user object
 */
async function registerUser(userDetails: CreateUserDto): Promise<UserBase> {
	const createdUser = new User(userDetails);
	const registeredUser = await createdUser.save();
	return registeredUser;
}

/**
 *
 * @param userCredentials
 * @returns an object containing the jwt token, user's fullname and email
 */

async function authenticateUser(
	userCredentials: UserCredentialsDto
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
