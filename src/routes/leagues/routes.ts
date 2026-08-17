import { z } from "zod"
import type { FastifyTypedInstance } from "@/@types"
import {
  createLeague,
  deleteLeague,
  getLeague,
  listLeagues,
  updateLeague,
} from "./service"

const leagueSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  teamsCount: z.number(),
  playersPerTeam: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

const leagueWithRelationsSchema = leagueSchema.extend({
  players: z.array(z.unknown()),
  teams: z.array(z.unknown()),
  draftState: z.unknown().nullable(),
  draftOrder: z.array(z.unknown()),
})

const createLeagueSchema = z.object({
  name: z.string().min(1),
  teamsCount: z.number().int().positive(),
  playersPerTeam: z.number().int().positive(),
})

const updateLeagueSchema = createLeagueSchema.partial()

const errorSchema = z.object({ message: z.string() })

export async function leagueRoutes(app: FastifyTypedInstance) {
  app.post(
    "/",
    {
      schema: {
        tags: ["League"],
        body: createLeagueSchema,
        response: {
          201: leagueWithRelationsSchema,
          500: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const league = await createLeague(request.body)
      if (!league) {
        return reply.status(500).send({ message: "Failed to create league" })
      }
      return reply.status(201).send(league)
    },
  )

  app.get(
    "/",
    {
      schema: {
        tags: ["League"],
        response: {
          200: z.array(leagueSchema),
        },
      },
    },
    async (_, reply) => {
      const leagues = await listLeagues()
      return reply.status(200).send(leagues)
    },
  )

  app.get(
    "/:id",
    {
      schema: {
        tags: ["League"],
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          200: leagueWithRelationsSchema,
          404: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const league = await getLeague(id)

      if (!league) {
        return reply.status(404).send({ message: "League not found" })
      }

      return reply.status(200).send(league)
    },
  )

  app.put(
    "/:id",
    {
      schema: {
        tags: ["League"],
        params: z.object({
          id: z.string().uuid(),
        }),
        body: updateLeagueSchema,
        response: {
          200: leagueWithRelationsSchema,
          404: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const league = await updateLeague(id, request.body)

      if (!league) {
        return reply.status(404).send({ message: "League not found" })
      }

      return reply.status(200).send(league)
    },
  )

  app.delete(
    "/:id",
    {
      schema: {
        tags: ["League"],
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          200: z.object({ message: z.string() }),
          404: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const deleted = await deleteLeague(id)

      if (!deleted) {
        return reply.status(404).send({ message: "League not found" })
      }

      return reply.status(200).send({ message: "League deleted" })
    },
  )
}
