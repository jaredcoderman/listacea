import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { useRouter } from 'next/router';

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const id = parseInt(req.query.id)

  let categoryToUpdate = await prisma.category.findUnique({
    where: {
      id: id
    }
  })
  if(req.method === "GET") {
    res.json({ success: "Hello from " + categoryToUpdate.name})
  }
  if(req.method === "PATCH") {
    const { rename } = req.body
    if(rename) {
      await prisma.category.update({
        where: {
          id: id
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
        id: id
      }
    })
  }
  return res.json()
}