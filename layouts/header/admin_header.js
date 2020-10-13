import React from "react"
import Link from 'next/link'
import Dropdown from 'react-bootstrap/Dropdown'
import SignOutIcon from '@atlaskit/icon/glyph/sign-out';
import Router  from 'next/router';
import HipchatChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import PersonCircleIcon from '@atlaskit/icon/glyph/person-circle';
import {clearStorage, getVendor, getUser, getStaff, getMember} from '../../components/shared/local'
import {USER, MEMBER, STAFF} from '../../components/shared/constant'


class Adminheader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      staff: '',
      member: '',
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
componentDidUpdate()
{
  
}
  logout(){
    clearStorage()
    Router.push('/')
  }

  render()
  {
    const { user, member, staff } = this.state
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
      <nav className="top-nav fixed-top">
        <div className="d-flex justify-content-between">
          <div className="search-div">
            <button type="search"><img src="/top-nav-icons/search-icon.png" alt=""></img></button>
            <input type="search" aria-label="Search" name="s" className="global-search" placeholder="Global search" />
          </div>
          <div className="icon-div">
            {/* <img src="/top-nav-icons/notifications.png" alt=""></img> */}
            {/* <HipchatChevronDownIcon /> */}
            <div className="profile-user">
              {user && user.role == "super_admin" && <h4>{ user.email}</h4>} 
              {user && user.role == "admin" && <h4>{ staff.surname || '' } {staff.other_names || ''}</h4>}
              {user && user.role == "manager" && <h4>{ staff.surname || '' } {staff.other_names || ''}</h4>}
              {user && user.role == "staff" && <h4>{ staff.surname || '' } {staff.other_names || ''}</h4>}
              {user && user.role == "member" && <h4>{ member.surname || '' } {member.other_names || ''}</h4>}
              <p>{user && user.role.replace('_', ' ')}</p>
            </div>
            {/* <img src="/top-nav-icons/profile circle.png" alt=""></img> */}
            
            <Dropdown className="link">
              <Dropdown.Toggle className="ks-dropdown-toogle" as={CustomToggle} id="dropdown-basic">
              <PersonCircleIcon size="xlarge" />
              </Dropdown.Toggle>

              <Dropdown.Menu className="ks-menu-dropdown bg-white">
                <Dropdown.Item className="ks-profile-dropdown" onClick={() => Router.push('user-profile')}>Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="ks-profile-dropdown" onClick={() => Router.push('logs')}>Logs</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="ks-profile-dropdown" onClick={() => Router.push('update-password')}>Change Password</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="ks-profile-dropdown" onClick={() => this.logout()}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </nav>
        )
  }
    
  }

export default Adminheader;