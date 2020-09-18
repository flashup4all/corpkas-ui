import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import {UPDATE_MEMBER, GET_MEMBER} from '../../gql/members'
import Spinner from '@atlaskit/spinner';
import { useToasts } from 'react-toast-notifications'
import swal from '@sweetalert/with-react'

const ProfileSetting = ({memberData}) =>  {
    const { addToast } = useToasts()
    // console.log(props.memberData)
    // const memberData = props.memberData
    const [staff_no, setStaffNo] = useState(memberData.staff_no)
    const [surname, setSurname] = useState(memberData.surname)
    const [other_names, setOtherNames] = useState(memberData.other_names)
    const [dept, setDept] = useState(memberData.dept)
    const [faculty, setFaculty] = useState(memberData.faculty)
    const [membership_date, setMembershipDate] = useState(memberData.membership_date)
    const [email, setEmail] = useState(memberData.email)
    const [phone_number, setPhoneNumber] = useState(memberData.phone_number)
    const [alt_phone_number, setAltPhoneNumber] = useState(memberData.alt_phone_number)
    const [dob, setDob] = useState(memberData.dob)
    const [details, setDetails] = useState(memberData.details)
    const [gender, setGender] = useState(memberData.gender)
    const [rank, setRank] = useState(memberData.rank)
    const [current_monthly_income, setCurrentMonthlyIncome] = useState(memberData.current_monthly_income)
    const [monthly_contribution, setMonthlyContribution] = useState(memberData.monthly_contribution)
    

    // update staff mutation
    const  [updateMember, {loading, error}] = useMutation( UPDATE_MEMBER, {
        onError: (error) => {
            // console.log(e.graphQLErrors[0].message)
            console.log(error)
            addToast("Validation Error", {
                appearance: 'warning',
                autoDismiss: true,
              })
        },
        onCompleted: (updateMember) =>{
            console.log(updateMember)
            addToast("Profile Updated", {
                appearance: 'success',
                autoDismiss: true,
              })
            swal("Member has been Updated!", {
                icon: "success",
            });
        },
        refetchQueries:[{query: GET_MEMBER, variables:{id: memberData.id}}]
    })
     

     const submit = async (e) => {
         e.preventDefault();
         updateMember({variables:{
            staff_no,
            surname,
            other_names,
            dept,
            faculty,
            phone_number,
            alt_phone_number,
            dob: new Date(dob),
            details,
            rank,
            current_monthly_income,
            monthly_contribution, id: memberData.id }})
         }

        return (
            <div className="grey-container">
                <h3 className="ks-header">Profile Details</h3>
                <form onSubmit={submit}>
                    <div className="row mt-5">
                        <div className="col-md-3">
                            <label className="ks-label">Staff No</label>
                            <input 
                                className="ks-form-control form-control" 
                                placeholder="Eg. DU234FNA3"
                                value={staff_no || ""}
                                onChange={({ target }) => setStaffNo(target.value)}
                            />
                         <span style={{color: "red"}}></span>                            
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Surname</label>
                            <input className="ks-form-control form-control" 
                                placeholder="E.g Moses"
                                value={surname || ""}
                                onChange={({ target }) => setSurname(target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Other Names</label>
                            <input className="ks-form-control form-control" 
                                placeholder="E.g Moses"
                                value={other_names || ""}
                                onChange={({ target }) => setOtherNames(target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Rank</label>
                            <input className="ks-form-control form-control"
                                value={rank || ""}
                                placeholder="Eg. Dean"
                                onChange={({ target }) => setRank(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Department</label>
                            <input className="ks-form-control form-control"
                                value={dept || ""}
                                placeholder="E.g Civil Engineering"
                                onChange={({ target }) => setDept(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Faculty</label>
                            <input className="ks-form-control form-control"
                                value={faculty || ""}
                                placeholder="E.g Civil Engineering"
                                onChange={({ target }) => setFaculty(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Monthly Contribution</label>
                            <input className="ks-form-control form-control"
                                value={monthly_contribution || ""}
                                placeholder="E.g ₦72,000"
                                onChange={({ target }) => setMonthlyContribution(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Current Monthly Income</label>
                            <input className="ks-form-control form-control"
                                value={current_monthly_income || ""}
                                placeholder="E.g ₦172,000"
                                onChange={({ target }) => setCurrentMonthlyIncome(target.value)}
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
                        {/* <div className="col-md-3">
                            <label className="ks-label">Date Joined</label>
                            <input className="ks-form-control form-control" 
                                placeholder="dd/mm/yyy" type="date"
                                value={membership_date || ""}
                                onChange={({ target }) => setMembershipDate(target.value)}
                            />
                        </div> */}
                        <div className="col-md-3">
                            <label className="ks-label">Email</label>
                            <input className="ks-form-control form-control" 
                                placeholder="E.g samuelvybz@gmail.com"
                                value={email || ""}
                                onChange={({ target }) => setEmail(target.value)}
                             />
                        </div>
                        <div className="col-md-3">    
                            <label className="ks-label">Phone Number</label>
                            <input className="ks-form-control form-control" 
                                placeholder="E.g 09080009000"
                                value={phone_number || ""}
                                onChange={({ target }) => setPhoneNumber(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Alt Phone Number</label>
                            <input className="ks-form-control form-control" 
                                placeholder="E.g 09080009000"
                                value={alt_phone_number || ""}
                                onChange={({ target }) => setAltPhoneNumber(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Description</label>
                            <input className="ks-form-control form-control" 
                                placeholder="E.g more details"
                                value={details || ""}
                                onChange={({ target }) => setDetails(target.value)}
                             />
                        </div>
                        <div className="col-12">
                            <button className="btn float-right mt-5 " type="submit">
                            {/* disabled={loading} 
                            {
                                loading &&
                                <Spinner appearance="invert" size="medium"/>
                            } */}
                            UPDATE PROFILE</button>
                        </div>
                    </div>
                </form>
            </div>
        )
}

export default ProfileSetting;