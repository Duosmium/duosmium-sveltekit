import {
	Table,
	Column,
	Model,
	DataType,
	BelongsTo,
	NotNull,
	HasMany,
	BelongsToMany,
	ForeignKey, HasOne
} from 'sequelize-typescript';

@Table({
	timestamps: true
})
class Result extends Model {
	@Column
	@NotNull
	name: string | undefined;

	@Column(DataType.TEXT)
	@NotNull
	yaml: string | undefined;

	@HasOne(() => Tournament)
	tournament: Tournament | undefined;
}

// School/city/state data

@Table
class State extends Model {
	@Column
	@NotNull
	name: string | undefined;

	@HasMany(() => City)
	cities: City[] | undefined;
}

@Table
class City extends Model {
	@Column
	name: string | undefined;

	@BelongsTo(() => State)
	@NotNull
	state: State | undefined;

	@HasMany(() => School)
	schools: School[] | undefined;
}

@Table
class School extends Model {
	@Column
	@NotNull
	name: string | undefined;

	@BelongsTo(() => City)
	@NotNull
	city: City | undefined;
}

// Full-blown RDBMS version of SciolyFF
class Tournament extends Model {
	@BelongsTo(() => Result)
	@NotNull
	result: Result | undefined;
}

class Team extends Model {
	@BelongsTo(() => Tournament)
	@NotNull
	tournament: Tournament | undefined;

	@BelongsTo(() => School)
	@NotNull
	school: School | undefined;

	@BelongsTo(() => Track)
	track: Track | undefined;

	@HasMany(() => Placing)
	placings: Placing[] | undefined;

	@Column
	@NotNull
	number: number | undefined;
}

class Track extends Model {
	@BelongsTo(() => Tournament)
	tournament: Tournament | undefined;

	@HasMany(() => Team)
	teams: Team[] | undefined;
}

class Placing extends Model {
	@BelongsTo(() => Team)
	team: Team | undefined;
}

class Event extends Model {
	@Column
	@NotNull
	name: string | undefined;

	@BelongsToMany(() => Tournament, () => TournamentEvent)
	tournaments: Tournament[] | undefined;
}

class TournamentEvent extends Model {
	@ForeignKey(() => Tournament)
	tournament: Tournament | undefined;

	@ForeignKey(() => Event)
	event: Event | undefined;
}