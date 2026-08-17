import { z } from "zod"

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().max(65535).default(3333),
  TURSO_DATABASE_URL: z.url(),
  TURSO_AUTH_TOKEN: z.string()
})

const env = envSchema.parse(process.env)

export default env
