import React, { useState } from 'react';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import {CREATE_MEMBER} from '../../gql/members'
import Spinner from '@atlaskit/spinner';
import { ToastProvider, useToasts } from 'react-toast-notifications'
const LoanRequests = () =>  {
    const { addToast } = useToasts()

    const [loan_type, setLoanType] = useState()
    const [repayment_period, setRepaymentPeriod] = useState()
    const [account_credited, setAccountCredited] = useState()
    const [account_no, setAccountNo] = useState()
   

    //create staff mutation
    const  [createMember, {loading, error}] = useMutation( CREATE_MEMBER, {
        onError: (e) => {
            // console.log(e.graphQLErrors[0].message)
            console.log(error)
            addToast("Validation Error", {
                appearance: 'warning',
                autoDismiss: true,
              })
        },
        onCompleted: (sendFollowUpMessage) =>{
            console.log(sendFollowUpMessage)
            addToast("Message Sent", {
                appearance: 'success',
                autoDismiss: true,
              })
              resetForm()
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
                
                <form onSubmit={submit}>
                    {/* <div className="row">
                     <p className="ks-request-text">Loan request for </p>
                    </div> */}
                    <div className="row mt-5 white">
                        <div className="col-md-3 mt-5">
                            <label className="ks-label">Type of Loan</label>
                            <input 
                                className="ks-form-control form-control" 
                                placeholder="Car and Housing"
                                value={loan_type || ""}
                                onChange={({ target }) => setLoanType(target.value)}
                            />
                         {/* <span style={{color: "red"}}>{errors.staff_no}</span> */}
                        </div>
                        <div className="col-md-3 mt-5">
                            <label className="ks-label">Period of Repayment</label>
                            <input className="ks-form-control form-control" 
                                placeholder="18 months"
                                value={repayment_period || ""}
                                onChange={({ target }) => setRepaymentPeriod(target.value)}
                            />
                        </div>
                        <div className="col-md-3 mt-5">
                            <label className="ks-label">Account to be Credited</label>
                            <input className="ks-form-control form-control"
                            placeholder="Access Diamond"
                                value={account_credited || ""}
                                onChange={({ target }) => setAccountCredited(target.value)}
                             />
                        </div>
                        <div className="col-md-3 mt-5">
                            <label className="ks-label">Account Number</label>
                            <input className="ks-form-control form-control"
                                value={account_no || ""}
                                placeholder="0026637289"
                                onChange={({ target }) => setAccountNo(target.value)}
                             />
                        </div>
                       
                       
                    </div>
                    <div className="col-12">
                            <button disabled={loading}  className="btn float-right mt-5 " type="submit">
                            {
                                loading &&
                                <Spinner appearance="invert" size="medium"/>
                            }
                            SEND FOLLOW UP MESSAGE</button>
                        </div>
                </form>
            </div>
        )
}

export default LoanRequests;