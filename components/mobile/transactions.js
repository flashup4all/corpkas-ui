import React, { Component } from 'react';
import { useQuery, gql } from '@apollo/client';
import { createApolloClient } from '../../lib/apolloClient'
import WatchIcon from '@atlaskit/icon/glyph/watch';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
// import { onError } from "apollo-link-error";

import Dropdown from 'react-bootstrap/Dropdown'
import EmptyData from '../../layouts/empty';
import Loader from '../../layouts/loader';
import Pagination from '@atlaskit/pagination';
import { GET_MEMBER_TXNS, GET_MEMBER } from '../../gql/members';
import { FILTER_TRANSACTION, APPROVE_TRANSACTION, CREATE_TRANSACTION } from '../../gql/transactions';
import { CustomToggle, Status, Badge } from '../../layouts/extras'
import { page_range } from '../shared/utils'
import { getMember, getUser } from '../shared/local'
import swal from '@sweetalert/with-react'
import { ShortDate, ShortTime, MonthYear, FormatCurrency } from '../../components/shared/utils';
import SendIcon from '@atlaskit/icon/glyph/send';
import CreditcardIcon from '@atlaskit/icon/glyph/creditcard';

class MembersTransactions extends Component {
    constructor(props) {
        super(props);
        // setMode 0 = default, 1- create, 2- update 
        this.state = {
            memberData: this.props.memberData,
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
            txn_loader: false,
            txnType:'',
            txnAmount:'',
            txnNaration:''


        }
    }

    componentDidMount()
    {
        let member = getMember()
        this.getMemberTxn(member.id)
        // this.filterTxn({member_id: this.state.memberData.id, status: 1})
    }

    getMemberTxn(id, page = 1)
    {
        createApolloClient.query({
            query: GET_MEMBER_TXNS,
            variables: {member_id: id, page}
          }).then(response => {
            const {data: {memberTransactions}} = response
              this.setState({
                  transactions: memberTransactions.entries, 
                  sorted: memberTransactions.entries,
                  totalEntries: memberTransactions.total_entries,
                  totalPages: memberTransactions.total_pages,
                  pageNumber: memberTransactions.page_number,
                  pageSize: memberTransactions.page_size,

                })
            }, error => console.log(error))
    }

    filterTxn(variables){
        createApolloClient.mutate({
            mutation: FILTER_TRANSACTION,
            variables: variables
        }).then(response => {
            const { data: {filterTransactions}} =  response
            console.log(filterTransactions)
         //    let result = response.data.filterStaff
            this.setState({
                 transactions: filterTransactions, 
                 sorted: filterTransactions,
                 totalEntries: 0,
                 totalPages: 0,
                 pageNumber: 0,
                 pageSize: 0,
 
             })
        }, (error)=> console.log(error)) 
    }

    render(){
        const { transactions, memberData} = this.state
        return (
            <>
            {/* <h3 className="date-h3">04 Sep 2020</h3> */}
            {transactions && transactions.map((txn, index) => {
                return (
                    <div key={index}>
                    <div  className="row bg-gray pt-3 pb-2">
                        <div className="col-7 d-flex">
                            <div>
                            {txn.txn_type == 1 && <p className="txn-widget-icon bg-success"><SendIcon primaryColor="white"/></p>}
                            {txn.txn_type == 2 && <p className="txn-widget-icon bg-danger"><CreditcardIcon primaryColor="white"/> </p>}
                            
                            </div>
                            <div className="pl-3">
                                <h2 className="bold-h2">Monthly Contribution</h2>
                                <h3 className="date-h3">{ShortDate(txn.inserted_at)}</h3>
                            </div>
                        </div>
                        <div className="col-5 ml-0 text-right">
                            <h3 className="green-figure">+ {FormatCurrency(txn.amount)}</h3>
                        </div>
                    </div>
                    <p className="gray-border"></p>
                    </div>
                )
            })}
            </>
        )
    }
}
export default MembersTransactions;
