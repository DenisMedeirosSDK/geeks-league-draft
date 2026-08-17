import { defineRelations } from "drizzle-orm"
import { drizzle } from "drizzle-orm/libsql"
import env from "@/env"
import * as schema from "./schema"

const relations = defineRelations(schema)

export const db = drizzle({
  connection: {
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
  relations,
})
