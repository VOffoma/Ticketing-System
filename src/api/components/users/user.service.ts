import createError from 'http-errors';
import { User } from './user.model';
import { UserRole, UserBase } from './user.interface';

/**
 *
 * @param roleUpdate which contains userId and the future role
 * @returns an object containing the updated user information
 */
async function updateUserRole(roleUpdate: {
	newRole: string;
	userId: string;
}): Promise<UserBase | null> {
	const { newRole, userId } = roleUpdate;

	const user = await User.findById(userId);
	if (!user) {
		throw createError(404, `User with Id ${userId} does not exist`);
	}

	const role = newRole as UserRole;

	const updatedUser = await User.findByIdAndUpdate(
		{ _id: userId },
		{ role },
		{ new: true, runValidators: true }
	);

	return updatedUser;
}

export default {
	updateUserRole
};
