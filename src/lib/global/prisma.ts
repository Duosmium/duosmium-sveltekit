import { PrismaClient } from '@prisma/client';
import { DATABASE_URL } from '$env/static/private';

// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices

const prismaClientSingleton = () => {
	return new PrismaClient({
		datasources: {
			db: {
				url: DATABASE_URL
			}
		},
		log: ['query']
	});
};

declare global {
	var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
