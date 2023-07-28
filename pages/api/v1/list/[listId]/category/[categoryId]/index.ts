import prisma from '../../../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../auth/[...nextauth]';

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const { categoryId, listId } = req.query

  if(req.method === "PATCH") {
    const { rename, draggedCategoryId } = req.body
    if(rename) {
      await prisma.category.update({
        where: {
          id: parseInt(categoryId, 10)
        },
        data: {
          name: rename
        }
      })
      return res.json()
    }
    if(draggedCategoryId) {
      const beingSwapped = await prisma.category.findUnique({
        where: {
          id: parseInt(draggedCategoryId, 10)
        }
      })
      const swapTarget = await prisma.category.findUnique({
        where: {
          id: parseInt(categoryId, 10)
        }
      })
      const swapTargetIndex = swapTarget.index
      if(beingSwapped.index < swapTargetIndex) {
        await prisma.category.updateMany({
          where: {
            listId: parseInt(listId, 10),
            index: {
              gt: beingSwapped.index,
              lte: swapTarget.index,
            },
          },
          data: {
            index: {
              decrement: 1,
            },
          },
        });
      } else if(beingSwapped.index > swapTargetIndex) {
        await prisma.category.updateMany({
          where: {
            listId: parseInt(listId, 10),
            index: {
              gte: swapTarget.index,
              lt: beingSwapped.index,
            },
          },
          data: {
            index: {
              increment: 1,
            },
          },
        });
      }
      await prisma.category.update({
        where: {
          id: parseInt(draggedCategoryId, 10)
        },
        data: {
          index: swapTargetIndex
        }
      })
      return res.status(204).send()
    }
  } 
  if(req.method === "DELETE") {
    await prisma.category.delete({
      where: {
        id: parseInt(categoryId, 10)
      }
    })
    return res.status(204).send()
  }
}