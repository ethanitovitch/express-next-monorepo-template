import { db } from '@/lib/db'

export const findById = async (id: string) => {
  const user = await db
    .selectFrom('User')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst()
  return user
}
