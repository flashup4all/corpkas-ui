import React, { Component, useState } from 'react';
import { createApolloClient } from '../../lib/apolloClient'

import { CREATE_LOAN, LOAN_TYPES, CREAT_LOAN_GUARANTOR } from '../../gql/loans'
import { getUser } from '../../components/shared/local'
import { Radio } from '@atlaskit/radio';
import Spinner from '@atlaskit/spinner';
import {  useToasts } from 'react-toast-notifications'
import Autosuggest from 'react-autosuggest';
import { Checkbox } from '@atlaskit/checkbox';
import { SEARCH_MEMBERS } from '../../gql/members'
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import GuarantorAndPayslip from '../../components/shared/component/guarantor-and-payslip';
import { ShortDate, ShortTime, FormatCurrency } from '../../components/shared/utils';

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
            monthlyNet: '',
            reason: '',
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
            apply_loader: false
        }
        this.handleGuarantorList = this.handleGuarantorList.bind(this);
        this.handlePayslip = this.handlePayslip.bind(this);
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

    handleGuarantorList(list)
    {
        let validList = []
        list.map(x => validList.push({member_id: x.id, status: 0}))
        this.setState({loanGuarantors: list})

    }
    handlePayslip(payslip){
        this.setState({payslip: payslip})
    }
    resetApplyForm()
    {
        this.setState({
            loanTypeId: null,
            monthlyNet:0.0,
            loanAmount: '',
            reason: false,
            payslip: null,
            loanGuarantors: [],
            payslip: null,
            selectedMember: null
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
            loanTypes, selectedLoanType, loanAmount, loanTypeId,reason, monthlyNet, payslip, apply_loader} 
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
        return (loanGuarantors.length > 0 && loanTypeId && loanAmount && monthlyNet && payslip && selectedMember)
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

        if(payslip == null){
            swal("You must upload payslip", {icon:'error'})
        }
        if(loanGuarantors.length == 0){
            swal("You must provide 2  guarantors", {icon:'error'})
        }
        swal({
            title: "Are you sure?",
            text: "Application cannot be undone!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((yes) => {
            if (yes) {
                this.setState({apply_loader: true})
                createApolloClient.mutate({
                    mutation: CREATE_LOAN,
                    variables:{
                        loan_type_id: parseInt(loanTypeId), 
                        monthly_net_income: monthlyNet,
                        loan_amount: loanAmount, member_id: selectedMember.id, 
                        user_id: parseInt(getUser().id),
                        reason: reason,
                        payslip_image: payslip,
                    }
                }).then(response => {
                    let {data: {createLoan}} = response
                    loanGuarantors.map(x => {
                        createApolloClient.mutate({
                            mutation: CREAT_LOAN_GUARANTOR,
                            variables: {loan_id: parseInt(createLoan.id), member_id: parseInt(x.id), status: 0}
                        }).then(res => {
                            let {data: {createLoanGuarantor}} = res
        
                        }, error => console.log(error))
                    })
                    swal("Loan Application Successful! awaiting approval", {
                        icon: "success",
                    });
                    this.resetApplyForm()
                    this.setState({apply_loader: false})
        
                  }, error => { 
                    this.setState({apply_loader: false})
                  })
            }
          });
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
                        <label className="ks-label">Monthly Net Income</label>
                        <input className="ks-form-control form-control"
                            placeholder="120,000"
                            type="number"
                            value={monthlyNet || ""}
                                onChange={({ target }) => this.setState({monthlyNet: target.value})}
                            />
                    </div>
                    <div className="col-md-3">
                        <label className="ks-label">Reason</label>
                        <input className="ks-form-control form-control"
                            placeholder=""
                            value={reason || ""}
                                onChange={({ target }) => this.setState({reason: target.value})}
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
                            </div>
                            <div className="col-md-3">
                                <label className="ks-label">Full name</label>
                                <div className="control-div">{selectedMember.surname} {selectedMember.other_names} </div>
                            </div>
                            <div className="col-md-3">
                                <label className="ks-label">Department</label>
                                <div className="control-div">{selectedMember.dept} </div>
                            </div>
                            <div className="col-md-3">
                                <label className="ks-label">Membership Number</label>
                                <div className="control-div">{ selectedMember.membership_date && ShortDate(selectedMember.membership_date)} </div>
                            </div>
                        </>
                    }
                    </div>
                    <div className="row mt-5">
                        <div className="col-12">
                            { !showGuarantorsForm &&
                            <button className="btn float-right mt-1" disabled={!selectedMember} onClick={() => this.setState({showGuarantorsForm: true})}  type="button">
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
                    <>
                    {
                        selectedMember &&
                        <GuarantorAndPayslip selectedMember={selectedMember} onSelectGuarantors={this.handleGuarantorList} onSelecPayslip={this.handlePayslip}/>
                    }

                       {/* <div className="ks-guarantorform-header">
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
                       </div>
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
                            
                            </div>
                       </div> */}
                       {/* <div className="row justify-content-md-center mt-4">
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
                       
                       </div> */}
                       <div className="ks-col">
                           <button  disabled={!checkValidApplication() || apply_loader} className="btn float-right btn-col" onClick={() => applyForLoan()} type="button">
                            {
                                apply_loader &&
                                <Spinner appearance="invert" size="medium"/>
                            }
                            APPLY FOR LOAN</button>
                       </div>

               </>
                }
            </div>
           
        )
    }
}

export default CreateLoan;