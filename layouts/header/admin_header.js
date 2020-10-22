import React from "react"
import Link from 'next/link'
import Dropdown from 'react-bootstrap/Dropdown'
import SignOutIcon from '@atlaskit/icon/glyph/sign-out';
import EditorAlignLeftIcon from '@atlaskit/icon/glyph/editor/align-left';
import Router  from 'next/router';
import HipchatChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import PersonCircleIcon from '@atlaskit/icon/glyph/person-circle';
import {clearStorage, getVendor, getUser, getStaff, getMember} from '../../components/shared/local'
import {USER, MEMBER, STAFF} from '../../components/shared/constant'
import $ from "jquery"
import swal from '@sweetalert/with-react'

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
  $("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });
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
      <nav className="top-nav">
        <div className="d-flex justify-content-between">
        <button className="navbar-toggler d-lg-none" id="menu-toggle">
        <EditorAlignLeftIcon size="xlarge" />  
        </button>
        <div className="search-div">
            <button type="search"><img src="/top-nav-icons/search-icon.png" alt=""></img></button>
            <input type="search" aria-label="Search" name="s" className="global-search" placeholder="Global search" />
        </div>
          <div className="icon-div remove-decoration">
            {/* <img src="/top-nav-icons/notifications.png" alt=""></img> */}
            {/* <HipchatChevronDownIcon /> */}
            <Dropdown className="remove-decoration">
            <Dropdown.Toggle className="ks-dropdown-toogle remove-decoration" as={CustomToggle} id="dropdown-basic">
            <div className="profile-user">
              {user && user.role == "super_admin" && <h4>{ user.email}</h4>} 
              {user && user.role == "admin" && <h4>{ user.email}</h4>}
              {user && user.role == "manager" && <h4>{ staff.surname || '' } {staff.other_names || ''}</h4>}
              {user && user.role == "staff" && <h4>{ staff.surname || '' } {staff.other_names || ''}</h4>}
              {user && user.role == "member" && <h4>{ member.surname || '' } {member.other_names || ''}</h4>}
              <p>{user && user.role.replace('_', ' ')}</p>
            </div>
            </Dropdown.Toggle>

              <Dropdown.Menu className="ks-menu-dropdown bg-white">
                <Dropdown.Divider />
                <Dropdown.Item className="ks-profile-dropdown" onClick={() => Router.push('update-password')}>Change Password</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="ks-profile-dropdown" onClick={() => this.logout()}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {/* <img src="/top-nav-icons/profile circle.png" alt=""></img> */}
            
            <Dropdown className="">
              <Dropdown.Toggle className="ks-dropdown-toogle" as={CustomToggle} id="dropdown-basic">
              <PersonCircleIcon size="xlarge" />
              </Dropdown.Toggle>

              <Dropdown.Menu className="ks-menu-dropdown bg-white">
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