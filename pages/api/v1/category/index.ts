import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (req.method === "POST") {
    const { category } = req.body;
    const result = await prisma.category.create({
      data: {
        name: category,
        user: { connect: { email: session?.user?.email } }
      },
    });
    res.json(result);
  } else if(req.method === "GET") {
    if(!session) {
      res.status(204).send()
    } else {
      const categories = await prisma.category.findMany({
        where: {
          user: session.user
        }
      })
      res.json({ categories: categories})
    }
  }

}