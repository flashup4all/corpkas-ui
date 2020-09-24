import React, { Component, useState } from 'react';
import { createApolloClient } from '../../lib/apolloClient'

import { CREATE_LOAN, LOAN_TYPES } from '../../gql/loans'
import { getUser } from '../../components/shared/local'
import { Radio } from '@atlaskit/radio';
import Spinner from '@atlaskit/spinner';
import {  useToasts } from 'react-toast-notifications'
import Autosuggest from 'react-autosuggest';
import { Checkbox } from '@atlaskit/checkbox';
import { SEARCH_MEMBERS } from '../../gql/members'
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';

import swal from '@sweetalert/with-react'

const renderSuggestion = suggestion => (
    <div>
      {suggestion.name}
    </div>
  );

const getSuggestionValue = suggestion => suggestion.name;
class CreateLoan extends Component {
    constructor(props) {
        super(props);
        // setMode 0 = default, 1- create, 2- update 
        this.state = {
            memberSuggestions: [],
            guarantorSuggestions: [],
            loanGuarantors: [],
            selectedGuarantor: { surname: '', other_names: ''},
            guarantorAccountNo: '',
            guarantorBankId: '',
            loanAmount:'',
            loanTypeId: '',
            selectedMember: null,
            searchForMember:'',
            searchGuarantor:'',
            createLoan: null,
            buttonName: '',
            showGuarantorsForm: false,
            loan_amount: 0.0,
            member_id: '',
            user_id: '',
            loan_type_id: '',
            payslip: null,
            setMode: 0,
            loanTypes:[],
            selectedLoanType:{},
        }
    }
    componentDidMount()
    {
        this.getLoanTypes()
        // this.getMemberTotals()
    }

    getLoanTypes(){
        createApolloClient.query({
            query: LOAN_TYPES,
          }).then(response => {
              let {data: {loanTypes}} = response
              console.log(loanTypes)
            //   const result = response.data.paginateMembers
              this.setState({
                loanTypes: loanTypes, 
                })
            }, error => console.log(error))
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
    if (value.length > 1) {
        createApolloClient.query({
            query: SEARCH_MEMBERS,
            variables: {searchTerm: value}
          }).then(response => {
              let {data: {searchMember}} = response
              this.setState({
                memberSuggestions: searchMember, 
                })
            }, error => console.log(error))
        }
    }

    onSearchGuarantor = (value) => {
        if (value.length > 1) {
        console.log(value)
            createApolloClient.query({
            query: SEARCH_MEMBERS,
            variables: {searchTerm: value}
          }).then(response => {
              let {data: {searchMember}} = response
              console.log(searchMember)
              this.setState({ guarantorSuggestions: searchMember })
            }, error => console.log(error))
        }
    }
    handleFileChange(files) {
        this.setState({
            payslip: URL.createObjectURL(files[0])
        })
    }

