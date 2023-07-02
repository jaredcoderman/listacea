import prisma from '../../../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../auth/[...nextauth]';
import { useRouter } from 'next/router';

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const { categoryId } = req.query

  if(req.method === "PATCH") {
    const { rename, category } = req.body
    if(rename) {
      await prisma.category.update({
        where: {
          id: parseInt(categoryId, 10)
        },
        data: {
          name: rename
        }
      })
      return res.json()
    }
  } 
  if(req.method === "DELETE") {
    await prisma.category.delete({
      where: {
        id: parseInt(categoryId, 10)
      }
    })
  }
  return res.json()
}