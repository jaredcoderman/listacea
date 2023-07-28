import prisma from '../../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]';
import makeCategoriesForItems from "./makeCategoriesForItems"

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const { listId } = req.query
  if (req.method === "POST") {
    const { name, bulkList } = req.body;
    if(name) {
      const list = await prisma.list.findUnique({
        where: {
          id: parseInt(listId, 10)
        },
        include: {
          categories: true
        }
      })
      const newIndex = list.categories.length + 1
      const result = await prisma.category.create({
        data: {
          name: name,
          list: { connect: { id: parseInt(listId, 10) } },
          index: newIndex
        },
      });
      res.status(204).send()
    }
    if(bulkList) {
      console.log("Making categories..")
      const response = await makeCategoriesForItems(bulkList)
      console.log(response.categories)
      response.categories.forEach(async (category, index) => {
        const newIndex = index + 1
        console.log(category.name)
        const newCategory = await prisma.category.create({
          data: {
            name: category.name,
            list: { connect: { id: parseInt(listId, 10) } },
            index: newIndex
          },
        })
        category.items.forEach(async (item) => {
          await prisma.item.create({
            data: {
              name: item,
              category: { connect: { id: newCategory.id }},
            },
          })
        })
      })
      res.status(204).send()
    }

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
            index: "asc"
          }
        });
        res.json({ categories });
      } else {
        res.status(204).send();
      }      
    }
  }
}