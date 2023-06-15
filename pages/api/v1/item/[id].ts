import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { useRouter } from 'next/router';

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const id = parseInt(req.query.id)

  let itemToUpdate = await prisma.item.findUnique({
    where: {
      id: id
    }
  })
  if(!itemToUpdate) return res.json()
  let update = async(bool: boolean) => {
    await prisma.item.update({
      where: {
        id: id
      },
      data: {
        purchased: bool
      }
    })
  }
  if(req.method === "GET") {
    res.json({ success: "Hello from " + itemToUpdate.name})
  }
  if(req.method === "PATCH") {
    const { rename } = req.body
    if(rename) {
      await prisma.item.update({
        where: {
          id: id
        },
        data: {
          name: rename
        }
      })
      return res.json()
    }
    if(!itemToUpdate.purchased) {
      update(true)
      return res.json()
    } else {
      update(false)
      return res.json()
    }
  } 
  return res.json()
}