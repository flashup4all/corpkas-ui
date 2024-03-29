import React, { useState } from 'react';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import {CREATE_MEMBER, GET_PAGINATE_MEMBERS} from '../../gql/members'
import Spinner from '@atlaskit/spinner';
import { ToastProvider, useToasts } from 'react-toast-notifications'
import swal from '@sweetalert/with-react'

const CreateMember = ({onrefreshMember}) =>  {
    const { addToast } = useToasts()
    const [isError, setIsError] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [successMessage, setSuccessMessage] = useState()
    const [errorMessage, setErrorMessage] = useState()

    const [staff_no, setStaffNo] = useState()
    const [surname, setSurname] = useState()
    const [other_names, setOtherNames] = useState()
    const [first_name, setFirstName] = useState()
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
        onError: (error) => {

            console.log(error.graphQLErrors[0].message)
        //   setErrorMessage(error.graphQLErrors[0].message)

            addToast("Validation Error, Please fill all necessary fields", {
                appearance: 'warning',
                autoDismiss: true,
              })
        },
        onCompleted: (createMember) =>{
            addToast("Staff Created", {
                appearance: 'success',
                autoDismiss: true,
              })
                setSuccessMessage("Member has been Created!")
                swal("Member has been Created!", {
                    icon: "success",
                });
            resetForm()
            onrefreshMember()
        },
        refetchQueries: [{ query: GET_PAGINATE_MEMBERS, variables: {page: 1} }]
    })
    const resetForm = () => {
        setStaffNo('')
        setFirstName('')
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

    const  handleValidation = () => {
        if(!current_monthly_income){
            // setIsError(true)
            // setErrorMessage("Current Monthly Income is required")
            // return;
        }
       return (staff_no && surname && first_name && gender && status && email && phone_number)
    }

    const submit = async (e) => {
        e.preventDefault();
        // if(handleValidation()) {
        createMember({variables:{staff_no, surname, other_names, first_name, gender, dob: new Date(dob),
            membership_date: new Date(membership_date), phone_number, alt_phone_number, 
            status, role, email, rank, current_monthly_income, monthly_contribution, dept }})
        // }
    }
        return (
            <div className="">
                <form onSubmit={submit}>
                    <div className="row mt-5">
                        {isError && <p className="error page-para">{errorMessage}</p>}
                        {isSuccess && <p className="success page-para">{successMessage}</p>}
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
                            <label className="ks-label">First Name</label>
                            <input className="ks-form-control form-control" 
                                placeholder="e.g Doe"
                                value={first_name || ""}
                                onChange={({ target }) => setFirstName(target.value)}
                            />
                            {errors.surname != '' && <span style={{color: "red"}}>{errors.surname}</span>}
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Other Names</label>
                            <input className="ks-form-control form-control"
                                value={other_names || ""}
                                onChange={({ target }) => setOtherNames(target.value)}
                             />
                             {errors.other_names != '' && <span style={{color: "red"}}>{errors.other_names}</span>}
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
                            {errors.gender != '' && <span style={{color: "red"}}>{errors.gender}</span>}
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Date of Birth</label>
                            <input className="ks-form-control form-control" 
                                placeholder="dd/mm/yyy" type="date"
                                value={dob || ""}
                                onChange={({ target }) => setDob(target.value)}
                            />
                            {errors.dob != '' && <span style={{color: "red"}}>{errors.dob}</span>}
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Department</label>
                            <input className="ks-form-control form-control"
                                value={dept || ""}
                                placeholder="e.g Mass Communication"
                                onChange={({ target }) => setDept(target.value)}
                             />
                             {errors.dept != '' && <span style={{color: "red"}}>{errors.dept}</span>}
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
                        <div className="col-md-3">
                            <label className="ks-label">Email</label>
                            <input className="ks-form-control form-control" 
                                placeholder="e.g Johndoe@email.com"
                                value={email || ""}
                                onChange={({ target }) => setEmail(target.value)}
                             />
                             {errors.email != '' && <span style={{color: "red"}}>{errors.email}</span>}
                        </div>
                        <div className="col-md-3">    
                            <label className="ks-label">Phone Number</label>
                            <input className="ks-form-control form-control" 
                                placeholder="e.g 09080009000"
                                value={phone_number || ""}
                                onChange={({ target }) => setPhoneNumber(target.value)}
                             />
                             {errors.phone_number != '' && <span style={{color: "red"}}>{errors.phone_number}</span>}
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Alt Phone Number</label>
                            <input className="ks-form-control form-control" 
                                placeholder="e.g 09080009000"
                                value={alt_phone_number || ""}
                                onChange={({ target }) => setAltPhoneNumber(target.value)}
                             />
                             {errors.alt_phone_number != '' && <span style={{color: "red"}}>{errors.alt_phone_number}</span>}
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Monthly Contribution</label>
                            <input className="ks-form-control form-control"
                                value={monthly_contribution || ""}
                                placeholder="e.g 10000"
                                onChange={({ target }) => setMonthlyContribution(target.value)}
                             />
                             {errors.monthly_contribution != '' && <span style={{color: "red"}}>{errors.monthly_contribution}</span>}
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Current Monthly Income</label>
                            <input className="ks-form-control form-control"
                                value={current_monthly_income || ""}
                                placeholder="e.g 100000"
                                onChange={({ target }) => setCurrentMonthlyIncome(target.value)}
                             />
                             {errors.current_monthly_income != '' && <span style={{color: "red"}}>{errors.current_monthly_income}</span>}
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
                            {errors.status != '' && <span style={{color: "red"}}>{errors.status}</span>}
                        </div>
                        <div className="col-12">
                            <button disabled={loading || !handleValidation()}  className="btn float-right mt-5 " type="submit">
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