import prisma from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]';

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const { listId } = req.query
  const { hasBeenChecked, isGroceryList } = req.body
  if (req.method === "GET") {
    if(listId) {  
      const list = await prisma.list.findUnique({
        where: {
          id: parseInt(listId, 10)
        },
        include: {
          users: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  id: true,
                  image: true
                }
              }
            }
          }
        }
      })
      return res.json({ list: list })
    }
  }
  if (req.method === "DELETE") {
    if(listId) {  
      const list = await prisma.list.findUnique({
        where: {
          id: parseInt(listId, 10)
        }
      })
      if(list.ownerEmail !== session.user?.email) {
        console.log("You're not the owner")
        return res.json({message: "You can only delete lists you own!"})
      }
      await prisma.listToUser.deleteMany({
        where: {
          listId: parseInt(listId, 10)
        }
      })
      await prisma.list.delete({
        where: {
          id: parseInt(listId, 10)
        }
      })
      return res.status(204).send()
    }
  }
  if (req.method === "PATCH") {
    const { rename, email, userToDelete } = req.body
    const list = await prisma.list.findUnique({
      where: {
        id: parseInt(listId, 10)
      }
    })
    if(rename && list.ownerEmail === session.user.email) {  
      await prisma.list.update({ 
        where: {
          id: parseInt(listId, 10)
        },
        data: {
          name: rename
        }
      })
      return res.json()
    }
    if(email) {
      try {
        const userToAdd = await prisma.user.findUnique({
          where: {
            email: email
          }
        })
        if(userToAdd) {
          const listsUsersIn = await prisma.listToUser.findMany({
            where: {
              userId: userToAdd.id
            }
          })
          let isInList = false
          listsUsersIn.forEach(list => {
            if(list.listId === parseInt(listId, 10)) isInList = true;
          })
          if(isInList) {
            return res.json({message: "Error: User is already in this list"})
          }

          // Add user to the list
          await prisma.list.update({
            where: {
              id: parseInt(listId, 10)
            },
            data: {
              users: {
                create: [
                  { user: { connect: { email: email } } }
                ]
              }
            }
          })

          // Notify added user
          await prisma.user.update({
            where: {
              id: userToAdd.id
            },
            data: {
              notifications: {
                create: [
                  {
                    description: `${session.user.name} added you to their list "${list.name}"`,
                    image: session.user.image
                  }
                ]
              }
            }
          })
          return res.json({message: "User added successfully"})
        } else {
          return res.json({message: `Error: email "${email}" does not exist`})
        }
      } catch(err) {
        console.error(err)
      }
    }
    if(userToDelete) {
      const user = await prisma.user.findUnique({
        where: { email: userToDelete }
      })
      await prisma.listToUser.deleteMany({
        where: {
          listId: parseInt(listId, 10),
          userId: user.id
        }
      })
      return res.status(204).send()
    }
  }
}