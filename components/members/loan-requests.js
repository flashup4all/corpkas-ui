import React, { useState } from 'react';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import {CREATE_MEMBER} from '../../gql/members'
import Spinner from '@atlaskit/spinner';
import { ToastProvider, useToasts } from 'react-toast-notifications'
const LoanRequests = () =>  {
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

    function handleValidation() {
       console.log('validation')
        if (!staff_no) {
       console.log('no staff validation')
            
            errors.staff_no = "Staff number is required";
        }

        if (!surname) {
            errors.surname = "Surname is required";
        }

        if (!other_names) {
            errors.other_names = "Other name is required";
        }

        if (!dept) {
            errors.dept = "Department is required";
        }

        if (!rank) {
            errors.dept = "Rank is required";
        }

        if (!gender){
            errors.gender = "Select your gender";
        }

        if (!current_monthly_income){
            errors.current_monthly_income = "Current monthly income is required";
        }

        if (!monthly_contribution){
            errors.monthly_contribution = "Monthly contribution is required";
        }

        if (!phone_number){
            errors.phone_number = "Phone number is required";
        }

        if (!alt_phone_number){
            errors.alt_phone_number = "Alternative phone number is required";
        }

        if (!status) {
            errors.status = "Select a status";
        }

        if (!dob) {
            errors.status = "Set date of birth";
        }
        console.log(errors)
    }

    const submit = async (e) => {
        e.preventDefault();
        if(handleValidation()) {
        createMember({variables:{staff_no, surname, other_names, gender, dob: new Date(dob), 
            membership_date: new Date(membership_date), phone_number, alt_phone_number, 
            status, role, email, rank, current_monthly_income, monthly_contribution, dept }})
        }
    }
        return (
            <div className="">
                <form onSubmit={submit}>
                    <div className="row mt-5">
                        <div className="col-md-3">
                            <label className="ks-label">Staff ID {errors && errors.staff_no}</label>
                            <input 
                                className="ks-form-control form-control" 
                                placeholder="E.g KASU002"
                                value={staff_no || ""}
                                onChange={({ target }) => setStaffNo(target.value)}
                            />
                         <span style={{color: "red"}}>{errors.staff_no}</span>                            
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Surname</label>
                            <input className="ks-form-control form-control" 
                                placeholder="e.g John"
                                value={surname || ""}
                                onChange={({ target }) => setSurname(target.value)}
                            />
                            {errors.surname != '' && <span style={{color: "red"}}>{errors.surname}</span>}
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Others</label>
                            <input className="ks-form-control form-control"
                                value={other_names || ""}
                                onChange={({ target }) => setOtherNames(target.value)}
                             />
                             {errors.other_names != '' && <span style={{color: "red"}}>{errors.other_names}</span>}
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Rank</label>
                            <input className="ks-form-control form-control"
                                value={rank || ""}
                                placeholder="e.g Senior Lecture"
                                onChange={({ target }) => setRank(target.value)}
                             />
                             {errors.rank != '' && <span style={{color: "red"}}>{errors.rank}</span>}
                        </div>
                       
                        <div className="col-12">
                            <button disabled={loading}  className="btn float-right mt-5 " type="submit">
                            {
                                loading &&
                                <Spinner appearance="invert" size="medium"/>
                            }
                            SEND FOLLOW UP MESSAGE</button>
                        </div>
                    </div>
                </form>
            </div>
        )
}

export default LoanRequests;