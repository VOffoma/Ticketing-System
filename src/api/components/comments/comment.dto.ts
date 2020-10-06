import { IsString, MinLength } from 'class-validator';

export default class CreateCommentDto {
	@IsString()
	@MinLength(2)
	public content: string;
}
