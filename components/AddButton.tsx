import React, { useState } from "react"
import AddForm from "./AddForm"

export type Props = {
  imgSrc: string;
  route: string;
  placeholder: string;
  setEditingAll: React.Dispatch<React.SetStateAction<boolean>> | null;
  bulkOption: boolean;
};

const AddButton: React.FC<Props> = (props) => {
  const [adding, setAddingList] = useState(false)
  const { imgSrc, route, placeholder, setEditingAll, bulkOption } = props
  const handleClick = event => {
    setAddingList(!adding)
  }

  return (
    <div>
      <button onClick={handleClick}>
        <img src={`/images/${imgSrc}`}/>
      </button>
      <AddForm bulkOption={bulkOption} setEditingAll={setEditingAll} placeholder={placeholder} adding={adding} route={route} />
      <style jsx>
        {`
        img {
          width: 38px;
          height: 38px;
        }
        
        button {
          border: none;
          display: inline;
          background-color: transparent;
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