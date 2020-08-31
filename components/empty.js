import React from "react"
import Link from 'next/link'

class EmptyData extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: ''
    }
  }
  render()
  {
    const { name } = this.state
    return ( 
      <div className="row align-items-center justify-content-center">
             No data
        </div>
  
        )
  }
    
  }

export default EmptyData;