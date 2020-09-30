import React, { useState } from 'react';
import { gql, useMutation, useLazyQuery, useQuery } from '@apollo/client';
import {GET_MEMBER_LOANS} from '../../gql/members'
import Spinner from '@atlaskit/spinner';
import { ToastProvider, useToasts } from 'react-toast-notifications'
import {Badge} from '../../layouts/extras';
import { ShortDate, ShortTime, FormatCurrency } from '../../components/shared/utils';


// export class extends Component {

// }
const LoanRequests = ({ memberData }) =>  {
    const { addToast } = useToasts()


    const [loan_type, setLoanType] = useState()
    const [repayment_period, setRepaymentPeriod] = useState()
    const [account_credited, setAccountCredited] = useState()
    const [account_no, setAccountNo] = useState()
    const [amount_credited, setAmountCredited] = useState()
    const [date_approved, setDateApproved] = useState()
    const [memberLoans, setmemberLoans] = useState()
   

    //create staff mutation
    const {loading, error, data} = useQuery( GET_MEMBER_LOANS, {
        variables:{member_id: memberData.id, status: 1},
        onError: (e) => {
            console.log(error)
            
        },
        onCompleted: ({memberLoans}) =>{
            console.log(FormatCurrency(memberLoans[0].loan_amount))
            setmemberLoans(memberLoans)
            
        }
    })
    const resetForm = () => {
        setLoanType('')
        setRepaymentPeriod('')
        setAccountCredited('')
        setAccountNo('')
    }


    const submit = async (e) => {
        e.preventDefault();
        sendFollowUpMessage({variables:{loan_type, repayment_period, account_credited, account_no }})
        }
    
        return (
            <div className="grey-container">
                <p className="active-loan">Active Loans</p>
                    { memberLoans && 
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
                                        <label className="ks-label">Amount Paid</label>
                                        <div className="control-div">{FormatCurrency(loan.amount_paid) || "0.0"}</div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Balance Paid</label>
                                        <div className="control-div">{FormatCurrency(loan.balance_payable) || "0.0"}</div>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Payback Amount</label>
                                        <div className="control-div">{FormatCurrency(loan.payback_amount)}</div>
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
                                    {/* <div className="col-md-3">
                                        <label className="ks-label">Account to be Credited</label>
                                        <input className="ks-form-control form-control"
                                        placeholder="Access Diamond"
                                            value={account_credited || ""}
                                            onChange={({ target }) => setAccountCredited(target.value)}
                                        />
                                    </div>
                                    
                                    <div className="col-md-3">
                                        <label className="ks-label">Account Number</label>
                                        <input className="ks-form-control form-control"
                                            value={account_no || ""}
                                            placeholder="0026637289"
                                            onChange={({ target }) => setAccountNo(target.value)}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Amount Credited</label>
                                        <input className="ks-form-control form-control"
                                            value={amount_credited || ""}
                                            placeholder="0026637289"
                                            onChange={({ target }) => setAmountCredited(target.value)}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="ks-label">Date Approved</label>
                                        <input className="ks-form-control form-control" 
                                            placeholder="dd/mm/yyy" type="date"
                                            value={date_approved || ""}
                                            onChange={({ target }) => setDateApproved(target.value)}
                                        />
                                    </div> */}
                                
                                </div>
                            )
                        })
                    }
                    
            </div>
        )
}

export default LoanRequests;