import React, { Component } from 'react';
import Loader from '../../layouts/loader';
import { UPDATE_PASSWORD  } from '../../gql/user';
import { CustomToggle, Status } from '../../layouts/extras'
import Spinner from '@atlaskit/spinner';
import {getUser} from '../../components/shared/local'
import { createApolloClient } from '../../lib/apolloClient'

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        // setMode 0 = default, 1- create, 2- update 
        this.state = {
            members: [],
            old_password: '',
            password: '',
            loading: false
        }
    }

    componentDidMount()
    {
        let user = getUser()
        this.setState({
          user: user
        })
    }

   
    
    render () {
    const {old_password, password, user, loading } = this.state
    const checkValid = () => {
        return (old_password && password)
    }
    const submit = (e) => {
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
                    mutation: UPDATE_PASSWORD,
                    variables:{ id: parseInt(user.id), old_password, password },
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
                            <label className="ks-label">Old Password</label>
                            <input className="ks-form-control form-control" type="password"
                                placeholder="*******"
                                value={old_password || ""}
                                onChange={({ target }) => this.setState({old_password: target.value})}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="ks-label">New Password</label>
                            <input className="ks-form-control form-control" type="password"
                                placeholder="*****"
                                value={password || ""}
                                onChange={({ target }) => this.setState({password: target.value})}
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
};

export default ChangePassword;
