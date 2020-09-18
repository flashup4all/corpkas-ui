import React, { Component, useState } from 'react';
import { createApolloClient } from '../../lib/apolloClient'

import { CREATE_LOAN } from '../../gql/loans'
import { getUser } from '../../components/shared/local'
import { Radio } from '@atlaskit/radio';
import Spinner from '@atlaskit/spinner';
import {  useToasts } from 'react-toast-notifications'
import Autosuggest from 'react-autosuggest';
import { Checkbox } from '@atlaskit/checkbox';
import { SEARCH_MEMBERS } from '../../gql/members'

import swal from '@sweetalert/with-react'

class CreateLoan extends Component {
    constructor(props) {
        super(props);
        // setMode 0 = default, 1- create, 2- update 
        this.state = {
            createLoan: null,
            buttonName: '',
            showGuarantorsForm: false,
            loan_amount: 0.0,
            member_id: '',
            user_id: '',
            loan_type_id: '',
            setMode: 0,
        }
    }
    componentDidMount()
    {
        // this.getMembers()
        // this.getMemberTotals()
    }

    createLoan()
    {
        // const  [createLoan, {loading, error}] = useMutation( CREATE_LOAN, {
        //     onError: (e) => {
        //         console.log(e)
        //         addToast("Validation Error", {
        //             appearance: 'warning',
        //             autoDismiss: true,
        //           })
        //     },
        //     onCompleted: (createLoan) =>{
        //         addToast("Loan Type Created", {
        //             appearance: 'success',
        //             autoDismiss: true,
        //           })
        //           swal("Data has been Created!", {
        //             icon: "success",
        //         });
        //           resetForm()
        //     },
        //     // refetchQueries: [{ query: LOAN_TYPES }]
        // })
    }