    render(){

        const inputProps = {
            placeholder: 'Type a programming language',
            value: '',
            onChange: this.onSearchChange
          };

        const {
            guarantorAccountNo, guarantorBankId, loanGuarantors, showGuarantorsForm, 
            createLoan, setMode, memberSuggestions, selectedMember, member_staff_no, 
            searchForMember,searchGuarantor, guarantorSuggestions, selectedGuarantor, 
            loanTypes, selectedLoanType, loanAmount, loanTypeId, payslip} 
            = this.state

    const selectMember = (member) =>{
          this.setState({memberSuggestions: [], selectedMember: member, searchForMember: member.staff_no})
      }
      const selectGuarantor = (member) =>{
          console.log(member)
        this.setState({guarantorSuggestions: [], selectedGuarantor: member, searchGuarantor: member.staff_no})
    }
      const setLoanType = (id) =>{
          let loanType = loanTypes.find(loanType => loanType.id == id)
        this.setState({selectedLoanType: loanType, loanTypeId: id})
      }
      const checkValidGuarantors = (selectedGuarantor) => {
          const { staff_no, surname, other_names, id} = selectedGuarantor
        return (staff_no && surname && other_names && id)
      }
    const checkValidApplication = () => {
        const { staff_no, surname, other_names, id} = selectedGuarantor
        return (loanGuarantors.length > 0 && loanTypeId && loanAmount)
    }
    const addGuarantor = () =>
    {
        if(selectedMember==null)
        {
            swal("Please fill the loan details form above!", {
                icon: "error",
            });
            return;
        }
        if(selectedGuarantor.id == selectedMember.id)
        {
            swal("You cannot guarantee yourself!", {
                icon: "error",
            });
            return;
        }
        if(loanGuarantors.length < 2)
        {
            if(loanGuarantors.find(g => g.id == selectedGuarantor.id))
            {
                swal("This Guarantor has been already been added!", {
                    icon: "error",
                });
                return
            }
             let list = loanGuarantors
             let gaurantor = selectedGuarantor
             list.push(gaurantor)
             this.setState({loanGuarantors: list, selectedGuarantor: { surname: '', other_names: '', staff_no: '', searchGuarantor: ''}})
             return;
         }
         swal("2 Guarantors is ok!", {
             icon: "error",
         });
    }
    const applyForLoan = () => {
        if(loanGuarantors.length < 2){
            swal("You must Provide 2 Guarantors!", {
                icon: "error",
            });
        }
        console.log(loanGuarantors)
        console.log(selectedMember)
        console.log(loanAmount)
        console.log(loanTypeId)
        console.log(payslip)
    }
    

        // const Guarantorsform = () => {
        //     return(
                
        //     )
        // }

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
                            defaultValue={searchForMember || ""}
                            onChange={({target}) => this.onSearchChange(target.value)}
                            // onKeyDown={onSearchKeyDown}
                            />
                            <ul>
                               { memberSuggestions.length > 0 && 
                                    memberSuggestions.map((member) => {
                                        return(
                                             <li key={member.id} onClick={() => selectMember(member)}>{member.surname}</li>
                                             )
                                    }) 
                            }
                            </ul>
                    </div>
                    <div className="col-md-3">
                        <label className="ks-label">Type of Loan</label>
                        <select className="ks-form-control form-control"
                            value={loanTypeId || ""}
                            onChange={({ target }) => setLoanType(target.value)}
                        >
                            <option value=""> -Options- </option>
                            { loanTypes.length> 0 &&
                                loanTypes.map(type => <option key={type.id} value={type.id}>{type.name} ({type.interest}%)</option>)
                            }
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="ks-label">Amount Requested</label>
                        <input className="ks-form-control form-control"
                            placeholder="120,000"
                            type="number"
                            value={loanAmount || ""}
                                onChange={({ target }) => this.setState({loanAmount: target.value})}
                            />
                    </div>
                    <div className="col-md-3">
                        <label className="ks-label">Period of Payment (months)</label>
                        <div className="control-div">
                            {selectedLoanType.duration} 
                        </div>
                        
                    </div>
                    
                    { selectedMember !==null && 
                        <>
                            <div className="col-md-3">
                                <label className="ks-label">Staff No.</label>
                                <div className="control-div">{selectedMember.staff_no} </div>
                                {/* <input className="ks-form-control form-control"
                                    placeholder="09000000000"
                                    disabled
                                    type="number"
                                    value={selectedMember.phone_number || ""}
                                    /> */}
                            </div>
                            <div className="col-md-3">
                                <label className="ks-label">Full name</label>
                                <div className="control-div">{selectedMember.surname} {selectedMember.other_names} </div>
                                {/* <input className="ks-form-control form-control"
                                    placeholder="Agada Purest"
                                    disabled
                                    defaultValue={selectedMember.surname|| ""}
                                    /> */}
                            </div>
                            <div className="col-md-3">
                                <label className="ks-label">Department</label>
                                <div className="control-div">{selectedMember.dept} </div>
                                {/* <input className="ks-form-control form-control"
                                    placeholder="Agada Purest"
                                    disabled
                                    defaultValue={selectedMember.dept || ""}
                                    /> */}
                            </div>
                            <div className="col-md-3">
                                <label className="ks-label">Membership Number</label>
                                <div className="control-div">{selectedMember.membership_date} </div>
                                {/* <input className="ks-form-control form-control"
                                    placeholder="Agada Purest"
                                    disabled
                                    defaultValue={selectedMember.membership_date || ""}
                                    /> */}
                            </div>
                        </>
                    }
                    
                    {/* <div className="col-md-3">
                            <label className="ks-label">Select your bank</label>
                            <select className="ks-form-control form-control"
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
                            />
                    </div> */}
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
                           </button>
                            }
                        </div>
                    </div>
                </form>
            </div>
            
