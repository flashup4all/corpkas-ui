import React, { useState } from 'react';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import {CREATE_MEMBER} from '../../gql/members'
import Spinner from '@atlaskit/spinner';
import { ToastProvider, useToasts } from 'react-toast-notifications'
const LoanSetting = () =>  {
    const { addToast } = useToasts()

    const [staff_no, setStaffNo] = useState()
    const [surname, setSurname] = useState()
    const [other_names, setOtherNames] = useState()
    // const [first_name, setFirstName] = useState()
    const [dob, setDob] = useState()
    const [rank, setRank] = useState()
    const [current_monthly_income, setCurrentMonthlyIncome] = useState()
    const [monthly_contribution, setMonthlyContribution] = useState()
    const [dept, setDept] = useState()
    const [membership_date, setMembershipDate] = useState()
    const [phone_number, setPhoneNumber] = useState()
    const [alt_phone_number, setAltPhoneNumber] = useState()
    const [gender, setGender] = useState()
    const [status, setStatus] = useState()
    const [role, setRole] = useState('member')
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

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
        setStaffNo('')
        setSurname('')
        setOtherNames('')
        setDob('')
        setPhoneNumber('')
        setAltPhoneNumber('')
        setGender('')
        setStatus('')
        setRole('')
        setEmail('')
        setRank('')
        setMembershipDate('')
        setDept('')
        setMonthlyContribution('')
        setCurrentMonthlyIncome('')
        setMembershipDate('')
    }

    let errors = { staff_no: '', surname: '', other_names: '', dept:'', rank:'', gender: '', dob: '', current_monthly_income:'', monthly_contribution:'', phone_number: '', alt_phone_number:'', status:'', role:'', email:'', password: '' };

  

    const submit = async (e) => {
        e.preventDefault();
       
        setLoan({variables:{threshhold_amount, members_duration, eligibility_percentage, max_loan_guarantor, maximum_running_loans }})

    }
        return (
            <div className="p-2">
                <form onSubmit={submit}>
                    <div className="row mt-5">
                        <div className="col-md-6">
                            <label className="ks-label">Threshhold Amount {errors && errors.staff_no}</label>
                            <input 
                                className="ks-form-control form-control" 
                                placeholder="Enter amount"
                                value={threshhold_amount || ""}
                                onChange={({ target }) => setStaffNo(target.value)}
                            />
                         <span style={{color: "red"}}>{errors.staff_no}</span>                            
                        </div>
                        <div className="col-md-6">
                            <label className="ks-label">Members Duration (in months)</label>
                            <input className="ks-form-control form-control" 
                                placeholder="How long before a user can apply for loan"
                                value={members_duration || ""}
                                onChange={({ target }) => setSurname(target.value)}
                            />
                            {errors.surname != '' && <span style={{color: "red"}}>{errors.surname}</span>}
                        </div>
                        <div className="col-md-6">
                            <label className="ks-label">Loan Eligibility Percentage</label>
                            <input className="ks-form-control form-control"
                                value={eligibility_percentage || ""}
                                placeholder="Enter amount"
                                onChange={({ target }) => setOtherNames(target.value)}
                             />
                             {errors.other_names != '' && <span style={{color: "red"}}>{errors.other_names}</span>}
                        </div>
                        <div className="col-md-6">
                            <label className="ks-label">Maximum Loan Guarantor</label>
                            <input className="ks-form-control form-control"
                                value={max_loan_guarantor || ""}
                                placeholder="How many times can one stand as a guarantor?"
                                onChange={({ target }) => setRank(target.value)}
                             />
                             {errors.rank != '' && <span style={{color: "red"}}>{errors.rank}</span>}
                        </div>
                        <div className="col-md-6">
                            <label className="ks-label">Maximum Running Loans</label>
                            <input className="ks-form-control form-control"
                                value={maximum_running_loans || ""}
                                placeholder="How many loans can one individual have at the same time?"
                                onChange={({ target }) => setDept(target.value)}
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