    submit = async (e) => {
        e.preventDefault();
        // if(createLoan == null)
        // {
        //     createLoan({variables:{ loan_amount: parseFloat(loan_amount),
        //         member_id: parseInt(getUser().id) , user_id: parseInt(getUser().id), 
        //         loan_type_id: parseInt(loan_type_id),
        //        }})
        // }
        
    }
    
    
    onSearchChange = (value) => {
        console.log(value)

    if (value.length > 1) {
        createApolloClient.query({
            query: SEARCH_MEMBERS,
            variables: {searchTerm: value}
          }).then(response => {
              let {data: {searchMember}} = response
              console.log(searchMember)
            //   const result = response.data.paginateMembers
            //   this.setState({
            //       members: result.entries, 
            //       sorted: result.entries,
            //       totalEntries: result.totalEntries,
            //       totalPages: result.totalPages,
            //       pageNumber: result.pageNumber,
            //       pageSize: result.pageSize,

            //     })
            }, error => console.log(error))
        // const {loading, error, members} = useQuery(SEARCH_MEMBERS, 
        //     {
        //         variables: {searchTerm: value},
        //         onError: (error) => {
        //             console.log(error)
        //         },
        //         onCompleted: ({searchMember}) =>{
        //             console.log(searchMember)
        //             // setLoanTypes(loanTypes)
    
        //         },
                
        //     })
        // const { data } = await client.query({
        //     query: USERS_QUERY,
        //     variables: { query: value, boardId: this.props.boardId }
        // });
        // this.setState({
        //     dataSource: data ? data.users : []
        // });
        }
    }
    render(){

        const {showGuarantorsForm, createLoan, setMode} = this.state
        const Guarantorsform = () => {
            return(
                <div className="bg-grey mt-5 Ks-createloan">
                     {/* {
                setMode === 1 &&
                <div className="p-4">
                        <span onClick={() => this.setState({setMode: 1})} className="float-right close-button">Close <CrossCircleIcon primaryColor="#FF7452" /></span>
                </div>
            } */}
                    <form>
                        <div className="ks-guarantorform-header">
                            <h5>Enter Guarantor(s) Details</h5>
                            <p className="ks-subheader">You are almost there...just provide us a few more information</p>
                            <h6 className="ks-guarantor-label">First Guarantor</h6>
                        </div>
                        <div className="row mt-5">
                        <div className="col-md-3">
                            <label className="ks-label">Staff No</label>
                            <input className="ks-form-control form-control"
                                placeholder="KW459CS12"
                                // value={member_id || ""}
                                //     onChange={({ target }) => setMemberId(target.value)}
                                />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Full Name</label>
                            <input className="ks-form-control form-control"
                                placeholder="Kwatmi Tyrone"
                                // value={member_id || ""}
                                //     onChange={({ target }) => setMemberId(target.value)}
                                />
                        </div>
                        <div className="col-md-3">
                                <label className="ks-label">Select your bank</label>
                                <select className="ks-form-control form-control"
                                    // value={status || ""}
                                    // onChange={({ target }) => setStatus(target.value)} 
                                >
                                    <option>Select your bank</option>
                                    <option value="2">Access Bank</option>
                                    <option value="1">UBA</option>
                                    <option value="0">Zenith Bank</option>
                                </select>
                            </div>
                        <div className="col-md-3">
                            <label className="ks-label">Account Number</label>
                            <input className="ks-form-control form-control"
                                placeholder="00130000000"
                                type="number"
                                // value={member_id || ""}
                                //     onChange={({ target }) => setMemberId(target.value)}
                                />
                        </div>
                        </div><div className="ks-guarantorform-header">
                            <h6 className="ks-guarantor-label">Second Guarantor</h6>
                        </div>
                        <div className="row mt-5">
                        <div className="col-md-3">
                            <label className="ks-label">Staff No</label>
                            <input className="ks-form-control form-control"
                                placeholder="KW459CS12"
                                // value={member_id || ""}
                                //     onChange={({ target }) => setMemberId(target.value)}
                                />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Full Name</label>
                            <input className="ks-form-control form-control"
                                placeholder="Kwatmi Tyrone"
                                // value={member_id || ""}
                                //     onChange={({ target }) => setMemberId(target.value)}
                                />
                        </div>
                        <div className="col-md-3">
                                <label className="ks-label">Select your bank</label>
                                <select className="ks-form-control form-control"
                                    // value={status || ""}
                                    // onChange={({ target }) => setStatus(target.value)} 
                                >
                                    <option>Select your bank</option>
                                    <option value="2">Access Bank</option>
                                    <option value="1">UBA</option>
                                    <option value="0">Zenith Bank</option>
                                </select>
                            </div>
                        <div className="col-md-3">
                            <label className="ks-label">Account Number</label>
                            <input className="ks-form-control form-control"
                                placeholder="00130000000"
                                type="number"
                                // value={member_id || ""}
                                //     onChange={({ target }) => setMemberId(target.value)}
                                />
                        </div>
                        </div>
                        <div className="ks-guarantorform-header">
                            <h6 className="ks-guarantor-label">Third Guarantor</h6>
                        </div>
                        <div className="row mt-5">
                        <div className="col-md-3">
                            <label className="ks-label">Staff No</label>
                            <input className="ks-form-control form-control"
                                placeholder="KW459CS12"
                                // value={member_id || ""}
                                //     onChange={({ target }) => setMemberId(target.value)}
                                />
                        </div>
                        <div className="col-md-3">
                            <label className="ks-label">Full Name</label>
                            <input className="ks-form-control form-control"
                                placeholder="Kwatmi Tyrone"
                                // value={member_id || ""}
                                //     onChange={({ target }) => setMemberId(target.value)}
                                />
                        </div>
                        <div className="col-md-3">
                                <label className="ks-label">Select your bank</label>
                                <select className="ks-form-control form-control"
                                    // value={status || ""}
                                    // onChange={({ target }) => setStatus(target.value)} 
                                >
                                    <option>Select your bank</option>
                                    <option value="2">Access Bank</option>
                                    <option value="1">UBA</option>
                                    <option value="0">Zenith Bank</option>
                                </select>
                            </div>
                        <div className="col-md-3">
                            <label className="ks-label">Account Number</label>
                            <input className="ks-form-control form-control"
                                placeholder="00130000000"
                                type="number"
                                // value={member_id || ""}
                                //     onChange={({ target }) => setMemberId(target.value)}
                                />
                        </div>
                        <div className="col-md-4 ks-guarantor-radio">
                            <Radio
                                value="default radio"
                                // label="Accept Applicant's Undertaking"
                                name="radio-default"
                                testId="radio-default"
                                isChecked={true}
                                onChange={() => {}}
                                />
                                <p className="ks-guarantor-radio-text">Accept Applicant's Undertaking</p>
                        </div>
                        <div className="col-md-4 ks-guarantor-radio">
                            <Radio
                                value="default radio"
                                // label="Accept Insurance Guarantee"
                                name="radio-default"
                                testId="radio-default"
                                isChecked={false}
                                onChange={() => {}}
                                />
                                <p className="ks-guarantor-radio-text">Accept Insurance Guarantee</p>
                        </div>
                        <div className="col-12">
                                <button className="btn float-right mt-5" type="submit">
                                    Apply for Loan
                                {/* {
                                     disabled={loading}
                                    loading &&
                                    <Spinner appearance="invert" size="medium"/>
                                } */}
                                {/* {createLoan == null ? "Create" : ""} */}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )
        }

        return (
            <div>
            <div className="bg-grey Ks-createloan">
                {/* {setMode === 1 && */}
                <form onSubmit={(e) => submit(e)}>
                <h5 className="ks-guarantorform-header">Enter Loan Details</h5>
                <div className="row mt-5">
                    <div className="col-md-3">
                        <label className="ks-label">Staff No</label>
                        <input className="ks-form-control form-control"
                            placeholder="Pu459CS12 "
                            onChange={({target}) => this.onSearchChange(target.value)}
                            // onKeyDown={onSearchKeyDown}
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                        <label className="ks-label">Full name</label>
                        <input className="ks-form-control form-control"
                            placeholder="Agada Purest"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                        <label className="ks-label">GSM</label>
                        <input className="ks-form-control form-control"
                            placeholder="09000000000"
                            type="number"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                        <label className="ks-label">Department</label>
                        <input className="ks-form-control form-control"
                            placeholder="Agada Purest"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                        <label className="ks-label">Email</label>
                        <input className="ks-form-control form-control"
                            placeholder="Agadapurest@gmail.com"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                        <label className="ks-label">Department</label>
                        <input className="ks-form-control form-control"
                            placeholder="Computer Science"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                        <label className="ks-label">Membership Number</label>
                        <input className="ks-form-control form-control"
                            placeholder="Agada Purest"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                            <label className="ks-label">Type of Loan</label>
                            <select className="ks-form-control form-control"
                                // value={status || ""}
                                // onChange={({ target }) => setStatus(target.value)} 
                            >
                                <option value="">Option 1 </option>
                                <option value="1">Option 2</option>
                                <option value="0">Option 3</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                        <label className="ks-label">Amount Requested</label>
                        <input className="ks-form-control form-control"
                            placeholder="120,000"
                            type="number"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                        <label className="ks-label">Period of Payment</label>
                        <input className="ks-form-control form-control"
                            placeholder="18 months"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    <div className="col-md-3">
                            <label className="ks-label">Select your bank</label>
                            <select className="ks-form-control form-control"
                                // value={status || ""}
                                // onChange={({ target }) => setStatus(target.value)} 
                            >
                                <option value="">Access Bank </option>
                                <option value="1">UBA</option>
                                <option value="0">Zenith Bank</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                        <label className="ks-label">Account Number</label>
                        <input className="ks-form-control form-control"
                            placeholder="18 months"
                            type="number"
                            // value={member_id || ""}
                            //     onChange={({ target }) => setMemberId(target.value)}
                            />
                    </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col-12">
                            { !showGuarantorsForm &&
                            <button className="btn float-right mt-1" onClick={() => this.setState({showGuarantorsForm: true})}  type="button">
                                Next Step
                            {/* {
                                 disabled={loading}
                                loading &&
                                <Spinner appearance="invert" size="medium"/>
                            } */}
                            {createLoan == null ? "Create" : ""}</button>
                            }
                        </div>
                    </div>
                </form>
            </div>
            
                { showGuarantorsForm && 
                    <Guarantorsform />
                }
            </div>
           
        )
    }
}

export default CreateLoan;