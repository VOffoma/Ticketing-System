import { Joi } from 'express-validation';

const ticketCreation = {
	body: Joi.object({
		title: Joi.string().trim().required(),
		content: Joi.string().trim().required(),
		author: Joi.string().trim().required()
	})
};

const ticketId = {
	params: Joi.object({
		ticketId: Joi.string().trim().required()
	})
};

const ticketUpdate = {
	params: Joi.object({
		ticketId: Joi.string().trim().required()
	}),
	body: Joi.object({
		status: Joi.string().valid('OPEN', 'INPROGRESS', 'CANCELLED', 'SOLVED').required()
	})
};

// change groupcreation to a better name
export default {
	ticketId,
	ticketCreation,
	ticketUpdate
};
