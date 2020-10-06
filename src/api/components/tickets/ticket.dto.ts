import { TicketStatus } from './ticket.interface';
import { IsString, IsEnum, MinLength } from 'class-validator';

export class CreateTicketDto {
	@IsString()
	@MinLength(10)
	public title: string;

	@IsString()
	@MinLength(10)
	public content: string;
}

export class UpdateTicketDto {
	@IsEnum(TicketStatus)
	public status?: string;

	@IsString()
	public supportPersonId?: string;
}
