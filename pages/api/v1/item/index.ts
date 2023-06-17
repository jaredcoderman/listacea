import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (req.method === "POST") {
    const { item, category } = req.body;
    const categoryRelation = await prisma.category.findFirst({
      where: {
        user: session.user,
        name: category
      }
    })
    const result = await prisma.item.create({
      data: {
        name: item,
        category: { connect: { id: categoryRelation.id}},
      },
    });
    res.json(result);
  } else if(req.method === "GET") {
    if(!session) {
      res.status(204).send()
    } else {

      const items = await prisma.item.findMany({
        where: {
          category: {
            user: session.user
          }
        }
      })
      // sort items by category
      let categoriesWithItems = {}
      for(let item of items) {
        let category = await prisma.category.findUnique({
          where: { id: item.categoryId }
        })
        if(!(category.name in categoriesWithItems)) {
          categoriesWithItems[category.name] = [item]
        } else {
          categoriesWithItems[category.name].push(item)
        }
      }
      res.json({ items: categoriesWithItems})
    }
  }

}