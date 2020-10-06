import { IsString } from 'class-validator';

export default class CreateCommentDto {
	@IsString()
	public content: string;
}
