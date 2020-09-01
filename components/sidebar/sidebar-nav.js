import React, { useEffect } from "react"
import Link from 'next/link'
import Router  from 'next/router';

import HomeIcon from '@atlaskit/icon/glyph/home';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import PeopleIcon from '@atlaskit/icon/glyph/people';
import CreditcardIcon from '@atlaskit/icon/glyph/creditcard';
import DetailViewIcon from '@atlaskit/icon/glyph/detail-view';
import TrayIcon from '@atlaskit/icon/glyph/tray';
import Dropdown from 'react-bootstrap/Dropdown'

class SideBarNav extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      rates: [],
      name: ''
    }
  }

  componentDidMount(){
    
  }

  render()
  {

    const { name } = this.state
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
      <div className="sidebar-navigation" id="sidebar-wrapper">
                {/* <div className="sidebar-heading">Start Bootstrap </div> */}
            <div className="sidebar-navigation">
                <ul>
                <li className='link'><Link href="/"><a><HomeIcon /> <span className="ml-2">Dashboard</span></a></Link></li>
                       <li className='link'><Link href="/manage-members"><a><PeopleIcon /> Manage Members</a></Link></li>
                        <li className='link'><Link href="/users"><a><CreditcardIcon />manage transactions</a></Link></li>
                        <li className='link'><Link href="#"><a><DetailViewIcon />contribution history</a></Link></li>
                        <li className='link'><Link href="/loans"><a><TrayIcon /> Manage Loans</a></Link></li>
                        <li className='link'>
                        <Dropdown className="link">
                          <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                          <SettingsIcon /> <span className="ml-2 mr-2">Settings</span>
                          </Dropdown.Toggle>

                          <Dropdown.Menu className="ks-menu-dropdown bg-menu">
                            <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => Router.push('vendor-profile')}>Cooperative Profile</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => Router.push('posts')}>Staff Settings</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => Router.push('manage-members')}>Loan Settings</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => Router.push('vendor-profile')}>Transaction Settings</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => Router.push('vendor-profile')}>Notification Settings</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        </li>
                        
                        
                </ul>
            </div>
        </div>
  
        )
  }
    
  }

export default SideBarNav;