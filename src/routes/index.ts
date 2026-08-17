import { z } from "zod"
import type { FastifyTypedInstance } from "@/@types"

export async function routes(app: FastifyTypedInstance) {
  app.get(
    "/",
    {
      schema: {
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (_, reply) => {
      return reply.status(200).send({ message: "Hello, World!" })
    },
  )
}
