import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (req.method === "POST") {
    const { item } = req.body;
    console.log(item)
    const result = await prisma.todo.create({
      data: {
        name: item,
        user: { connect: { email: session?.user?.email } }
      },
    });
    res.json(result);
  } else if(req.method === "GET") {
    
    if(!session) {
      res.json()
    } else {
      const todos = await prisma.todo.findMany({
        where: {
          user: session.user
        }
      })
      res.json({ todos: todos})
    }
    
  }

}