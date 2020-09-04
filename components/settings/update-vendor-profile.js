import React, { useState } from 'react';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import {CREATE_STAFF} from '../../gql/staff'
import Spinner from '@atlaskit/spinner';
import { ToastProvider, useToasts } from 'react-toast-notifications'

const UpdateVendorProfile = () =>  {
    const { addToast } = useToasts()

    const [staff_no, setStaffNo] = useState()
    const [surname, setSurname] = useState()
    const [other_names, setOtherNames] = useState()
    // const [first_name, setFirstName] = useState()
    const [dob, setDob] = useState()
    const [phone_number, setPhoneNumber] = useState()
    const [alt_phone_number, setAltPhoneNumber] = useState()
    const [gender, setGender] = useState()
    const [status, setStatus] = useState()
    const [role, setRole] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    //create staff mutation
    const  [createStaff, {loading, error}] = useMutation( CREATE_STAFF, {
        onError: (error) => {
            addToast("Validation Error", {
                appearance: 'warning',
                autoDismiss: true,
              })
        },
        onCompleted: (createStaff) =>{
            console.log(createStaff)
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
        setPassword('')
    }
    const submit = async (e) => {
        e.preventDefault();
        createStaff({variables:{staff_no, surname, other_names, gender, dob: new Date(dob), phone_number, alt_phone_number, status, role, email, password}})
    }
        return (
            <div className="p-4">
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
                        {/* <div className="col-md-3">
                            <label className="ks-label">First Name</label>
                            <input className="ks-form-control form-control" 
                                placeholder="e.g Doe"
                                value={first_name || ""}
                                onChange={({ target }) => setFirstName(target.value)}
                            />
                        </div> */}
                        <div className="col-md-3">
                            <label className="ks-label">Others</label>
                            <input className="ks-form-control form-control"
                                value={other_names || ""}
                                onChange={({ target }) => setOtherNames(target.value)}
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
                            <label className="ks-label">Staff Status</label>
                            <select className="ks-form-control form-control"
                                value={status || ""}
                                onChange={({ target }) => setStatus(target.value)} 
                            >
                                <option value="">Options</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Staff Role</label>
                            <select className="ks-form-control form-control"
                                value={role || ""}
                                onChange={({ target }) => setRole(target.value)}
                            >
                                <option value="">Options</option>
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="staff">Staff</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Staff Login Email</label>
                            <input className="ks-form-control form-control" 
                                placeholder="e.g Johndoe@email.com"
                                value={email || ""}
                                onChange={({ target }) => setEmail(target.value)}
                             />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Staff Login Password</label>
                            <input className="ks-form-control form-control" 
                                value={password || ""}
                                onChange={({ target }) => setPassword(target.value)}
                                placeholder="Create Password for Staff" 
                            />
                        </div>
                        <div className="col-12">
                            <button disabled={loading}  className="btn float-right mt-5 " type="submit">
                            {
                                loading &&
                                <Spinner appearance="invert" size="medium"/>
                            }
                            CREATE NEW STAFF</button>
                        </div>
                    </div>
                </form>
            </div>
        )
}

export default UpdateVendorProfile;