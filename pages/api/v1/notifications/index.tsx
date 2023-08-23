import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (req.method === "GET") {
    if (!session) return res.status(204).send()
    const notifications = await prisma.notification.findMany({
      where: {
        user: session.user
      }
    })
    return res.json({ notifications: notifications })
  }
}