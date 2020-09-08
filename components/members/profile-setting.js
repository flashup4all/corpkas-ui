import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
// import {CREATE_MEMBER} from '../../gql/members'
import Spinner from '@atlaskit/spinner';
import { useToasts } from 'react-toast-notifications'

const ProfileSetting = () =>  {
    const { addToast } = useToasts()

    const [staff_no, setStaffNo] = useState()
    const [staff_name, setStaffName] = useState()
    const [rank, setRank] = useState()
    const [dept, setDept] = useState()
    const [monthly_contribution, setMonthlyContribution] = useState()
    const [date_joined, setDateJoined] = useState()
    const [email, setEmail] = useState()
    const [phone_number, setPhoneNumber] = useState()
    const [alt_phone_number, setAltPhoneNumber] = useState()
    

    //create staff mutation
    // const  [createMember, {loading, error}] = useMutation( CREATE_MEMBER, {
    //     onError: () => {
    //         // console.log(e.graphQLErrors[0].message)
    //         console.log(error)
    //         addToast("Validation Error", {
    //             appearance: 'warning',
    //             autoDismiss: true,
    //           })
    //     },
    //     onCompleted: (updateProfile) =>{
    //         console.log(updateProfile)
    //         addToast("Profile Updated", {
    //             appearance: 'success',
    //             autoDismiss: true,
    //           })
    //           resetForm()
    //     }
    // })
     const resetForm = () => {
         setStaffNo('')
         setStaffName('')
         setRank('')
         setDepartment('')
         setMonthlyContribution('')
         setDateJoined('')
         setEmail('')
         setPhoneNumber('')
         setAltPhoneNumber('')
     }

     const submit = async (e) => {
         e.preventDefault();
         updateProfile({variables:{staff_no, staff_name, rank, dept, monthly_contribution, 
             date_joined: new Date(date_joined), 
             email, phone_number, alt_phone_number }})
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
                                placeholder="DU234FNA3"
                                value={staff_no || ""}
                                onChange={({ target }) => setStaffNo(target.value)}
                            />
                         <span style={{color: "red"}}></span>                            
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Staff Name</label>
                            <input className="ks-form-control form-control" 
                                placeholder="Moses Samuel Vybz"
                                value={staff_name || ""}
                                onChange={({ target }) => setStaffName(target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Rank</label>
                            <input className="ks-form-control form-control"
                                value={rank || ""}
                                placeholder="Dean"
                                onChange={({ target }) => setRank(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Department</label>
                            <input className="ks-form-control form-control"
                                value={dept || ""}
                                placeholder="Civil Engineering"
                                onChange={({ target }) => setDept(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Monthly Contribution</label>
                            <input className="ks-form-control form-control"
                                value={monthly_contribution || ""}
                                placeholder="₦72,000"
                                onChange={({ target }) => setMonthlyContribution(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Date Joined</label>
                            <input className="ks-form-control form-control" 
                                placeholder="dd/mm/yyy" type="date"
                                value={date_joined || ""}
                                onChange={({ target }) => setDateJoined(target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Email</label>
                            <input className="ks-form-control form-control" 
                                placeholder="samuelvybz@gmail.com"
                                value={email || ""}
                                onChange={({ target }) => setEmail(target.value)}
                             />
                        </div>
                        <div className="col-md-3">    
                            <label className="ks-label">Phone Number</label>
                            <input className="ks-form-control form-control" 
                                placeholder="09080009000"
                                value={phone_number || ""}
                                onChange={({ target }) => setPhoneNumber(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Alt Phone Number</label>
                            <input className="ks-form-control form-control" 
                                placeholder="09080009000"
                                value={alt_phone_number || ""}
                                onChange={({ target }) => setAltPhoneNumber(target.value)}
                             />
                        </div>
                        <div className="col-12">
                            <button className="btn float-right mt-5 " type="submit">
                            {/* disabled={loading} 
                            {
                                loading &&
                                <Spinner appearance="invert" size="medium"/>
                            } */}
                            EDIT PROFILE</button>
                        </div>
                    </div>
                </form>
            </div>
        )
}

export default ProfileSetting;