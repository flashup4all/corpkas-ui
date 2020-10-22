import React, { Component } from 'react';
import { createApolloClient } from '../../lib/apolloClient'

import Dropdown from 'react-bootstrap/Dropdown'
import EmptyData from '../../layouts/empty';
import Loader from '../../layouts/loader';
import Pagination from '@atlaskit/pagination';
import { FILTER_TRANSACTION, GET_MEMBER_TOTALS, GET_MEMBER } from '../../gql/members';
import { CustomToggle, Status, Badge } from '../../layouts/extras'
import { page_range } from '../../components/shared/utils'
import MobileLayout from '../../layouts/mobile';
import Loans from '../../components/loans/loans';
import CreditcardIcon from '@atlaskit/icon/glyph/creditcard';
import BulletListIcon from '@atlaskit/icon/glyph/bullet-list';
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';
import { getUser, getMember } from '../../components/shared/local'
import { ShortDate, ShortTime, FormatCurrency } from '../../components/shared/utils';
import MembersTransactions from '../../components/mobile/transactions';
import LoanRequests from '../../components/members/loan-requests';
import ActiveLoans from '../../components/members/active-loans';
import MobileLoanHistory from '../../components/mobile/loan-requests-history';


class MembersDashboard extends Component {
    constructor(props) {
        super(props);
        // setMode 0 = default, 1- create, 2- update 
        this.state = {
            member: {},
            transactions: [],
            memberTotals: {},
            pageNumber: 1,
            pageSize: 0,
            totalEntries: 0,
            totalPages: 0,
            sorted: [],
            setMode: 0,
            activeWidget: '',
            filter_status: '',
            filter_from: '',
            filter_to: '',
            filter_txn_id: '',
            filter_txn_type: '',
            tabIndex:0,
            tabIconColor:"white"
        }
    }

    componentDidMount()
    {
       let member = getMember()
       this.getMember(member.id)
    }

    setTab(index){
        this.setState({tabIndex: index})
    }
    getMemberTotals()
    {
        createApolloClient.query({
            query: GET_MEMBER_TOTALS,
          }).then(response => {
              this.setState({memberTotals: response.data.memberTotals})
            }, error => console.log(error))
    }
    getMember(id)
    {
        createApolloClient.query({
            query: GET_MEMBER,
            variables: {id : id}
          }).then(response => {
              this.setState({member: response.data.findMember})
            }, error => console.log(error))
    }
    render () {
      
        const {member, tabIndex, tabIconColor, transactions, sorted, setMode, activeWidget, totalPages, memberTotals, filter_from, filter_to, filter_status, filter_txn_id, filter_txn_type } = this.state
        
        return (
            <div>
<div className="main-con">
            <div>
                <h3 className="greeting-text">Good evening, {member.surname}</h3>
                <div className="main-log-card mx-0 mb-5 bg-gray">
                    <div className="row pb-2">
                        <div className="log-card pl-4 col-9">
                            <p>Available Balance</p>
                            <h1>{FormatCurrency(member.current_balance)}</h1>
                            <p>A/C Name: <span style={{fontWeight: "bold"}}>{member.surname} {member.other_names}</span></p>
                            <p style={{marginBottom: "16px"}}>Staff No.: 
                            <span style={{fontWeight: "bold"}}>{member.staff_no}</span></p>
                            {/* <p className="d-flex"><span className="activated">activated</span> <span className="active-loans">active
                                    loans: 1</span>
                            </p> */}
                        </div>
                        <div className="log-card_img col-3 d-flex align-items-center px-0">
                        { member.avatar ?
                            <img src={member.avatar_url} alt=""  style={{width:'60px', height:'60px', borderRadius: '50%'}}></img>
                            :
                            <img src="/cards-icons/avata.png" width="48px" height="48px" alt=""></img>
                        }
                        </div>
                    </div>
                </div>
                <div className="sub-menu d-flex justify-content-around">
                    <div className={tabIndex == 0 ? 'active-mobile-tab' : 'inactive-mobile-tab'} onClick={() => this.setTab(0)}>
                        <AppSwitcherIcon primaryColor={tabIconColor} />
                        <h3>Transactions</h3>
                    </div>
                    <div className={tabIndex == 1 ? 'active-mobile-tab' : 'inactive-mobile-tab'} onClick={() => this.setTab(1)}>
                        <img src="/cards-icons/trending_up_white.png" alt="" />
                        <h3>Loan Requests</h3>
                    </div>
                    <div className={tabIndex == 2 ? 'active-mobile-tab' : 'inactive-mobile-tab'} onClick={() => this.setTab(2)}>
                        <CreditcardIcon primaryColor={tabIconColor} />
                        <h3>Active Loans</h3>
                    </div>
                    <div className={tabIndex == 3 ? 'active-mobile-tab' : 'inactive-mobile-tab'} onClick={() => this.setTab(3)}>
                        <BulletListIcon primaryColor={tabIconColor} />
                        <h3>Loan History</h3>
                    </div>
                </div>
                {tabIndex == 0 && 
                    <div>
                        <MembersTransactions memberData={member}/>
                    </div>
                }
                {tabIndex == 1 && 
                    <div>
                        <LoanRequests memberData={member}/>
                    </div>
                }
                {tabIndex == 2 && 
                    <div>
                        <ActiveLoans memberData={member}/>
                    </div>
                }
                {tabIndex == 3 && 
                    <div>
                        <MobileLoanHistory memberData={member}/>
                    </div>
                }


                
            </div>
        </div>
            </div>

        )
        }
}

MembersDashboard.layout = MobileLayout
export default MembersDashboard;
