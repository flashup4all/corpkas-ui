import React, { Component } from 'react';
import { createApolloClient } from '../../lib/apolloClient'

import {GET_MEMBER_LOANS} from '../../gql/members'
import Spinner from '@atlaskit/spinner';
import {Badge} from '../../layouts/extras';
import { ShortDate, ShortTime, FormatCurrency } from '../../components/shared/utils';
import EmptyData from '../../layouts/empty';
import Loader from '../../layouts/loader';
import { getUser } from '../../components/shared/local';

class ActiveLoanRequests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            memberData: this.props.memberData,
            loan_type: [],
            repayment_period:'',
            account_credited:'',
            account_no:'',
            amount_credited:'',
            date_approved:'',
            memberLoans:'',
            tableLoader: false,
            user:{}
        }
    }

    componentDidMount()
    {
        this.getMemberActiveLoans(this.state.memberData.id)
        let user = getUser()
        this.setState({user: user})
    }

    getMemberActiveLoans(member_id){
        this.setState({tableLoader: true})
        setTimeout(() => {
            createApolloClient.query({
                query: GET_MEMBER_LOANS,
                variables: {member_id: member_id, status: 1},
              }).then(response => {
                  let {data: {memberLoans}} = response
                  this.setState({
                    memberLoans: memberLoans, 
                    tableLoader: false
                    })
                }, error => {
                this.setState({tableLoader: false})
            })
        },500)
    }

    render()
    {
        const {loan_type, repayment_period, account_credited, account_no, amount_credited, date_approved, memberLoans, tableLoader} = this.state
        const submit = async (e) => {
            e.preventDefault();
            sendFollowUpMessage({variables:{loan_type, repayment_period, account_credited, account_no }})
        }
        return (
            <div className="grey-container">
                {tableLoader && <Loader />}
                { memberLoans && memberLoans.length >0 && !tableLoader && <p className="active-loan">Active Loans</p>}
                    { memberLoans && !tableLoader &&
                        memberLoans.map(loan => {
                            return (
                                <div key={loan.id} className="row mt-5">
                                    <div className="col-md-6 mt-3">
                                        <p className="ks-request-text">Loan request for {FormatCurrency(loan.approved_amount)}</p>
                                        <p className="">This Loan has been approved <Badge type="_success" title="ACTIVE"/></p>
                                    </div>
                                    <div className="col-md-6 mt-3" style={{ textAlign: "end"}}>
                                    <h6 className="ks-request-text">{ShortDate(loan.inserted_at)}</h6>
                                        <p className="">{ShortTime(loan.inserted_at)}</p>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Type of Loan</label>
                                        <div className="control-div">{loan.loan_type.name}</div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Period of Repayment</label>
                                        <div className="control-div">{loan.duration}</div>

                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Loan Amount</label>
                                        <div className="control-div">{FormatCurrency(loan.loan_amount)}</div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Approved Amount</label>
                                        <div className="control-div">{FormatCurrency(loan.approved_amount)}</div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Amount Payable</label>
                                        <div className="control-div">{FormatCurrency(loan.amount_payable)}</div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Amount Paid (Payable)</label>
                                        <div className="control-div">{FormatCurrency(loan.amount_paid) || "0.0"}</div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Balance Payable</label>
                                        <div className="control-div">{FormatCurrency(loan.balance_payable) || "0.0"}</div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Payback Amount</label>
                                        <div className="control-div">{FormatCurrency(loan.payback_amount)}</div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Total Paid</label>
                                        <div className="control-div">{FormatCurrency(loan.total_paid)}</div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label"> Applied Date</label>
                                        <div className="control-div">{ShortDate(loan.inserted_at)}</div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label"> Approved Date</label>
                                        <div className="control-div">{ShortDate(loan.approved_date)}</div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label"> Start Date</label>
                                        <div className="control-div">
                                            { !loan.loan_payment_status && "Not Yet" }
                                            { loan.loan_payment_status && ShortDate(loan.start_date) }
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label"> Due Date</label>
                                        <div className="control-div">
                                            { !loan.loan_payment_status && "Not Yet" }
                                            { loan.loan_payment_status && ShortDate(loan.due_date) }
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Total Paid Loan</label>
                                        <div className="control-div">{loan.total_paid || "Not Yet"}</div>
                                    </div>
                                
                                </div>
                            )
                        })
                    }
                    { memberLoans && memberLoans.length ==0 && !tableLoader &&
                        <div>
                            <EmptyData title="" text=""/>
                            <p className="row align-items-center justify-content-center">You do not have any active loan currently. </p> 
                        </div>
                    }
                    
            </div>
        )
    }
}
export default ActiveLoanRequests;

// const ActiveLoanRequests = ({ memberData }) =>  {
//     const { addToast } = useToasts()


//     const [loan_type, setLoanType] = useState()
//     const [repayment_period, setRepaymentPeriod] = useState()
//     const [account_credited, setAccountCredited] = useState()
//     const [account_no, setAccountNo] = useState()
//     const [amount_credited, setAmountCredited] = useState()
//     const [date_approved, setDateApproved] = useState()
//     const [memberLoans, setmemberLoans] = useState()

   

//     //create staff mutation
//     const {loading, error, data} = useQuery( GET_MEMBER_LOANS, {
//         variables:{member_id: memberData.id, status: 1},
//         onError: (e) => {
//             console.log(error)
            
//         },
//         onCompleted: ({memberLoans}) =>{
//             setmemberLoans(memberLoans)
            
//         }
//     })
    
// }

// export default LoanRequests;