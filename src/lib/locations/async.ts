/* eslint-disable @typescript-eslint/ban-ts-comment */
// noinspection ES6RedundantAwait

import { prisma } from '../global/prisma';

export async function getLocation(name: string, city: string, state: string, country: string) {
	return await prisma.location.findUniqueOrThrow({
		where: {
			// @ts-ignore
			name_city_state: { name: name, city: city, state: state, coutnry: country }
		}
	});
}

export async function locationExists(name: string, city: string, state: string, country: string) {
	return (
		(await prisma.location.count({
			where: {
				name: name,
				city: city,
				state: state,
				country: country
			}
		})) > 0
	);
}

export async function deleteLocation(name: string, city: string, state: string, country: string) {
	return await prisma.location.delete({
		where: {
			// @ts-ignore
			name_city_state_country: { name: name, city: city, state: state, country: country }
		}
	});
}

export async function deleteAllLocations() {
	return await prisma.location.deleteMany({});
}

export async function addLocation(locationData: object) {
	return await prisma.location.upsert({
		where: {
			// @ts-ignore
			name_city_state_country: locationData
		},
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		create: locationData,
		update: locationData
	});
}

export async function createLocationDataInput(name: string, city: string | undefined, state: string, country: string | undefined) {
	return {
		name: name,
		city: city === undefined ? '' : city,
		state: state,
		country: country === undefined ? 'United States' : country,
	}
}
