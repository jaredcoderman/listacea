import prisma from '../../../../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../auth/[...nextauth]';
import { useRouter } from 'next/router';

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const { id } = req.query

  if(req.method === "PATCH") {
    const { rename, category, bool } = req.body
    if(rename) {
      await prisma.item.update({
        where: {
          id: parseInt(id, 10)
        },
        data: {
          name: rename
        }
      })
      return res.json()
    }
    if(category) {
      let cat = await prisma.category.findFirst({
        where: {
          name: category,
          // user: session.user
        }
      })
      await prisma.item.update({
        where: {
          id: parseInt(id, 10)
        },
        data: {
          categoryId: cat.id
        }
      })
      return res.json()
    }
    if(bool !== undefined) {
      await prisma.item.update({
        where: { id: parseInt(id, 10) },
        data: {
          purchased: bool
        }
      })
      return res.status(204).send()
    }
  } 
  if(req.method === "DELETE") {
    await prisma.item.delete({
      where: {
        id: parseInt(id, 10)
      }
    })
  }
  return res.json()
}