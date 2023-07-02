import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (req.method === "POST") {
    const { name } = req.body;
    await prisma.list.create({
      data: {
        user: { connect: { email: session.user.email }},
        name: name
      }
    })
    return res.json()
  }
  if (req.method === "GET") {
    const lists = await prisma.list.findMany({
      where: {
        user: session.user
      },
      orderBy: {
        id: "asc"
      }
    })
    return res.json({ lists: lists })
  }
  return res.json({ error: "No method"})
}