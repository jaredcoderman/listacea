import prisma from '../../../../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../auth/[...nextauth]';

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if(req.method === "GET") {
    return res.json({hello: "test"})
  }
  if (req.method === "POST") {
    const { newItem } = req.body
    const { categoryId } = req.query
    const result = await prisma.item.create({
      data: {
        name: newItem,
        category: { connect: { id: parseInt(categoryId, 10)}},
      },
    });
    res.json(result);
  }

}