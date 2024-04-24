import { z } from "zod"
import { createActivity, deleteActivity } from "~/server/queries"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const challenge = searchParams.get('hub.challenge')

  return Response.json({ "hub.challenge": challenge })
}

export async function POST(req: Request) {
  const data: unknown = await req.json()

  const schema = z.object({
    object_id: z.number(),
    aspect_type: z.string(),
    object_type: z.string(),
    owner_id: z.number(),
  })

  const parsedData = schema.parse(data)

  if (parsedData.aspect_type == 'create') {
    await createActivity({
      object_id: parsedData.object_id,
      object_type: parsedData.object_type,
      owner_id: parsedData.owner_id,
    })
  }

  if (parsedData.aspect_type == 'delete') {
    await deleteActivity({
      stravaId: `${parsedData.object_id}`,
    })
  }

  return Response.json({ status: 200 })
}
