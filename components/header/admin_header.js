import React from "react"
import Link from 'next/link'

class Adminheader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rates: []
    }
  }
  render()
  {
    return ( 
      <nav className="navbar navbar-expand-lg top-nav">
                <button className="btn btn-primary navbar-toggler" id="menu-toggle">Toggle Menu</button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <div className="navbar-nav ml-auto mt-2 mt-lg-0">
                    <div className=" float-right icon-div">
                    <img src="/top-nav icons/notifications.png" alt=""></img>
                    <img src="/top-nav icons/arrow-down.png" alt=""></img>
                    <div>
                        <h4>Vybs Samuel O</h4>
                        <p>Super Admin</p>
                    </div>
                    <img src="/top-nav icons/profile circle.png" alt=""></img>
                    </div>
                    </div>
                </div>
                
            </nav>
  
        )
  }
    
  }

export default Adminheader;