                { showGuarantorsForm && 
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
                           <h6 className="ks-guarantor-label">Guarantor</h6>
                       </div>
                       <div className="row pl-2 mt-5">
                       <div className="col-md-3 ks-col">
                           <label className="ks-label">Staff No</label>
                           <input className="ks-form-control form-control"
                           placeholder="Pu459CS12 "
                           defaultValue={searchGuarantor || ""}
                           onChange={({target}) => this.onSearchGuarantor(target.value)}
                           // onKeyDown={onSearchKeyDown}
                           />
                           
                           <ul>
                              { guarantorSuggestions.length > 0 && 
                                   guarantorSuggestions.map((member) => {
                                       return(
                                            <li key={member.id} onClick={() => selectGuarantor(member)}>{member.surname}</li>
                                            )
                                   }) 
                           }
                           </ul>
                       </div>
                       <div className="col-md-3 ks-col">
                           <label className="ks-label">Full Name</label>
                        <div className="control-div">{selectedGuarantor.surname}  {selectGuarantor.other_names}</div>
                           {/* <input className="ks-form-control form-control" disabled
                               placeholder=""
                               defaultValue={selectedGuarantor.surname+' '+ selectedGuarantor.other_names || ""}
                               /> */}
                       </div>
                       {/* <div className="col-md-3">
                               <label className="ks-label">Select your bank</label>
                               <select className="ks-form-control form-control"
                                   value={guarantorBankId || ""}
                                   onChange={({ target }) => this.setState({guarantorBankId: target.value})} 
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
                               type="text"
                               value={guarantorAccountNo || ""}
                               onChange={({ target }) => this.setState({guarantorAccountNo: target.value})} 
                               />
                       </div> */}
                       <div className="col-md-3 ks-col">
                           <button  disabled={!checkValidGuarantors(selectedGuarantor)} className="btn btn-col" onClick={() => addGuarantor()} 
                                type="button">
                               Add Guarantor</button>
                       </div>
                       </div>
                       <div className="row">
                            <div className="col-md-3">
                                <label className="ks-label">Pay Slip</label>
                                <input type="file" ref="file" onChange={({target}) => this.handleFileChange(target.files)}/>
                                {/* <input
                                    id="files"
                                    type="file"
                                    multiple
                                    required
                                    onChange={({target: {validity, files}}) =>
                                    validity.valid && this.uploadFile({variables: {files}})
                                    }/> */}
                            
                            </div>
                       </div>
                       <div className="row justify-content-md-center mt-4">
                       { payslip !== null  && 
                            <div  className="col-md-3 ks-col">
                            <div className="d-flex form-card">
                                <div>
                                <img src={this.state.payslip} style={{width: "50px",height: "56px"}}/>
                                </div>
                                <div className="form-card-p-con">
                                    <p>
                                       Payslip
                                    <span onClick={() => {
                                        this.setState({payslip: null})
                                        this.refs.file.value = ''
                                        }
                                    } className="float-right close-button"> <CrossCircleIcon primaryColor="#FF7452" /></span>
                                    </p>
                                </div>
                                
                            </div>
                        </div>
                        }
                       { loanGuarantors.length > 0 && 
                           loanGuarantors.map(guarantor => {
                               return (
                                   <div key={guarantor.id} className="col-md-3 ks-col">
                                       <div className="d-flex form-card">
                                           <div>
                                               <img width="55" height="55" src="/cards-icons/avata.png" alt=""></img>
                                           </div>
                                           <div className="form-card-p-con">
                                               <p>
                                                   {guarantor.surname} {guarantor.other_names}
                                               <span onClick={() => {
                                                   let new_list  =  loanGuarantors.filter(x => x.id !== guarantor.id)
                                                   this.setState({loanGuarantors: new_list})
                                            }} className="float-right close-button"> <CrossCircleIcon primaryColor="#FF7452" /></span>
                                               </p>
                                               <p className="bold">{guarantor.staff_no} </p>
                                           </div>
                                           
                                       </div>
                                   </div>
                               )
                           })
                       }
                       
                       </div>
                       <div className="ks-col">
                           <button  disabled={!checkValidApplication()} className="btn float-right btn-col" onClick={() => applyForLoan()} type="button">
                               Apply For Loan</button>
                       </div>
                       {/* <div className="ks-guarantorform-header">
                           <h6 className="ks-guarantor-label">Second Guarantor</h6>
                       </div>
                       <div className="row mt-5">
                           <div className="col-md-3">
                               <label className="ks-label">Staff No</label>
                               <input className="ks-form-control form-control"
                                   placeholder="KW459CS12"
                                   />
                           </div>
                           <div className="col-md-3">
                               <label className="ks-label">Full Name</label>
                               <input className="ks-form-control form-control"
                                   placeholder="Kwatmi Tyrone"
                                   />
                           </div>
                           <div className="col-md-3">
                                   <label className="ks-label">Select your bank</label>
                                   <select className="ks-form-control form-control"
                                   >
                                       <option>Select your bank</option>
                                       <option value="209">Access Bank</option>
                                       <option value="089">UBA</option>
                                       <option value="024">Zenith Bank</option>
                                   </select>
                               </div>
                           <div className="col-md-3">
                               <label className="ks-label">Account Number</label>
                               <input className="ks-form-control form-control"
                                   placeholder="00130000000"
                                   type="number"
                               
                                   />
                           </div>
                       </div> */}
                       {/* <div className="ks-guarantorform-header">
                           <h6 className="ks-guarantor-label">Third Guarantor</h6>
                       </div>
                       <div className="row mt-5">
                       <div className="col-md-3">
                           <label className="ks-label">Staff No</label>
                           <input className="ks-form-control form-control"
                               placeholder="KW459CS12"
                               />
                       </div>
                       <div className="col-md-3">
                           <label className="ks-label">Full Name</label>
                           <input className="ks-form-control form-control"
                               placeholder="Kwatmi Tyrone"
                               />
                       </div>
                       <div className="col-md-3">
                               <label className="ks-label">Select your bank</label>
                               <select className="ks-form-control form-control"
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
                               />
                       </div>
                       <div className="col-md-4 ks-guarantor-radio">
                           <Radio
                               value="default radio"
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
                               </button>
                           </div>
                       </div> */}
                   </form>
               </div>
                }
            </div>
           
        )
    }
}

export default CreateLoan;