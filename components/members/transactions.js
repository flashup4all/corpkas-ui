import React, { Component } from 'react';
import { useQuery, gql } from '@apollo/client';
import { createApolloClient } from '../../lib/apolloClient'
import WatchIcon from '@atlaskit/icon/glyph/watch';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import ViewSingleTransaction from '../../components/transactions/view-single-transaction';

import Dropdown from 'react-bootstrap/Dropdown'
import EmptyData from '../../layouts/empty';
import Loader from '../../layouts/loader';
import Pagination from '@atlaskit/pagination';
import { GET_MEMBER_TXNS, GET_MEMBER } from '../../gql/members';
import { FILTER_TRANSACTION, APPROVE_TRANSACTION, CREATE_TRANSACTION } from '../../gql/transactions';
import { CustomToggle, Status, Badge } from '../../layouts/extras'
import { page_range } from '../shared/utils'
import { getStaff, getUser } from '../shared/local'
import swal from '@sweetalert/with-react'
import { ShortDate, ShortTime, MonthYear, FormatCurrency } from '../../components/shared/utils';

class Transactions extends Component {
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
            txnNaration:'',
            tableLoader: false,
            selectedTxn: {},
            txnFormTitle: "Make a Contribution/Savings"
        }
    }

    componentDidMount()
    {

        this.getMemberTxn()
        console.log(getStaff())
        // this.getMemberTotals()
    }

    getMemberTxn(page = 1)
    {
        console.log('refesh')
        setTimeout(() => {
            createApolloClient.query({
                query: GET_MEMBER_TXNS,
                variables: {member_id: this.state.memberData.id, page}
              }).then(response => {
                const {data: {memberTransactions}} = response
                  this.setState({
                      transactions: memberTransactions.entries, 
                      sorted: memberTransactions.entries,
                      totalEntries: memberTransactions.total_entries,
                      totalPages: memberTransactions.total_pages,
                      pageNumber: memberTransactions.page_number,
                      pageSize: memberTransactions.page_size,
                    tableLoader: false
                    })
                }, error => {
                    this.setState({tableLoader: false})
                })
        },500)
        this.setState({tableLoader: true})
        
    }
    // getMemberTotals(page = 1)
    // {
    //     createApolloClient.query({
    //         query: GET_MEMBER_TOTALS,
    //       }).then(response => {
    //           this.setState({memberTotals: response.data.memberTotals})
    //         }, error => console.log(error))
    // }
    
    paginate = (e, page, analyticsEvent) => {
        this.getMemberTxn(page)
    }
    
    approveTransaction(txn){
        swal({
            title: "Are you sure?",
            text: "Once Approved, cannot be undone!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                createApolloClient.mutate({
                    mutation: APPROVE_TRANSACTION,
                    variables: {id: txn.id, status: 1, approved_by: parseInt(getStaff().id)},
                    refetchQueries:[{query: GET_MEMBER_TXNS, variables:{member_id: this.state.memberData.id, page:1}}, {query:GET_MEMBER, variables:{id: this.state.memberData.id}}]
                }).then(response => {
                    const {data: {approveTransactions}} = response
                    this.getMemberTxn()
                    this.props.onrefreshMember();

                    // this.props.handleClick
                    swal("Transaction Processed", {
                        icon: "success",
                    });
                    }, error => console.log(error))
              
            } else {
              return;
            }
        });
    }
    
    showMakeTransactionForm(txnType){
        txnType == 1? this.setState({setMode: 2, txnType: txnType, txnFormTitle: "Make a Contribution/Savings"}) : this.setState({setMode: 2, txnType: txnType, txnFormTitle: "Make a Withdrawal"})
    }
    validTransaction(){
        const {txnType, txnAmount, txnNaration, memberData} = this.state 
        return (txnAmount)
    }
    makeTransactionForm(){
        this.setState({txn_loader: true})
        const {txnType, txnAmount, txnNaration, memberData} = this.state 

        swal({
            title: "Are you sure?",
            text: "Transaction cannot be undone!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
            .then((yes) => {
                if (yes) {
                    createApolloClient.mutate({
                        mutation: CREATE_TRANSACTION,
                        variables:{
                            naration: txnNaration, 
                            txn_type: txnType,
                            amount: parseFloat(txnAmount), 
                            member_id: memberData.id, 
                            posted_by: parseInt(getStaff().id),
                            payment_channel: "web"
                        },
                        refetchQueries:[{query: GET_MEMBER_TXNS, variables:{member_id: this.state.memberData.id, page:1}}]
                    // refetchQueries:() => {
                        //     return (
                        //         [{
                        //             query: GET_MEMBER_TXNS,
                        //             variables: {member_id: this.state.memberData.id, page: 1},
                        //           }]
                        //     )
                        // }
                    }).then(response => {
                        let {data: {createTransaction}} = response
                        this.setState({
                            txnType: '', txnAmount: '', txnNaration:'', setMode:0, txn_loader:false
                        })
                        this.getMemberTxn()
                        // this.props.onrefreshMember();
                        swal("Contribution was Successful! awaiting approval", {
                            icon: "success",
                        });

                }, (error) => {
                    this.setState({txn_loader: false})
                })
                }
            })
    }
    render () {
        const { selectedTxn, tableLoader, transactions, sorted, setMode, activeWidget, totalPages, filter_from, filter_to, filter_status, filter_txn_id } = this.state

        const filter_form = () => {

            let variables = {}
            if(filter_from || filter_status)
            {
                filter_from ? variables.from = new Date(filter_from)  : null
                filter_to ? variables.to = new Date(filter_to)  : null
                filter_status ? variables.status = parseInt(filter_status) : null
                variables.member_id =  this.state.memberData.id
               createApolloClient.mutate({
                   mutation: FILTER_TRANSACTION,
                   variables: variables
               }).then(response => {
                   const { data: {filterTransactions}} =  response
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
        }
        const validTransaction = () =>{
            const {txnType, txnAmount, txnNaration, memberData} = this.state 
            return (txnAmount)
        }

        const viewTxn = (txn) => {
            console.log(txn)
            this.setState({selectedTxn: txn, setMode: 3})
        }
    return (
        <div>
        {tableLoader && <Loader />}
        <div className="">
        {setMode === 0 && !tableLoader &&
            <>
        <div className="bg-grey">
            <p className="transaction-header">Transaction Details</p>
             <div style={{padding:'20px'}}>
                 
                 <div className="row">
                
                 <div className="col-md-2 ks-col">
                        <label>Txn ID</label>
                        <input type="text" name="search" 
                        className="mini-search form-control ks-form-control" 
                        placeholder="TransactionID"
                        value={filter_txn_id || ""}
                        onChange={({ target }) => this.setState({filter_txn_id: target.value})}
                        ></input>
                    </div>
                    <div className="col-md-3 ks-col">
                        <label>From Date</label>
                        <input type="date" name="search" 
                        className="mini-search form-control ks-form-control" 
                        placeholder="Search"
                        value={filter_from || ""}
                        onChange={({ target }) => this.setState({filter_from: target.value})}
                        ></input>
                    </div>
                    <div className="col-md-3 ks-col">
                        <label>To Date</label>
                        <input type="date" name="search" 
                        className="mini-search form-control ks-form-control" 
                        placeholder="Search"
                        value={filter_to || ""}
                        onChange={({ target }) => this.setState({filter_to: target.value})}
                        ></input>
                    </div>
                    <div className="col-md-2">
                        <label>Status</label>
                        <select className="ks-form-control form-control" 
                            value={filter_status || ""}
                            onChange={({ target }) => this.setState({filter_status: target.value})}
                            >
                            <option value="">Status</option>
                            <option value="1">Approved</option>
                            <option value="0">Pending</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <button type="button" className="btn float-right mt-4" onClick={()=> filter_form()}>Filter</button>
                    </div>
                    <div className="col-md-12 ks-col">
                        <button type="button" className="btn btn-danger float-right mt-4 ml-3" onClick={()=> this.showMakeTransactionForm(2)}>Withdraw</button>
                        <button type="button" className="btn btn-secondary float-right mt-4" onClick={()=> this.showMakeTransactionForm(1)}>Contribute</button>
                    </div>
                 </div>
             

             <div className="table-responsive p-3">
                 { sorted.length > 0 &&
                 <div>
                 <table className="table table-borderless">
                 <thead>
                 <tr>
                     <th>&#x23;</th>
                     <th>Approved by</th>
                     {/* <th>Rank</th> */}
                     <th>Posted by</th>
                     <th>Transaction Type</th>
                     <th>&#8358; Amount</th>
                     <th>Status</th>
                     <th>Date</th>
                     <th>Actions</th>
                 </tr>
                 </thead>
                 <tbody>
                 { sorted.map((txn, index) => (
                 <tr key={index}>
                     <td>{index + 1}</td>
                     <td>{ txn.approved ? txn.approved.surname + " " + txn.approved.other_names : "Not Yet Approved"}</td>
                     {/* <td>{txn.rank}</td> */}
                     <td>{ txn.posted.surname } { txn.posted.other_names }</td>
                     <td>
                        {txn.txn_type == 1 ? <Badge type='success' title='SAVINGS'/> : <Badge type='moved' title='WITHDRAW'/>}
                    </td>
                     <td>{FormatCurrency(txn.amount)}</td>
                     <td className={txn.status}>
                          <Status status={txn.status} />
                    </td>
                    <td className={txn.status}>
                         {MonthYear(txn.inserted_at)}
                    </td>
                     <td>
                     <Dropdown className="drop-link">
                        <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="ks-menu-dropdown bg-menu">
                            <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => viewTxn(txn)}>View Txn</Dropdown.Item>
                            <Dropdown.Divider />
                            {txn.status === 0 && <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => this.approveTransaction(txn)}>Approve</Dropdown.Item>}
                        </Dropdown.Menu>
                        </Dropdown>
                     </td>
                 </tr>
                  ))}
                
                 </tbody>
             </table>
             { totalPages > 1 && 
                <div className="row align-items-center justify-content-center">
                <Pagination onChange={(event, page, analyticsEvent) => this.paginate(event, page, analyticsEvent)} pages={page_range(1,totalPages)} />
                </div>
             }
                
             </div>
                 }
                 { sorted && !sorted.length && 
                     <EmptyData title="Empty Transaction" text="No Available Transaction"/>
                 } 
                 { !sorted
                     &&
                    <Loader />
                 }
             
             </div>
         </div>
         </div>
         </>
        }
        {
            setMode === 1 &&
            <div className="p-4">
                <p className="page-title mt-5">Print Transaction
                    <span onClick={() => this.setState({setMode: 0})} className="float-right close-button">Close <CrossCircleIcon primaryColor="#FF7452" /></span>
                </p>
                <span>Print Transaction</span>
            </div>
        }
        {setMode === 2 &&
        <div className="bg-grey">
            <div style={{padding:'20px'}}>
                 <p className="page-title mt-5">Make a Contribution/Saving
                    <span onClick={() => this.setState({setMode: 0})} className="float-right close-button">Close <CrossCircleIcon primaryColor="#FF7452" /></span>
                </p>
                <div className="row mt-4">
                    <div className="col-md-6 ks-col">
                        <label>Amount</label>
                        <input name="search" 
                        className="mini-search form-control ks-form-control" type="number"
                        placeholder="100000"
                        onChange={({ target }) => this.setState({txnAmount: target.value})}
                        ></input>
                    </div>
                    <div className="col-md-6 ks-col">
                        <label>Narration</label>
                        <input name="search" 
                        className="mini-search form-control ks-form-control" 
                        placeholder="Naration"
                        onChange={({ target }) => this.setState({txnNaration: target.value})}
                        ></input>
                    </div>
                    <div className="col-md-12">
                    <button type="button" disabled={!validTransaction()} className="btn btn-secondary float-right mt-4" onClick={()=> this.makeTransactionForm()}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
        }
        {
            setMode === 3 &&
            <div className="p-4">
                <div className="row justify-content-center">
                <div className="col-8">
                    <div className="confirm-con pt-5" >
                    <p className="page-title p-4"># 000{selectedTxn.id}
                        <span onClick={() => this.setState({setMode: 0})} className="float-right close-button">Close <CrossCircleIcon primaryColor="#FF7452" /></span>
                    </p>
                        {/* <h3 className="close-btn">
                            Close <img src="./images/members-mobile-veiw/cross-circle.png" alt="" />
                        </h3> */}
                        <ViewSingleTransaction transaction={selectedTxn} />
                    </div>
                </div>
            
            </div>
            </div>
        }
        </div>
        </div>

    )
}};

export default Transactions;
