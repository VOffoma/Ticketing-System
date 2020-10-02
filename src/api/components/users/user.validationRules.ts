import { Joi } from 'express-validation';

const ticketAssignment = {
	params: Joi.object({
		ticketId: Joi.string().trim().required()
	}),
	body: Joi.object({
		status: Joi.string().valid('OPEN', 'INPROGRESS', 'CANCELLED', 'SOLVED').required()
	})
};

const roleUpdate = {
	params: Joi.object({
		ticketId: Joi.string().trim().required()
	}),
	body: Joi.object({
		status: Joi.string().valid('OPEN', 'INPROGRESS', 'CANCELLED', 'SOLVED').required()
	})
};

// change groupcreation to a better name
export default {
	ticketAssignment,
	roleUpdate
};
