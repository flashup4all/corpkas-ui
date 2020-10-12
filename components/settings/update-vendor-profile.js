import React, { useState } from 'react';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import {CREATE_STAFF} from '../../gql/staff'
import Spinner from '@atlaskit/spinner';
import { ToastProvider, useToasts } from 'react-toast-notifications'

const UpdateVendorProfile = () =>  {
    const { addToast } = useToasts()

    const [name, setName] = useState()
    const [description, setDescription] = useState()
    const [phone_numbers, setPhoneNumbers] = useState()
    const [account_status, setAccountStatus] = useState()
    const [default_currency, setDefaultCurrency] = useState('NGN')
    const [address, SetAddress] = useState()

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
        setName('')
        setDescription('')
        setPhoneNumbers('')
        setAccountStatus('')
        setDefaultCurrency('NGN')
        SetAddress('')
    }
    const submit = async (e) => {
        e.preventDefault();
        createStaff({variables:{name, description, default_currency, phone_numbers, account_status, address}})
    }
        return (
            <div className="p-4">
                <form onSubmit={submit}>
                    <div className="row mt-5">
                        <div className="col-md-6">
                            <label className="ks-label">Name</label>
                            <input className="ks-form-control form-control" 
                                placeholder="e.g KASU Multipurpose Cooperative Society"
                                value={name || ""}
                                onChange={({ target }) => setName(target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="ks-label">Address</label>
                            <input className="ks-form-control form-control"
                                placeholder="e.g U/rimi, Kaduna"
                                value={address || ""}
                                onChange={({ target }) => SetAddress(target.value)}
                             />
                        </div>
                        
                        <div className="col-md-6">
                            <label className="ks-label">Phone Number(s)</label>
                            <input className="ks-form-control form-control" 
                                placeholder="e.g 09080009000, 08099998888"
                                value={phone_numbers || ""}
                                onChange={({ target }) => setPhoneNumbers(target.value)}
                             />
                        </div>
                        <div className="col-md-6">
                            <label className="ks-label">Status</label>
                            <select className="ks-form-control form-control"
                                value={account_status || ""}
                                onChange={({ target }) => setAccountStatus(target.value)} 
                            >
                                <option value="">Options</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="ks-label">Default Currency</label>
                            <select className="ks-form-control form-control"
                                value={default_currency || ""}
                                onChange={({ target }) => setDefaultCurrency(target.value)} 
                            >
                                <option value="">Options</option>
                                <option value="NGN">NGN</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="ks-label">Description</label>
                            <input className="ks-form-control form-control" 
                                placeholder="e.g details"
                                value={description || ""}
                                onChange={({ target }) => setDescription(target.value)}
                             />
                        </div>
                        <div className="col-12">
                            <button disabled={loading}  className="btn float-right mt-5 " type="submit">
                            {
                                loading &&
                                <Spinner appearance="invert" size="medium"/>
                            }
                            UPDATE PROFILE</button>
                        </div>
                    </div>
                </form>
            </div>
        )
}

export default UpdateVendorProfile;