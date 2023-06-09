import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (req.method === "POST") {
    const { item } = req.body;
    const result = await prisma.item.create({
      data: {
        name: item,
        user: { connect: { email: session?.user?.email } }
      },
    });
    res.json(result);
  } else if(req.method === "GET") {
    
    if(!session) {
      res.status(204)
    } else {
      const items = await prisma.item.findMany({
        where: {
          user: session.user
        }
      })

      res.json({ items: items})
    }
    
  }

}