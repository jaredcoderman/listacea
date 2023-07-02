import React, { useState } from "react"
import AddForm from "./AddForm"

export type Props = {
  imgSrc: string;
  route: string;
  placeholder: string;
};

const AddButton: React.FC<Props> = (props) => {
  const [adding, setAddingList] = useState(false)
  const { imgSrc, route, placeholder } = props
  const handleClick = event => {
    setAddingList(!adding)
  }

  return (
    <div>
      <button onClick={handleClick}>
        <img src={`/images/${imgSrc}`}/>
      </button>
      <AddForm placeholder={placeholder} adding={adding} route={route} />
      <style jsx>
        {`
        img {
          width: 38px;
          height: 38px;
        }
        
        button {
          border: none;
          display: inline;
        }
        div {
          display: flex;
          justify-content: center;
          margin-top: 4rem;
        }
        `}
      </style>
    </div>
  )
}

export default AddButton