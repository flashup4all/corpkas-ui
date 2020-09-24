import React, { Component, useState } from 'react';
import swal from '@sweetalert/with-react'
import { createApolloClient } from '../../../lib/apolloClient'
import { SEARCH_MEMBERS } from '../../../gql/members'
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';

class GuarantorAndPayslip extends Component {
    constructor(props) {
        super(props);
        // setMode 0 = default, 1- create, 2- update 
        this.state = {
            guarantorSuggestions: [],
            loanGuarantors: [],
            selectedGuarantor: { surname: '', other_names: ''},
            guarantorAccountNo: '',
            guarantorBankId: '',
            
            selectedMember: this.props.selectedMember,
            searchGuarantor:'',
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

    onSearchGuarantor = (value) => {
        if (value.length > 1) {
            createApolloClient.query({
            query: SEARCH_MEMBERS,
            variables: {searchTerm: value}
          }).then(response => {
              let {data: {searchMember}} = response
              this.setState({ guarantorSuggestions: searchMember })
            }, error => console.log(error))
        }
    }

    handleFileChange(files) {
        this.setState({
            payslip: URL.createObjectURL(files[0])
        })
        this.props.onSelecPayslip(files[0]); 
    }
    
    
    handleGuarantorChange = () => {
        this.props.onSelectGuarantors(loanGuarantors);            
    }

    render(){

        const inputProps = {
            placeholder: 'Type a programming language',
            value: '',
            onChange: this.onSearchChange
          };

        const { loanGuarantors, selectedMember, searchGuarantor, guarantorSuggestions, selectedGuarantor,  payslip} 
            = this.state

    const selectMember = (member) =>{
          this.setState({memberSuggestions: [], selectedMember: member, searchForMember: member.staff_no})
      }
      const selectGuarantor = (member) =>{
        this.setState({guarantorSuggestions: [], selectedGuarantor: member, searchGuarantor: member.staff_no})
    }
      
      const checkValidGuarantors = (selectedGuarantor) => {
          const { staff_no, surname, other_names, id} = selectedGuarantor
        return (staff_no && surname && other_names && id)
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
             this.setState({loanGuarantors: list, selectedGuarantor: { surname: '', other_names: '', staff_no: '', searchGuarantor: null}})
             this.props.onSelectGuarantors(loanGuarantors); 
             return;
         }
         swal("2 Guarantors is ok!", {
             icon: "error",
         });
    }
        return(
            <>
            <div className="bg-grey mt-5 Ks-createloan">

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
                                        this.props.onSelecPayslip(null); 
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

               </div>
            </>
        )
    }
}
export default GuarantorAndPayslip;