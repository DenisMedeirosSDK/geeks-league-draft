import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { randomUUIDv7 } from "node:crypto"

export const leagues = sqliteTable("leagues", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUIDv7()),

  name: text("name").notNull(),

  teamsCount: integer("teams_count").notNull(),

  playersPerTeam: integer("players_per_team").notNull(),

  createdAt: integer("created_at", {
    mode: "timestamp",
  }).notNull(),

  updatedAt: integer("updated_at", {
    mode: "timestamp",
  }).notNull(),
})

export const players = sqliteTable("players", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUIDv7()),

  leagueId: text("league_id")
    .notNull()
    .references(() => leagues.id, {
      onDelete: "cascade",
    })
    .$defaultFn(() => randomUUIDv7()),

  name: text("name").notNull(),

  position: text("position").notNull(),

  createdAt: integer("created_at", {
    mode: "timestamp",
  }).notNull(),
})

export const teams = sqliteTable("teams", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUIDv7()),

  leagueId: text("league_id")
    .notNull()
    .references(() => leagues.id, {
      onDelete: "cascade",
    })
    .$defaultFn(() => randomUUIDv7()),

  name: text("name").notNull(),

  draftPosition: integer("draft_position").notNull(),

  createdAt: integer("created_at", {
    mode: "timestamp",
  }).notNull(),
})

export const teamPlayers = sqliteTable(
  "team_players",
  {
    teamId: text("team_id")
      .notNull()
      .references(() => teams.id, {
        onDelete: "cascade",
      })
      .$defaultFn(() => randomUUIDv7()),

    playerId: text("player_id")
      .notNull()
      .references(() => players.id, {
        onDelete: "cascade",
      })
      .$defaultFn(() => randomUUIDv7()),

    pickOrder: integer("pick_order").notNull(),

    createdAt: integer("created_at", {
      mode: "timestamp",
    }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.teamId, table.playerId],
    }),
  ],
)

export const draftState = sqliteTable("draft_state", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUIDv7()),

  leagueId: text("league_id")
    .notNull()
    .unique()
    .references(() => leagues.id, {
      onDelete: "cascade",
    })
    .$defaultFn(() => randomUUIDv7()),

  pickIdCounter: integer("pick_id_counter").notNull().default(0),

  draftPointer: integer("draft_pointer").notNull().default(0),

  currentStep: integer("current_step").notNull().default(1),

  status: text("status").notNull().default("waiting"),

  updatedAt: integer("updated_at", {
    mode: "timestamp",
  }).notNull(),
})

export const draftOrder = sqliteTable("draft_order", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUIDv7()),

  leagueId: text("league_id")
    .notNull()
    .references(() => leagues.id, {
      onDelete: "cascade",
    })
    .$defaultFn(() => randomUUIDv7()),

  teamId: text("team_id")
    .notNull()
    .references(() => teams.id, {
      onDelete: "cascade",
    })
    .$defaultFn(() => randomUUIDv7()),

  position: integer("position").notNull(),
})
