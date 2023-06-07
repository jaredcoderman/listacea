import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { useRouter } from 'next/router';

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const id = parseInt(req.query.id)
  let todoToUpdate = await prisma.todo.findUnique({
    where: {
      id: id
    }
  })
  if(!todoToUpdate) return res.json()
  let update = async(bool: boolean) => {
    await prisma.todo.update({
      where: {
        id: id
      },
      data: {
        purchased: bool
      }
    })
  }
  if(req.method === "PATCH") {
    if(!todoToUpdate.purchased) {
      update(true)
      return res.json()
    } else {
      update(false)
      return res.json()
    }
  }
  return res.json()
}