import React, { useEffect, useRef, useState } from 'react'
import { UserProps } from './User';
import UserTile from './UserTile';
import { useSession } from 'next-auth/react';
import { ListProps } from './List';
import { mutate } from 'swr';

type Props = {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>> | null;
  users: UserProps[];
  list: ListProps;
  isOwner: boolean;
}

const ShareModal: React.FC<Props> = (props) => {  
  const { setModalOpen, users, list, isOwner } = props
  const [responseMessage, setResponseMessage] = useState('')
  const [email, setEmail] = useState('')
  const inputRef = useRef(null)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const addUser = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/v1/list/${list.id}`, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: "include"
      })
      if(!response.ok) throw new Error(`${response.status} (${response.statusText})`)
      const responseBody = await response.json()
      setEmail('')
      setResponseMessage(responseBody.message)
      mutate(`/api/v1/list/${list.id}`)
    } catch(err) {
      console.error(err)
    }
  }
  const userTiles = users.map(user => {
    return <UserTile key={user.id} isOwner={isOwner} user={user.user} listId={user.listId} />
  })

  const handleChange = (e) => {
    setEmail(e.currentTarget.value)
  }

  return (
    <div className="share-modal">
      <div ref={inputRef} className='modal-content'>
        <img src="/images/x-mark.png" onClick={(e) => {e.preventDefault; setModalOpen(false)}} className='close-button' />
        <div className='title-and-form'>
          <h3 className='title'>Share {`'${list.name}'`}</h3>
          <span
            className={responseMessage.includes('Error:') ? 'invalid' : 'valid'}  
          >
            {responseMessage}
          </span>
          <form className='user-form' onSubmit={addUser}>
            <input value={email} onChange={handleChange} type='text' placeholder="new user email" />
          </form>
        </div>
        <h3>Users</h3>
        <div className="user-list">
          {userTiles}
        </div>
      </div>
      <style jsx>
      {`
      :global(body) {
        background-color: rgba(0, 0, 0, 0.5);
      }
      
      span {
        font-size: 14px;
        text-align: center;
        padding-bottom: .5rem;
        margin: 0 auto;
        display: table;
      }

      .share-modal {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
      }

      .invalid {
          color: #FF1a1a;
        }

      .valid {
        color: #3291ff;
      }


      .title {
        text-align: center;
      }

      .user-form {
        display: table;
        margin: 0 auto .5rem auto
      }

      input {
        border: 1px solid black;
        margin-bottom: 1rem;
        padding: 5px;
        border-radius: 5px;
      }

      .modal-content {
        background-color: var(--bg);
        margin-top: 5rem;
        padding: 20px;
        border-radius: 5px;
        max-height: 300px;
        height: 300px;
        width: 275px;
        z-index: 9999;
        overflow-y: scroll;

      }

      h3 {
        margin-bottom: 1rem;
      }

      .close-button {
        cursor: pointer;
        height: 20px;
        width: 20px;
        float: right;
        transform: translate(15px, -10px);
      }

      .modal-content::-webkit-scrollbar {
        width: 8px;
      }

      .modal-content::-webkit-scrollbar-track {
        background-color: transparent;
      }

      .modal-content::-webkit-scrollbar-thumb {
        background-color: black;
        border-radius: 4px;
      }
      `}
      </style>
    </div>
  )
}

export default ShareModal