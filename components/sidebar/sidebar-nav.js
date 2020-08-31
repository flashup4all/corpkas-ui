import React from "react"
import Link from 'next/link'

class SideBarNav extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rates: [],
      name: ''
    }
  }
  render()
  {
    const { name } = this.state
    return ( 
      <div className="sidebar-navigation" id="sidebar-wrapper">
                {/* <div className="sidebar-heading">Start Bootstrap </div> */}
            <div className="sidebar-navigation">
                <ul>
                <li className='link'><Link href="/"><a><span className="aui-icon aui-icon-small aui-iconfont-home-filled">Home</span>Dashboard</a></Link></li>
                       <li className='link'><Link href="/manage-members"><a><img src="/sidebar-icons/manage.png" alt=""></img>Manage Members</a></Link></li>
                        <li className='link'><Link href="/users"><a><img src="/sidebar-icons/transactions.png" alt=""></img>manage transactions</a></Link></li>
                        <li className='link'><Link href="#"><a><img src="/sidebar-icons/history.png" alt=""></img>contribution history</a></Link></li>
                        <li className='link'><Link href="/loans"><a><img src="/sidebar-icons/loans.png" alt=""></img>Manage Loans</a></Link></li>
                        <li className='link'><Link href="#"><a><img src="/sidebar-icons/settings.png" alt=""></img> settings <img src="/sidebar-icons/arrow-down.png" alt="" className="ml-2 settings"></img></a></Link></li>
                </ul>
            </div>
        </div>
  
        )
  }
    
  }

export default SideBarNav;