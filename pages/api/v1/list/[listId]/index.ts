import prisma from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]';

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const { listId } = req.query
  if (req.method === "GET") {
    if(listId) {  
      const list = await prisma.list.findUnique({
        where: {
          id: parseInt(listId, 10)
        }
      })
      return res.json({ list: list })
    }
  }
  if (req.method === "DELETE") {
    if(listId) {  
      const list = await prisma.list.delete({
        where: {
          id: parseInt(listId, 10)
        }
      })
      return res.json()
    }
  }
  if (req.method === "PATCH") {
    const { rename } = req.body
    if(listId && rename) {  
      const list = await prisma.list.update({ 
        where: {
          id: parseInt(listId, 10)
        },
        data: {
          name: rename
        }
      })
      return res.json()
    }
  }
}