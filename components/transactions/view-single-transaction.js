import React, { Component } from 'react';
import { useQuery, gql } from '@apollo/client';
import { createApolloClient } from '../../lib/apolloClient'
import Loader from '../../layouts/loader';

import { GET_PAGINATE_MEMBERS, GET_MEMBER_TOTALS } from '../../gql/members';
import { Badge, Status } from '../../layouts/extras'
import { ShortDate, MonthYear, FormatCurrency } from '../../components/shared/utils';

class ViewSingleTransaction extends Component {
    constructor(props) {
        super(props);
        // setMode 0 = default, 1- create, 2- update 
        this.state = {
            txn: props.transaction,
            loader: true,
        }
    }

    componentDidMount()
    {
        setTimeout(() => {
            this.setState({loader: false})
        },300)
    }

    render () {
    const {txn, loader } = this.state
      
    return (
        <div>
            { loader && <Loader />}
            { txn !== null && !loader &&
                <div className="row p-4">
                    <div className="col-6">
                        <li className="li-item ">Date</li>
                        <li className="li-item ">Transaction Type</li>
                        <li className="li-item ">Staff no.</li>
                        <li className="li-item">Full Name</li>
                        <li className="li-item">Amount</li>
                        <li className="li-item">Naration</li>
                        <li className="li-item">Posted</li>
                        <li className="li-item">Approved By</li>
                        <li className="li-item">Txn Status</li>
                    </div>
                    <div className="col-6 text-right">
                        <li className="li-item bold-li">{ShortDate(txn.inserted_at)}</li>   
                        <li className="li-item bold-li">
                            {txn.txn_type == 1 ? <Badge type='success' title='SAVINGS'/> : <Badge type='moved' title='WITHDRAW'/>}
                        </li>   
                        <li className="li-item bold-li">{txn.members.staff_no}</li>   
                        <li className="li-item bold-li">{txn.members.surname} {txn.members.first_name} {txn.members.other_names}</li> 
                        <li className="li-item bold-li">{FormatCurrency(txn.amount)}  </li>
                        <li className="li-item bold-li">{txn.naration || 'No description'}</li>
                        <li className="li-item bold-li">{txn.posted.surname}  {txn.posted.other_names}</li>
                        {txn.approved !== null ? <li className="li-item bold-li">{txn.approved.surname} {txn.approved.first_name} {txn.approved.other_names}</li> : <li className="li-item bold-li">Not yet Approved </li>}
                        <li className="li-item bold-li">
                            <Status status={txn.status} />
                        </li>   
                    </div>
                </div>
            }
        </div>
                

    )
}
};

export default ViewSingleTransaction;
