import prisma from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]';

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const { recipeId } = req.query
  if (req.method === "GET") {
    if(recipeId) {  
      const recipe = await prisma.recipe.findUnique({
        where: {
          id: parseInt(recipeId, 10)
        }
      })
      return res.json({ recipe: recipe })
    }
  }
}