import { eq } from "drizzle-orm"
import { randomUUID } from "node:crypto"

import { db } from "@/db"
import {
  draftOrder,
  draftState,
  leagues,
  players,
  teamPlayers,
  teams,
} from "@/db/schema"

type CreateLeagueInput = {
  name: string
  teamsCount: number
  playersPerTeam: number
}

type UpdateLeagueInput = Partial<CreateLeagueInput>

export async function createLeague(input: CreateLeagueInput) {
  const now = new Date()

  const leagueId = randomUUID()

  await db.insert(leagues).values({
    id: leagueId,
    name: input.name,
    teamsCount: input.teamsCount,
    playersPerTeam: input.playersPerTeam,
    createdAt: now,
    updatedAt: now,
  })

  await db.insert(draftState).values({
    id: randomUUID(),
    leagueId,
    pickIdCounter: 0,
    draftPointer: 0,
    currentStep: 1,
    status: "waiting",
    updatedAt: now,
  })

  return getLeague(leagueId)
}

export async function getLeague(id: string) {
  const league = await db.query.leagues.findFirst({
    where: eq(leagues.id, id),
  })

  if (!league) {
    return null
  }

  const leaguePlayers = await db.query.players.findMany({
    where: eq(players.leagueId, id),
  })
  const leagueTeams = await db.query.teams.findMany({
    where: eq(teams.leagueId, id),
  })
  const state = await db.query.draftState.findFirst({
    where: eq(draftState.leagueId, id),
  })
  const order = await db.query.draftOrder.findMany({
    where: eq(draftOrder.leagueId, id),
  })

  return {
    ...league,
    players: leaguePlayers,
    teams: leagueTeams,
    draftState: state,
    draftOrder: order,
  }
}

export async function listLeagues() {
  return await db.query.leagues.findMany()
}

export async function updateLeague(id: string, input: UpdateLeagueInput) {
  const league = await db.query.leagues.findFirst({
    where: eq(leagues.id, id),
  })

  if (!league) {
    return null
  }

  await db
    .update(leagues)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(leagues.id, id))

  return getLeague(id)
}

export async function deleteLeague(id: string) {
  const league = await db.query.leagues.findFirst({
    where: eq(leagues.id, id),
  })

  if (!league) {
    return false
  }

  await db.delete(leagues).where(eq(leagues.id, id))

  return true
}
