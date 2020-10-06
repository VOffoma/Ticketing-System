import { TicketStatus } from './ticket.interface';
import { IsString, IsEnum } from 'class-validator';

export class CreateTicketDto {
	@IsString()
	public title: string;

	@IsString()
	public content: string;
}

export class UpdateTicketDto {
	@IsEnum(TicketStatus)
	public status?: string;

	@IsString()
	public supportPersonId?: string;
}
