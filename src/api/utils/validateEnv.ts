import { cleanEnv, str, port } from 'envalid';

export default function validateEnv(): void {
	cleanEnv(process.env, {
		MONGODB_URL: str(),
		PORT: port()
	});
}
