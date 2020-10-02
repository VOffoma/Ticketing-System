import { Joi } from 'express-validation';

const userRegistrationInfo = {
	body: Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required(),
		firstName: Joi.string()
			.regex(/^[a-zA-Z ,.'-]+$/)
			.min(2)
			.required(),
		lastName: Joi.string()
			.regex(/^[a-zA-Z ,.'-]+$/)
			.min(2)
			.required()
	})
};

const userCredentials = {
	body: Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required()
	})
};

const ticketAssignment = {
	body: Joi.object({
		ticketId: Joi.string().trim().required(),
		supportPersonId: Joi.string().trim().required()
	})
};

const roleUpdate = {
	body: Joi.object({
		userId: Joi.string().trim().required(),
		newRole: Joi.string().valid('USER', 'SUPPORT', 'ADMIN').required()
	})
};

// change groupcreation to a better name
export default {
	ticketAssignment,
	roleUpdate,
	userCredentials,
	userRegistrationInfo
};
