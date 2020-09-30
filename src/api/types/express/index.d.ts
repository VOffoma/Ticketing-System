import User from '../../components/users/user.model';
// import { Request } from 'express';

declare global {
	namespace Express {
		export interface Request {
			currentUser: User;
		}
	}
}
