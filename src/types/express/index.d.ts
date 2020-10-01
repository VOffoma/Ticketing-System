import User from '../../api/components/users/user.model';

declare global {
	namespace Express {
		export interface Request {
			currentUser: User;
		}
	}
}
