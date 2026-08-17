import type { FastifyTypedInstance } from "@/@types"
import { createPlayer, schemaPlayer } from "./service"

export async function playersRoutes(app: FastifyTypedInstance) {
  app.post(
    "/",
    {
      schema: {
        tags: ["Player"],
        body: schemaPlayer,
        // response: {
        //   200: leagueWithRelationsSchema,
        //   500: errorSchema,
        // },
      },
    },
    async (request, reply) => {
      await createPlayer(request.body)
      // if (!league) {
      //   return reply.status(500).send({ message: "Failed to create league" })
      // }
      // return reply.status(201).send(league)
    },
  )
}
