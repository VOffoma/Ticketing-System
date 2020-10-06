import { IsString, IsEmail, Min, IsEnum, Matches } from 'class-validator';
import { UserRole } from './user.interface';

export class CreateUserDto {
	@IsEmail()
	public email: string;

	@IsString()
	@Min(6)
	public password: string;

	@IsString()
	@Matches(/^[a-zA-Z ,.'-]+$/)
	@Min(2)
	public firstName: string;

	@IsString()
	@Matches(/^[a-zA-Z ,.'-]+$/)
	@Min(2)
	public lastName: string;
}

export class UserCredentialsDto {
	@IsEmail()
	public email: string;

	@IsString()
	@Min(6)
	public password: string;
}

export class RoleUpdateDto {
	@IsEnum(UserRole)
	public newRole: string;
}
