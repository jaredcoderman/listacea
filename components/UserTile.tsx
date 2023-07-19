import React from 'react'
import { useSession } from 'next-auth/react';
import { mutate } from 'swr';

const UserTile = ({ user, listId, isOwner }) => {
  const { data: session, status } = useSession();
  const splitName = user.name.split(" ")
  const updatedName = `${splitName[0]} ${splitName[1].substring(0, 1).toUpperCase()}`
  const handleDelete = async () => {
    const verify = confirm(`Are you sure you want to remove  ${updatedName} from the list?`)
    if(!verify) return
    await fetch(`/api/v1/list/${listId}/users/${user.id}`, {
      method: "DELETE",
    })
    mutate(`/api/v1/list/${listId}`)
  }
  return (
    <div className="container">
      <div className='header'>
        <div className="left">
          <img className='pfp' src={user.image} />
          <h4>{updatedName}</h4>
        </div>
        {isOwner && session.user.email !== user.email && <img onClick={handleDelete} src="/images/bin.png" />}
      </div>
      <span>{user.email}</span>
      <style jsx>
      {`
        h4 {
          margin: 5px 5px 5px 0;
        }

        span {
          font-style: italic;
          font-size: 12px;
          margin: 0 5px;
        }

        .left {
          display: flex;
        }

        .pfp {
          margin-top: 8px;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          width: 20px;
          height: 20px;
        }

        img {
          width: 18px;
          height: 18px;
          margin: 7px 7px 0 0;
          vertical-align: middle;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
        }

        .container {
          border: 1px solid black;
          border-radius: 5px;
          padding: 3px;
          margin-bottom: .3rem;
        }
      `}
      </style>
    </div>
  )
}

export default UserTile