import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async () => {
	throw error(501);
}) satisfies RequestHandler;

export const POST = (async () => {
	throw error(501);
}) satisfies RequestHandler;

export const PUT = (async () => {
	throw error(501);
}) satisfies RequestHandler;

export const PATCH = (async () => {
	throw error(501);
}) satisfies RequestHandler;

export const DELETE = (async () => {
	throw error(501);
}) satisfies RequestHandler;
