import type { Actions } from './$types';
import { load } from 'js-yaml';
import { db } from '$lib/database';

async function handleUploadedFile(file: File) {
	const yaml = await file.text();
	const obj = load(yaml);
	const fileName = file.name.split('.yaml')[0];
	if (
		!fileName.match(
			/\d{4}-\d{2}-\d{2}_([\w-]+_)*(invitational|regional|states|nationals)_(no_builds_)?[abc]/
		)
	) {
		throw new Error('The file name ' + fileName + " doesn't match the approved syntax!");
	}
	const collection = db.collection('results');
	const resultExists =
		(await collection.countDocuments({
			duosmium_id: fileName
		})) > 0;
	if (resultExists) {
		await collection.updateOne(
			{
				duosmium_id: fileName
			},
			{
				$set: {
					result: obj
				}
			}
		);
		console.log('Replaced ' + fileName + ' in ' + db.databaseName);
	} else {
		await collection.insertOne({
			duosmium_id: fileName,
			result: obj
		});
		console.log('Added ' + fileName + ' in ' + db.databaseName);
	}
}

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const allFiles = data.getAll('yaml');
		allFiles.forEach((file) => {
			if (file === null || typeof file === 'string') {
				throw new Error('Uploaded value is not a file!');
			}
			handleUploadedFile(file);
		});
	}
} satisfies Actions;
