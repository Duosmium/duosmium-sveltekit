/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

import { addLocation, getLocation } from '../locations/async';
import { prisma } from '../global/prisma';

export async function getSchool(locationID: number) {
	return await prisma.school.findUniqueOrThrow({
		where: {
			locationId: locationID
		}
	});
}

export async function schoolExists(locationID: number) {
	return (
		(await prisma.school.count({
			where: {
				locationId: locationID
			}
		})) > 0
	);
}

export async function deleteSchool(locationID: number) {
	return await prisma.school.delete({
		where: {
			locationId: locationID
		}
	});
}

export async function deleteAllSchools() {
	return await prisma.school.deleteMany({});
}

export async function addSchool(schoolData: object) {
	let locationID;
	try {
		// @ts-ignore
		locationID = (await getLocation(schoolData['name'], schoolData['city'], schoolData['state']))[
			'id'
		];
	} catch (e) {
		// @ts-ignore
		locationID = (await addLocation(schoolData['name'], schoolData['city'], schoolData['state']))[
			'id'
		];
	}
	const output = await prisma.school.upsert({
		where: {
			locationId: locationID
		},
		create: {
			location: {
				connect: {
					id: locationID
				}
			}
		},
		update: {
			location: {
				connect: {
					id: locationID
				}
			}
		}
	});
	// prisma.location.update({
	// 	where: {
	// 		id: locationID
	// 	},
	// 	data: {
	// 		school: {
	// 			connect: {
	// 				id: output['id']
	// 			}
	// 		}
	// 	}
	// });
	return output;
}
