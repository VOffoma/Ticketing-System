import json2csv, { parseAsync } from 'json2csv';
import { UserDocument } from '../components/users/user.model';

export default async function generateCSVReport(fieldsArray, tickets): Promise<string> {
	const opts: json2csv.Options<string> = { fields: fieldsArray };
	const csv = await parseAsync(tickets, opts);
	return csv;
}
