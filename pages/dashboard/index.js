import React, { Component } from 'react';
import { useQuery, gql } from '@apollo/client';
import { createApolloClient } from '../../lib/apolloClient'
import WatchIcon from '@atlaskit/icon/glyph/watch';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';

import Dropdown from 'react-bootstrap/Dropdown'
import EmptyData from '../../layouts/empty';
import Loader from '../../layouts/loader';
import Pagination from '@atlaskit/pagination';
import { FILTER_TRANSACTION, GET_TRANSACTIONS } from '../../gql/transactions';
import { CustomToggle, Status, Badge } from '../../layouts/extras'
import { page_range } from '../../components/shared/utils'
import AdminMainLayout from '../../layouts/main/main';
import Loans from '../../components/loans/loans';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        // setMode 0 = default, 1- create, 2- update 
        this.state = {
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
            filter_txn_type: ''
        }
    }

    componentDidMount()
    {
       
    }
    render () {
      
        const {transactions, sorted, setMode, activeWidget, totalPages, memberTotals, filter_from, filter_to, filter_status, filter_txn_id, filter_txn_type } = this.state
        
        return (
            <div>

                    <div className="widget-heading d-flex justify-content-between align-items-baseline">
                    <h3 className=" manage-members">Dashboard</h3>
                    </div>
                    <div className="row">
                        <div className="dash-widget">
                            <div>
                            <p className="widget-p-dark"> <img src="/cards-icons/retry-icon.png" alt=""></img>  Pending Contributions
                            </p>
                            <h1>1,362</h1>
                            <p className="widget-p-light"> <span className="widget-span teal-span">+ 2.41%</span> From previous record</p>
                            </div>
                        </div>
                        <div className="dash-widget">
                            <div>
                            <p className="widget-p-dark"> <img src="/cards-icons/retry-icon.png" alt=""></img> Pending Loans
                            </p>
                            <h1>272</h1>
                            <p className="widget-p-light"> <span className="widget-span teal-span">+ 2.41%</span> From previous record</p>
                            </div>
                        </div>
                        <div className="dash-widget">
                            <div>
                            <p className="widget-p-dark"> <img src="/cards-icons/retry-icon.png" alt=""></img> Active Loans
                            </p>
                            <h1>362</h1>
                            <p className="widget-p-light"> <span className="widget-span red-span">+ 2.41%</span> From previous record</p>
                            </div>
                        </div>
                        <div className="dash-widget">
                            <div>
                            <p className="widget-p-dark"> 
                            <img src="/cards-icons/retry-icon.png" alt=""></img>
                                Pending Withdrawals
                            </p>
                            <h1>362</h1>
                            <p className="widget-p-light"> <span className="widget-span teal-span">+ 2.41%</span> From previous record</p>
                            </div>
                        </div>
                    </div>

                    <div className="sheets mt-5 row">
                        <div className="graph-con col-lg-8">
                        <div className="graph-heading row">
                        <div className="col-7">
                            <h1>This month’s trends</h1>
                            <p>as of 15 Aug 2020, 07:47 PM</p>  
                        </div>
                        <div className="col-5" style={{marginTop: "1.375em"}}>
                            <p><span>This month</span> <span>Last month</span></p>
                        </div>
                        
                        </div>
                        <div className="graph">
                        

                        </div>

                        </div>
                        <div className="additional-info col-lg-4 pl-0 pr-0">
                        <div className="additional-info-border-bottom ">
                            <h2>New members</h2>
                            <h1>419</h1>
                        </div>

                        <div  className="additional-info-border-bottom ">
                            <h2>Active members</h2>
                            <h1>419</h1>
                        </div>
                        
                        <div  className="additional-info-border-bottom ">
                            <h2>Inactive members</h2>
                            <h1>419</h1>
                        </div>
                        
                        {/* <div className="additional-info-border-bottom ">
                            <h2>New members</h2>
                            <h1>419</h1>
                        </div> */}
                        <div >
                            <h2>New members</h2>
                            <h1>419</h1>
                        </div>
                        
                        
                    
                        </div>

                    </div>
                    <p className="component-title mb-4"> Loans</p>


                <Loans showSearch={false} />

            </div>

        )
        }
}

Dashboard.layout = AdminMainLayout
export default Dashboard;
