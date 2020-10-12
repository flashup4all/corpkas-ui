import React, { Component, useState } from 'react';
import swal from '@sweetalert/with-react'
import { createApolloClient } from '../../../lib/apolloClient'
import { SEARCH_MEMBERS } from '../../../gql/members'
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import Loader from '../../../layouts/loader';
class SingleUpload extends Component {
    constructor(props) {
        super(props);
        // setMode 0 = default, 1- create, 2- update 
        this.state = {
            file: null,
        }
    }

    handleFileChange(files) {
        this.setState({
            file: URL.createObjectURL(files[0])
        })
        this.props.onSelectFile(files[0]); 
    }
    

    render(){

        const {file} = this.state

        return(
            <>
            <div className="mt-2">
                { file == null &&
                    <div className="col">
                        <label className="ks-label">Passport</label>
                        <input type="file" ref="file" onChange={({target}) => this.handleFileChange(target.files)}/>
                    </div>
                }
                
                { file !== null  && 
                    <div className="d-flex form-card">
                        <div>
                        <img src={this.state.file} style={{width: "50px",height: "56px"}}/>
                        </div>
                        <div className="form-card-p-con">
                            <p>
                                Payslip
                            <span onClick={() => {
                                this.setState({file: null})
                                // this.refs.file.value = ''
                                this.props.onSelectFile(null); 
                                }
                            } className="float-right close-button"> <CrossCircleIcon primaryColor="#FF7452" /></span>
                            </p>
                            {this.props.loading && <Loader />}
                        </div>
                        
                    </div>
                }                  

               </div>
            </>
        )
    }
}
export default SingleUpload;