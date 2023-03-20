/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

import { prisma } from '../global/prisma';

export async function getLocation(name: string, city: string, state: string) {
	return await prisma.location.findUniqueOrThrow({
		where: {
			// @ts-ignore
			name_city_state: { name: name, city: city, state: state }
		}
	});
}

export async function locationExists(name: string, city: string, state: string) {
	return (
		(await prisma.location.count({
			where: {
				name: name,
				city: city,
				state: state
			}
		})) > 0
	);
}

export async function deleteLocation(name: string, city: string, state: string) {
	return await prisma.location.delete({
		where: {
			// @ts-ignore
			name_city_state: { name: name, city: city, state: state }
		}
	});
}

export async function deleteAllLocations() {
	return await prisma.location.deleteMany({});
}

export async function addLocation(locationData: object) {
	console.log(locationData);
	return await prisma.location.upsert({
		where: {
			// @ts-ignore
			name_city_state: locationData
		},
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		create: locationData,
		update: locationData
	});
}
