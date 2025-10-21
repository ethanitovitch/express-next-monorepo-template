import { db } from '@/lib/db'

export const findById = async (id: string) => {
  const example = await db
    .selectFrom('Example')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst()
  return example
}
