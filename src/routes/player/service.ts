import { randomUUID } from "node:crypto"
import { z } from "zod"
import { db } from "@/db"
import { players } from "@/db/schema"

export const schemaPlayer = z.object({
  name: z.string(),
  leagueId: z.string(),
  position: z.string(),
  createdAt: z.coerce.date().default(new Date()),
})

export type CreatePlayer = z.infer<typeof schemaPlayer>

export async function createPlayer({ leagueId, name, position }: CreatePlayer) {
  await db.insert(players).values({
    id: randomUUID(),
    createdAt: new Date(),
    name,
    position,
    leagueId,
  })
}
