import React, { useEffect } from "react"
import Link from 'next/link'
import Router  from 'next/router';

import HomeIcon from '@atlaskit/icon/glyph/home';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import PeopleIcon from '@atlaskit/icon/glyph/people';
import CreditcardIcon from '@atlaskit/icon/glyph/creditcard';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import DetailViewIcon from '@atlaskit/icon/glyph/detail-view';
import EditIcon from '@atlaskit/icon/glyph/edit';
import UnlockIcon from '@atlaskit/icon/glyph/unlock';
import TrayIcon from '@atlaskit/icon/glyph/tray';
import Dropdown from 'react-bootstrap/Dropdown'
import {clearStorage, getVendor, getUser, getStaff, getMember} from '../../components/shared/local'
import swal from '@sweetalert/with-react'

class SideBarNav extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      user: '',
      staff: '',
      member: '',
      activeMenuIndex: 0
    }
  }

  componentDidMount(){
    let user = getUser()
    let staff = getStaff()
    let member = getMember()
    this.setState({
      user: user,
      staff: staff,
      member: member,
    })
  }

  logout(){
    swal({
      title: "Are you sure?",
      text: "You want to Logout!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((yes) => {
      clearStorage()
      Router.push('/')
    })
  }
  render()
  {
    const { user, member, staff, activeMenuIndex } = this.state
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
            { user.role !== "member" && 
            <div className="sidebar-navigation">
                <ul>
                <li className={activeMenuIndex === 0 ? 'active-side-menu' : 'link'} onClick={() => this.setState({activeMenuIndex: 0})}><Link href="/dashboard"><a><HomeIcon /> <span className="ml-2">Dashboard</span></a></Link></li>
                <li className={activeMenuIndex === 1 ? 'active-side-menu' : 'link'} onClick={() => this.setState({activeMenuIndex: 1})}><Link href="/members"><a><PeopleIcon />  <span className="ml-2">Manage Members</span></a></Link></li>
                <li className={activeMenuIndex === 2 ? 'active-side-menu' : 'link'} onClick={() => this.setState({activeMenuIndex: 2})}><Link href="/transactions"><a><CreditcardIcon /> <span className="ml-2">manage transactions</span></a></Link></li>
                <li className={activeMenuIndex === 3 ? 'active-side-menu' : 'link'} onClick={() => this.setState({activeMenuIndex: 3})}><Link href="/loans"><a><TrayIcon />  <span className="ml-2">Manage Loans</span></a></Link></li>
                <li className={activeMenuIndex === 4 ? 'active-side-menu' : 'link'} onClick={() => this.setState({activeMenuIndex: 4})}><Link href="/vault"><a><CreditcardIcon />  <span className="ml-2">Manage Vault</span></a></Link></li>
                <li className={activeMenuIndex === 5 ? 'active-side-menu' : 'link'} onClick={() => this.setState({activeMenuIndex: 5})}>
                <Dropdown className="link settings-side-menu">
                  <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                  <SettingsIcon /> <span className="ml-2 mr-2">Settings</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="ks-menu-dropdown bg-menu">
                    <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => Router.replace('vendor-profile')}>Cooperative Profile</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => Router.replace('staff')}>Staff Settings</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => Router.replace('/loans/settings')}>Loan Settings</Dropdown.Item>
                    <Dropdown.Divider />
                  </Dropdown.Menu>
                </Dropdown>
                </li>
                        
                </ul>
            </div>
            }    
        { user.role == "member" && 
            <div className="sidebar-navigation">
                <ul>
                <li className={activeMenuIndex === 0 ? 'active-side-menu' : 'link'}><Link href="/members-app"><a><HomeIcon /> <span className="ml-2">Dashboard</span></a></Link></li>
                {/* <li className='link'><Link href="/loans"><a><TrayIcon />  <span className="ml-2">Manage Loans</span></a></Link></li> */}
                <li className={activeMenuIndex === 1 ? 'active-side-menu' : 'link'}><Link href="/update-password"><a><EditIcon />  <span className="ml-2">Update Password</span></a></Link></li>
                <li className={activeMenuIndex === 2 ? 'active-side-menu' : 'link'} onClick={() => this.logout()}><a><UnlockIcon />  <span className="ml-2">Logout</span></a></li>
                        
                </ul>
            </div>
            }    

        </div>
  
        )
  }
    
  }

export default SideBarNav;