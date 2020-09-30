import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Schema, Model, model } from 'mongoose';
import config from '../../../config';
import UserInfo from './user.interface';

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: [true, 'Please provide email'],
			match: [/\S+@\S+\.\S+/, 'An example of a valid email is abc@def.com']
		},
		firstName: {
			type: String,
			required: [true, 'Please provide firstname'],
			match: [
				/^[a-zA-Z(-)*]+$/,
				'A valid username is made of letters and the special character -'
			],
			minlength: [2, 'Your firstname should be atleast 2 characters']
		},
		lastName: {
			type: String,
			required: [true, 'Please provide lastname'],
			match: [
				/^[a-zA-Z(-)*]+$/,
				'A valid lastname is made of letters and the special character -'
			],
			minlength: [2, 'Your lastname should be atleast 2 characters']
		},
		password: {
			type: String,
			required: [true, 'Please provide password'],
			minlength: [6, 'Your password should be atleast 6 characters']
		},
		role: {
			type: String,
			enum: ['USER', 'SUPPORT', 'ADMIN'],
			default: 'USER'
		}
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
			getters: true
		}
	}
).index({ email: 1 }, { unique: true, collation: { locale: 'en_US', strength: 1 }, sparse: true });

userSchema.pre<UserDocument>('save', async function (): Promise<void> {
	if (this.isModified('password')) {
		// generate hash for password
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	}
});

userSchema.virtual('fullName').get(function (this: UserInfo) {
	return `${this.firstName} ${this.lastName}`;
});

userSchema.set('toJSON', {
	transform: function (doc, ret, options) {
		delete ret.createdAt;
		delete ret.updatedAt;
		delete ret.__v;
		delete ret._id;
		delete ret.password;
	}
});

userSchema.methods.comparePasswords = async function (newPassword: string): Promise<boolean> {
	const { password } = this;
	const match = await bcrypt.compare(newPassword, password);
	return match;
};

userSchema.methods.generateToken = function (): string {
	const { _id, fullName } = this;
	return jwt.sign(
		{
			sub: _id,
			fullName
		},
		config.JWTSecret,
		{ expiresIn: '5 days' }
	);
};

userSchema.methods.getAuthenticationInfo = function (): {
	fullName: string;
	email: string;
	token: string;
} {
	const { fullName, email } = this;
	return {
		fullName,
		email,
		token: this.generateToken()
	};
};

userSchema.statics.findByCredentials = async function (email, password): Promise<UserDocument> {
	const user = await this.findOne({ email });
	if (!user) {
		throw new Error('Invalid login credentials');
	}
	const isPasswordMatch = await user.comparePasswords(password, user.password);
	if (!isPasswordMatch) {
		throw new Error('Invalid login credentials');
	}
	return user;
};

export interface UserDocument extends UserInfo {
	comparePasswords(password: string): Promise<boolean>;
	generateToken();
	getAuthenticationInfo();
}

export interface UserModel extends Model<UserDocument> {
	findByCredentials(email: string, password: string): Promise<UserDocument>;
}

export const User: UserModel = model<UserDocument, UserModel>('User', userSchema);
