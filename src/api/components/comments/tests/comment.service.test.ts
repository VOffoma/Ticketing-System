import commentService from '../comment.service';
import db from '../../../../utils/db';
import dummyData from '../../../../utils/dummyData';

beforeAll(async () => {
	await db.open();
});

afterAll(async () => {
	await db.close();
});

describe('CommentService', () => {
	describe('getAllCommentsOnaTicket function', () => {
		it('should return an array containing comments of a ticket when a valid ticketId is given', async () => {
			const dummyUser = dummyData.createDummyUser();
			const savedUser = await dummyData.registerDummyUser(dummyUser);

			const dummyTicket = dummyData.createDummyTicket(savedUser._id);
			const savedTicket = await dummyData.saveDummyTicket(dummyTicket);

			const dummyComment = dummyData.createDummyComment(savedUser._id, savedTicket._id);
			await dummyData.saveDummyComment(dummyComment);

			await expect(
				commentService.getAllCommentsOnATicket(savedTicket._id, {
					_id: savedUser._id,
					role: savedUser.role
				})
			).resolves.toHaveLength(1);
		});

		it('should throw an error when the ticketId does not exist', async () => {
			const dummyUser = dummyData.createDummyUser();
			const savedUser = await dummyData.registerDummyUser(dummyUser);

			const dummyTicket = dummyData.createDummyTicket(savedUser._id);
			const savedTicket = await dummyData.saveDummyTicket(dummyTicket);

			const dummyComment = dummyData.createDummyComment(savedUser._id, savedTicket._id);
			await dummyData.saveDummyComment(dummyComment);

			await expect(
				commentService.getAllCommentsOnATicket('jsjsjsheue', {
					_id: savedUser._id,
					role: savedUser.role
				})
			).rejects.toThrowError();
		});

		afterAll(async () => {
			await db.removeAllDocuments('tickets');
		});
	});

	describe('addCommentToTicket function', () => {
		it('should return an object containing the initial properties when valid input is given', async () => {
			const dummyUser = dummyData.createDummyUser();
			const savedUser = await dummyData.registerDummyUser(dummyUser);

			const dummyTicket = dummyData.createDummyTicket(savedUser._id);
			const savedTicket = await dummyData.saveDummyTicket(dummyTicket);

			const dummyComment = dummyData.createDummyComment(savedUser._id, savedTicket._id);
			await dummyData.saveDummyComment(dummyComment);

			await expect(
				commentService.addCommentToTicket(dummyComment, {
					_id: savedUser._id,
					role: savedUser.role
				})
			).resolves.toMatchObject(dummyComment);
		});

		it('should throw an error when an invalid input is given', async () => {
			const dummyUser = dummyData.createDummyUser();
			const savedUser = await dummyData.registerDummyUser(dummyUser);

			const dummyTicket = dummyData.createDummyTicket(savedUser._id);
			await dummyData.saveDummyTicket(dummyTicket);

			const dummyComment = {
				commentAuthor: '',
				ticketId: '',
				content: ''
			};

			await expect(
				commentService.addCommentToTicket(dummyComment, {
					_id: savedUser._id,
					role: savedUser.role
				})
			).rejects.toThrowError();
		});

		afterAll(async () => {
			await db.removeAllDocuments('tickets');
		});
	});
});
