import React from "react"
import Link from 'next/link'
import {withRouter}  from 'next/router';

import HomeIcon from '@atlaskit/icon/glyph/home';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import PeopleIcon from '@atlaskit/icon/glyph/people';
import CreditcardIcon from '@atlaskit/icon/glyph/creditcard';
import DetailViewIcon from '@atlaskit/icon/glyph/detail-view';
import TrayIcon from '@atlaskit/icon/glyph/tray';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';

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
  
  gotoRoute = () => {
    console.log('goto')
    // this.props.router.push('/posts')
    // this.router.push("post")
  }


  render()
  {

    const { name } = this.state

    
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
                        <li className='link'><Link href="#">
                        <DropdownMenu trigger="settings" triggerType="button"><a>
                            <SettingsIcon /> 
                            <span className="ml-2">settings </span>
                            
                              <DropdownItemGroup>
                                <DropdownItem id="sydney" onClick={() => this.gotoRoute()}>Sydney</DropdownItem>
                                <DropdownItem id="melbourne">Melbourne</DropdownItem>
                              </DropdownItemGroup>
                            
                        </a>
                        </DropdownMenu></Link></li>
                        
                </ul>
            </div>
        </div>
  
        )
  }
    
  }

export default SideBarNav;