import json2csv, { parseAsync } from 'json2csv';
import { UserDocument } from '../api/components/users/user.model';

/**
 *
 * @param fieldsArray
 * @param tickets
 * @return csv
 */
export default async function generateCSVReport(fieldsArray, tickets): Promise<string> {
	const opts: json2csv.Options<string> = { fields: fieldsArray };
	const csv = await parseAsync(tickets, opts);
	return csv;
}
