import { relations } from "drizzle-orm/relations";
import { results, rankings, schools } from "./schema";

export const rankingsRelations = relations(rankings, ({one}) => ({
	result: one(results, {
		fields: [rankings.resultId],
		references: [results.id]
	}),
	school: one(schools, {
		fields: [rankings.schoolId],
		references: [schools.id]
	}),
}));

export const resultsRelations = relations(results, ({many}) => ({
	rankings: many(rankings),
}));

export const schoolsRelations = relations(schools, ({many}) => ({
	rankings: many(rankings),
}));