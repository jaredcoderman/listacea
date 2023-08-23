import React, { useState } from 'react';
import Notification from './Notification';
import useSWR from "swr"

const Bell = () => {
  const [show, setShow] = useState(false);

  const fetchNotifications = async (url) => {
    try {
      const response = await fetch("/api/v1/notifications", {
        method: "GET"
      })
      if(!response.ok) {
        throw new Error(`${response.status} (${response.statusText})`)
      }
      const responseBody = await response.json()
      return responseBody.notifications
    } catch(err) {
      console.error(err)
    }
  }

  const { data: notifications, isLoading } = useSWR("/api/v1/notifications", fetchNotifications);
  const handleClick = () => {
    setShow(!show);
  };

  let notificationsList;
  if(notifications) {
    notificationsList = notifications.map(notification => {
      return <Notification notification={notification} key={notification.id} />
    })
  }

  return (
    <div className="bell-container">
      <img onClick={handleClick} src="/images/bell.png" className="bell" alt="Bell Icon" />
      {show && (
        <div className="notification-modal">
          <h1>Notifications</h1>
          <hr />
          {notificationsList}
        </div>
      )}
      <style jsx>
        {`
          .bell-container {
            position: relative;
            display: inline;
          }
          h1 {
            margin-bottom: 0;
            font-size: 20px;
            margin-top: .2rem;
          }
          .bell {
            width: 32px;
            height: 32px;
            vertical-align: middle;
            margin-right: 1rem;
            cursor: pointer;
            position: relative;
          }
          .bell:hover {
            transform: translate(0, -3px);
          }
          .notification-modal {
            border-radius: 5px;
              width: 250px;
              position: absolute;
              top: 40px;
              right: -10px;
              background-color: white;
              border: 1px solid #ccc;
              padding: 10px;
              box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
              overflow-y: scroll;
              max-height: 150px;
              z-index: 999;
            }
        `}
      </style>
    </div>
  );
};

export default Bell;