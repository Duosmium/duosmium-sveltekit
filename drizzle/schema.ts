import { pgTable, index, unique, pgPolicy, bigint, timestamp, text, jsonb, boolean, uniqueIndex, foreignKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const results = pgTable("results", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "results_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	duosmiumId: text("duosmium_id").notNull(),
	data: jsonb(),
	title: text().notNull(),
	shortTitle: text("short_title").notNull(),
	dateString: text("date_string").notNull(),
	location: text().notNull(),
	level: text().notNull(),
	logo: text().default('default.png').notNull(),
	official: boolean().default(false).notNull(),
	preliminary: boolean().default(false).notNull(),
	hidden: boolean().default(false).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	season: bigint({ mode: "number" }).notNull(),
}, (table) => [
	index("results_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("results_level_idx").using("btree", table.level.asc().nullsLast().op("text_ops")),
	index("results_season_idx").using("btree", table.season.asc().nullsLast().op("int8_ops")),
	unique("results_duosmium_id_key").on(table.duosmiumId),
	pgPolicy("Admin privileges", { as: "permissive", for: "all", to: ["public"], using: sql`(((( SELECT auth.jwt() AS jwt) -> 'app_metadata'::text) ->> 'admin'::text))::boolean`, withCheck: sql`(((( SELECT auth.jwt() AS jwt) -> 'app_metadata'::text) ->> 'admin'::text))::boolean`  }),
	pgPolicy("Public read non-hidden", { as: "permissive", for: "select", to: ["public"] }),
]);

export const schools = pgTable("schools", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "schools_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	name: text().notNull(),
	city: text(),
	state: text(),
	country: text().default('United States').notNull(),
}, (table) => [
	uniqueIndex("schools_index").using("btree", table.id.asc().nullsLast().op("text_ops"), table.name.asc().nullsLast().op("int8_ops"), table.city.asc().nullsLast().op("int8_ops"), table.state.asc().nullsLast().op("int8_ops"), table.country.asc().nullsLast().op("text_ops")),
	index("schools_name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
	unique("location").on(table.name, table.city, table.state, table.country),
	pgPolicy("Admin privileges", { as: "permissive", for: "all", to: ["public"], using: sql`(((( SELECT auth.jwt() AS jwt) -> 'app_metadata'::text) ->> 'admin'::text))::boolean`, withCheck: sql`(((( SELECT auth.jwt() AS jwt) -> 'app_metadata'::text) ->> 'admin'::text))::boolean`  }),
	pgPolicy("Public read non-hidden", { as: "permissive", for: "select", to: ["public"] }),
]);

export const rankings = pgTable("rankings", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "rankings_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	resultId: bigint("result_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	schoolId: bigint("school_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	rank: bigint({ mode: "number" }).notNull(),
}, (table) => [
	index("rankings_result_id_idx").using("btree", table.resultId.asc().nullsLast().op("int8_ops")),
	index("rankings_school_id_idx").using("btree", table.schoolId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.resultId],
			foreignColumns: [results.id],
			name: "rankings_result_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.schoolId],
			foreignColumns: [schools.id],
			name: "rankings_school_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	pgPolicy("Admin privileges", { as: "permissive", for: "all", to: ["public"], using: sql`(((( SELECT auth.jwt() AS jwt) -> 'app_metadata'::text) ->> 'admin'::text))::boolean`, withCheck: sql`(((( SELECT auth.jwt() AS jwt) -> 'app_metadata'::text) ->> 'admin'::text))::boolean`  }),
	pgPolicy("Public read non-hidden", { as: "permissive", for: "select", to: ["public"] }),
]);
