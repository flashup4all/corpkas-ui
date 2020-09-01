import React from "react"
import Link from 'next/link'
import Dropdown from 'react-bootstrap/Dropdown'
import SignOutIcon from '@atlaskit/icon/glyph/sign-out';
import Router  from 'next/router';

class Adminheader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rates: []
    }
  }
  render()
  {
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
      <a
        href=""
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {children}
      </a>
    ));
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
                     
                      <Dropdown className="link">
                          <Dropdown.Toggle className="ks-dropdown-toogle" as={CustomToggle} id="dropdown-basic">
                          <img src="/top-nav icons/profile circle.png" alt=""></img>
                          </Dropdown.Toggle>

                          <Dropdown.Menu className="ks-menu-dropdown bg-white">
                            <Dropdown.Item className="ks-profile-dropdown" onClick={() => Router.push('vendor-profile')}>Profile</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item className="ks-profile-dropdown" onClick={() => Router.push('posts')}>Logs</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item className="ks-profile-dropdown" onClick={() => Router.push('manage-members')}>Change Password</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item className="ks-profile-dropdown" onClick={() => Router.push('vendor-profile')}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>

                      
                    </div>
                    </div>
                </div>
                
            </nav>
  
        )
  }
    
  }

export default Adminheader;