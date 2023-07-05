import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import RecipeScraper from '../../../recipes/scrape';

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const { link } = req.query

  if(req.method === "GET") {
    if(link) {
      let scraper = new RecipeScraper()
      const scrapedData = await scraper.getFoodNetworkRecipe(link)
      await prisma.recipe.create({
        data: {
          user: { connect: { email: session.user.email }},
          name: scrapedData.name,
          steps: scrapedData.steps,
          ingredients: scrapedData.ingredients
        }
      })
      return res.json({ scrapedData: scrapedData })
    }
    const recipes = await prisma.recipe.findMany({
      where: {
        user: session.user
      },
      orderBy: {
        id: "desc"
      }
    })
    return res.json({ recipes: recipes })
  }
}