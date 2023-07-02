import prisma from '../../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]';

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const { listId } = req.query
  if (req.method === "POST") {
    const { name } = req.body;
    const result = await prisma.category.create({
      data: {
        name: name,
        list: { connect: { id: parseInt(listId, 10) } }
      },
    });
    res.json();
  } else if(req.method === "GET") {
    if(!session) {
      res.status(204).send()
    } else {
      if (listId) {
        const categories = await prisma.category.findMany({
          where: {
            listId: parseInt(listId, 10)
          },
          include: {
            items: {
              orderBy: [
                {
                  purchased: "asc"
                },
                {
                  id: "asc"
                }
              ]
            }
          },
          orderBy: {
            id: "asc"
          }
        });
        res.json({ categories });
      } else {
        res.status(204).send();
      }      
    }
  }

}