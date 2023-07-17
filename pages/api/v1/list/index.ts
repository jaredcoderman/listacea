import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (req.method === "POST") {
    const { name } = req.body;
    await prisma.list.create({
      data: {
        name: name,
        users: { 
          create: [
            { user: { connect: { email: session.user.email} } }
          ],
        },
        ownerEmail: session.user.email
      }
    })
    return res.json()
  }
  if (req.method === "GET") {
    if(session) {
      const lists = await prisma.list.findMany({
        where: {
          users: {
            some: {
              user: {
                email: session.user.email
              }
            }
          }
        },
        orderBy: {
          id: "asc"
        }
      })
      return res.json({ lists: lists })
    }
  }
  return res.status(204).send()
}