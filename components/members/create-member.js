import React, { useState } from 'react';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import {CREATE_MEMBER} from '../../gql/members'
import Spinner from '@atlaskit/spinner';
import { ToastProvider, useToasts } from 'react-toast-notifications'
const CreateMember = () =>  {
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
            console.log(e.graphQLErrors[0].message)
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
    const submit = async (e) => {
        e.preventDefault();
        createMember({variables:{staff_no, surname, other_names, gender, dob: new Date(dob), 
            membership_date: new Date(membership_date), phone_number, alt_phone_number, 
            status, role, email, rank, current_monthly_income, monthly_contribution, dept }})
    }
        return (
            <div className="">
                <form onSubmit={submit}>
                    <div className="row mt-5">
                        <div className="col-md-3">
                            <label className="ks-label">Staff ID</label>
                            <input 
                                className="ks-form-control form-control" 
                                placeholder="E.g KASU002"
                                value={staff_no || ""}
                                onChange={({ target }) => setStaffNo(target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Surname</label>
                            <input className="ks-form-control form-control" 
                                placeholder="e.g John"
                                value={surname || ""}
                                onChange={({ target }) => setSurname(target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Others</label>
                            <input className="ks-form-control form-control"
                                value={other_names || ""}
                                onChange={({ target }) => setOtherNames(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Rank</label>
                            <input className="ks-form-control form-control"
                                value={rank || ""}
                                placeholder="e.g Senior Lecture"
                                onChange={({ target }) => setRank(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Department</label>
                            <input className="ks-form-control form-control"
                                value={dept || ""}
                                placeholder="e.g Mass Communication"
                                onChange={({ target }) => setDept(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Monthly Contribution</label>
                            <input className="ks-form-control form-control"
                                value={monthly_contribution || ""}
                                placeholder="e.g 10000"
                                onChange={({ target }) => setMonthlyContribution(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Current Monthly Income</label>
                            <input className="ks-form-control form-control"
                                value={current_monthly_income || ""}
                                placeholder="e.g 100000"
                                onChange={({ target }) => setCurrentMonthlyIncome(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Date Joined</label>
                            <input className="ks-form-control form-control" 
                                placeholder="dd/mm/yyy" type="date"
                                value={membership_date || ""}
                                onChange={({ target }) => setMembershipDate(target.value)}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="ks-label">Date of Birth</label>
                            <input className="ks-form-control form-control" 
                                placeholder="dd/mm/yyy" type="date"
                                value={dob || ""}
                                onChange={({ target }) => setDob(target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Email</label>
                            <input className="ks-form-control form-control" 
                                placeholder="e.g Johndoe@email.com"
                                value={email || ""}
                                onChange={({ target }) => setEmail(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Phone Number</label>
                            <input className="ks-form-control form-control" 
                                placeholder="e.g 09080009000"
                                value={phone_number || ""}
                                onChange={({ target }) => setPhoneNumber(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Alt Phone Number</label>
                            <input className="ks-form-control form-control" 
                                placeholder="e.g 09080009000"
                                value={alt_phone_number || ""}
                                onChange={({ target }) => setAltPhoneNumber(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Gender</label>
                            <select className="ks-form-control form-control" 
                                value={gender || ""}
                                onChange={({ target }) => setGender(target.value)}
                                >
                                <option value="">Options</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Account Status</label>
                            <select className="ks-form-control form-control"
                                value={status || ""}
                                onChange={({ target }) => setStatus(target.value)} 
                            >
                                <option value="">Options</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                                <option value="2">Closed</option>
                            </select>
                        </div>
                        <div className="col-12">
                            <button disabled={loading}  className="btn float-right mt-5 " type="submit">
                            {
                                loading &&
                                <Spinner appearance="invert" size="medium"/>
                            }
                            CREATE NEW MEMBER</button>
                        </div>
                    </div>
                </form>
            </div>
        )
}

export default CreateMember;