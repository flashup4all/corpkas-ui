import React, { Component } from 'react';
import Spinner from '@atlaskit/spinner';
import { UPDATE_VENDOR  } from '../../gql/vendor';
import {getUser, getVendor} from '../../components/shared/local'
import { createApolloClient } from '../../lib/apolloClient'


class UpdateVendorProfile extends Component  {
    constructor(props){
        super(props);
        this.state = {
            name: '',
            description: '',
            phone_numbers: '',
            account_status: '',
            default_currency: '',
            address: '',
        }
    }

    componentDidMount()
    {
        let vendor = getVendor()
        this.setState({
            vendor: vendor,
            name: vendor.name,
            description: vendor.description,
            account_status: vendor.account_status,
            default_currency: vendor.default_currency,
            address: vendor.address,
            phone_numbers: vendor.phone_numbers,
            
        })
    }

    render(){
    const {vendor, name, description, phone_numbers, account_status, default_currency, address, loading } = this.state
    const checkValid = () => {
        return (name && phone_numbers && account_status && default_currency && address)
    }
    const submit = async (e) => {
        e.preventDefault();
        this.setState({loading: true})
        swal({
            title: "Are you sure?",
            text: "You want to change your password!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                createApolloClient.mutate({
                    mutation: UPDATE_VENDOR,
                    variables:{ 
                        name, 
                        phone_numbers, 
                        description, 
                        account_status, default_currency ,
                        address,
                        id: parseInt(vendor.id)
                    },
                })
                .then(response => {
                    this.setState({loading: false, password: '', old_password:''})
                    swal("Password has been updated!", {
                            icon: "success",
                          });
                }, error => {
                this.setState({loading: false})
            })
              
            } else {
              return;
            }
          });
    }
        return (
            <div className="p-4">
                <form onSubmit={submit}>
                    <div className="row mt-5">
                        <div className="col-md-6">
                            <label className="ks-label">Name</label>
                            <input className="ks-form-control form-control" 
                                placeholder="e.g KASU Multipurpose Cooperative Society"
                                defaultValue={name || ""}
                                onChange={({ target }) => this.setState({name: target.value})}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="ks-label">Address</label>
                            <input className="ks-form-control form-control"
                                placeholder="e.g U/rimi, Kaduna"
                                value={address || ""}
                                onChange={({ target }) => this.setState({address: target.value})}
                             />
                        </div>
                        
                        <div className="col-md-6">
                            <label className="ks-label">Phone Number(s)</label>
                            <input className="ks-form-control form-control" 
                                placeholder="e.g 09080009000, 08099998888"
                                defaultValue={phone_numbers || ""}
                                onChange={({ target }) => this.setState({phone_numbers: target.value})}
                             />
                        </div>
                        <div className="col-md-6">
                            <label className="ks-label">Status</label>
                            <select className="ks-form-control form-control"
                                value={account_status || ""}
                                onChange={({ target }) => this.setState({status: target.value})} 
                            >
                                <option value="">Options</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="ks-label">Default Currency</label>
                            <select className="ks-form-control form-control"
                                defaultValue={default_currency || ""}
                                onChange={({ target }) => this.setState({default_currency: target.value})} 
                            >
                                <option value="">Options</option>
                                <option value="NGN">NGN</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="ks-label">Description</label>
                            <input className="ks-form-control form-control" 
                                placeholder="e.g details"
                                defaultValue={description || ""}
                                onChange={({ target }) => this.setState({description: target.value})}
                             />
                        </div>
                        <div className="col-12">
                            <button disabled={loading || !checkValid()}  className="btn float-right mt-5 " type="submit">
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
}

export default UpdateVendorProfile;