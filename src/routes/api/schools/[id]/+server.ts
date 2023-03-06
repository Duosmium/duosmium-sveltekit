// noinspection JSUnusedGlobalSymbols

import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSchoolByFullName, getSchoolByMongoID } from '$lib/schools/async';
import { MONGO_ID_REGEX, exportYAMLOrJSON } from '$lib/results/helpers';
import { ObjectId } from 'mongodb';
import { deleteSchoolByFullName, deleteSchoolByMongoID } from '../../../../lib/schools/async';

export const GET = (async ({ url }) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const schoolID = decodeURI(url.pathname.split('/').pop());
	if (schoolID === undefined) {
		throw error(400, 'No school specified!');
	} else if (MONGO_ID_REGEX.test(schoolID)) {
		try {
			const result = await getSchoolByMongoID(new ObjectId(schoolID));
			return exportYAMLOrJSON(url, result, schoolID);
		} catch (e) {
			throw error(404, 'School ' + schoolID + ' does not exist!');
		}
	} else {
		try {
			const result = await getSchoolByFullName(schoolID);
			return exportYAMLOrJSON(url, result, schoolID);
		} catch (e) {
			throw error(404, 'School ' + schoolID + ' does not exist!');
		}
	}
}) satisfies RequestHandler;

export const POST = async () => {
	throw error(501);
};

export const PUT = (async () => {
	throw error(501);
}) satisfies RequestHandler;

export const PATCH = (async () => {
	throw error(501);
}) satisfies RequestHandler;

export const DELETE = (async ({ url }) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const schoolID = decodeURI(url.pathname.split('/').pop());
	if (schoolID === undefined) {
		throw error(400, 'No school specified!');
	} else if (MONGO_ID_REGEX.test(schoolID)) {
		try {
			await deleteSchoolByMongoID(new ObjectId(schoolID));
		} catch (e) {
			throw error(404, 'School ' + schoolID + ' does not exist!');
		}
	} else {
		try {
			await deleteSchoolByFullName(schoolID);
		} catch (e) {
			throw error(404, 'School ' + schoolID + ' does not exist!');
		}
	}
	return new Response(null, { status: 204 });
}) satisfies RequestHandler;
