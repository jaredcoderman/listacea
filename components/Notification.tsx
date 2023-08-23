import React from 'react'

const Notification = props => {
  const { notification } = props
  return (
      <div className="notification">
        <img src={notification.image} />
        <div>
          <span className="description">{notification.description}</span>
          <span className='time'>3 minutes ago</span>
        </div>
        <style jsx>
        {`
          img {
            width: 28px;
            height: 28px;
            vertical-align: text-top;
            margin-right: .8rem;
          }
          .title {
            margin-top: 0;
          }
          .time {
            display: block;
            font-size: 12px;
            color: #929292;
          }
          .description {
            font-size: 15px;
          }
          .notification {
            display: flex;
            margin-top: 1rem;
            align-items: center;
          }
        `}
        </style>
      </div>
  )
}

export default Notification