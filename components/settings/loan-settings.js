import React, { useState } from 'react';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import {CREATE_MEMBER} from '../../gql/members'
import Spinner from '@atlaskit/spinner';
import { ToastProvider, useToasts } from 'react-toast-notifications'
const LoanSetting = () =>  {
    const { addToast } = useToasts()

    
    const [threshhold_amount, setThreshhold_amount] = useState()
    const [members_duration, setMembers_duration] = useState()
    const [eligibility_percentage, setEligibility_percentage] = useState()
    const [max_loan_guarantor, setMax_loan_guarantor] = useState()
    const [maximum_running_loans, setMaximum_running_loans] = useState()
   

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
        onCompleted: (createMember) =>{
            console.log(createMember)
            addToast("Staff Created", {
                appearance: 'success',
                autoDismiss: true,
              })
              resetForm()
        }
    })
    const resetForm = () => {
        setThreshhold_amount('')
        setMembers_duration('')
        setEligibility_percentage('')
        setMax_loan_guarantor('')
        setMaximum_running_loans('')
    }

  

    const submit = async (e) => {
        e.preventDefault();
       
        setLoan({variables:{threshhold_amount, members_duration, eligibility_percentage, max_loan_guarantor, maximum_running_loans }})

    }
        return (
            <div className="p-2">
                <form onSubmit={submit}>
                    <div className="row mt-5">
                        <div className="col-md-6">
                            <label className="ks-label">Threshhold Amount {errors && errors.threshhold_amount}</label>
                            <input 
                                className="ks-form-control form-control" 
                                placeholder="Enter amount"
                                value={threshhold_amount || ""}
                                onChange={({ target }) => setThreshhold_amount(target.value)}
                            />
                         <span style={{color: "red"}}>{errors.threshhold_amount}</span>                            
                        </div>
                        <div className="col-md-6">
                            <label className="ks-label">Members Duration (in months)</label>
                            <input className="ks-form-control form-control" 
                                placeholder="How long before a user can apply for loan"
                                value={members_duration || ""}
                                onChange={({ target }) => setMembers_duration(target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="ks-label">Loan Eligibility Percentage</label>
                            <input className="ks-form-control form-control"
                                value={eligibility_percentage || ""}
                                placeholder="Enter amount"
                                onChange={({ target }) => setEligibility_percentage(target.value)}
                             />
                             {errors.other_names != '' && <span style={{color: "red"}}>{errors.other_names}</span>}
                        </div>
                        <div className="col-md-6">
                            <label className="ks-label">Maximum Loan Guarantor</label>
                            <input className="ks-form-control form-control"
                                value={max_loan_guarantor || ""}
                                placeholder="How many times can one stand as a guarantor?"
                                onChange={({ target }) => setMax_loan_guarantor(target.value)}
                             />
                             {errors.rank != '' && <span style={{color: "red"}}>{errors.rank}</span>}
                        </div>
                        <div className="col-md-6">
                            <label className="ks-label">Maximum Running Loans</label>
                            <input className="ks-form-control form-control"
                                value={maximum_running_loans || ""}
                                placeholder="How many loans can one individual have at the same time?"
                                onChange={({ target }) => setMaximum_running_loans(target.value)}
                             />
                             {errors.dept != '' && <span style={{color: "red"}}>{errors.dept}</span>}
                        </div>
                        <div className="col-12">
                            <button disabled={loading}  className="btn float-right mt-5 " type="submit">
                            {
                                loading &&
                                <Spinner appearance="invert" size="medium"/>
                            }
                           UPDATE AND SAVE</button>
                        </div>
                    </div>
                </form>
            </div>
        )
}

export default LoanSetting;