import prisma from '../../../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../auth/[...nextauth]';

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const { listId, userId } = req.query
  
  if(req.method === "DELETE") {
    await prisma.listToUser.deleteMany({
      where: {
        listId: parseInt(listId, 10),
        userId: userId
      }
    })
    res.status(204).send()
  }
}