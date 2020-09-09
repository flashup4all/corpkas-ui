import React, { useEffect } from "react"
import Link from 'next/link'
import Router  from 'next/router';

import HomeIcon from '@atlaskit/icon/glyph/home';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import PeopleIcon from '@atlaskit/icon/glyph/people';
import CreditcardIcon from '@atlaskit/icon/glyph/creditcard';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
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
        <div className=""><ChevronDownIcon /></div>
      </a>
    ));

    
    
    return ( 
      <div className="sidebar-navigation" id="sidebar-wrapper">
                {/* <div className="sidebar-heading">Start Bootstrap </div> */}
            <div className="sidebar-navigation">
                <ul>
                <li className='link'><Link href="/"><a><HomeIcon /> <span className="ml-2">Dashboard</span></a></Link></li>
                       <li className='link'><Link href="/manage-members"><a><PeopleIcon />  <span className="ml-2">Manage Members</span></a></Link></li>
                        <li className='link'><Link href="/users"><a><CreditcardIcon /> <span className="ml-2">manage transactions</span></a></Link></li>
                        <li className='link'><Link href="#"><a><DetailViewIcon /> <span className="ml-2">contribution history</span></a></Link></li>
                        <li className='link'><Link href="/loans"><a><TrayIcon />  <span className="ml-2">Manage Loans</span></a></Link></li>
                        <li className='link'>
                        <Dropdown className="link settings-side-menu">
                          <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                          <SettingsIcon /> <span className="ml-2 mr-2">Settings</span>
                          </Dropdown.Toggle>

                          <Dropdown.Menu className="ks-menu-dropdown bg-menu">
                            <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => Router.push('vendor-profile')}>Cooperative Profile</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => Router.replace('staff')}>Staff Settings</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => Router.replace('/loans/settings')}>Loan Settings</Dropdown.Item>
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