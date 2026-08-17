import fastifyCors from "@fastify/cors"
import fastifySwagger from "@fastify/swagger"
import ScalarApiReference from "@scalar/fastify-api-reference"
import { fastify } from "fastify"
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod"
import env from "./env"
import { routes } from "./routes"

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Length", "X-Kuma-Revision"],
  credentials: true,
  maxAge: 86400,
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Arena Upando API",
      description: "API documentation for arena upando application",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3333",
        description: "Local server",
      },
    ],
  },
  transform: jsonSchemaTransform,
})


app.register(ScalarApiReference, { routePrefix: "/docs" })

app.register(routes)

app.listen({ port: env.PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
  console.log(`Docs listening at ${address}/docs`)
})
