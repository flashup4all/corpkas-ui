import React, { Component } from 'react';
import { createApolloClient } from '../../lib/apolloClient'
import EditFilledIcon from '@atlaskit/icon/glyph/edit-filled';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import Dropdown from 'react-bootstrap/Dropdown'
import EmptyData from '../../layouts/empty';
import Loader from '../../layouts/loader';
import Pagination from '@atlaskit/pagination';
import { LOAN_TYPES, DELETE_LOAN_TYPE } from '../../gql/loans';
import { CustomToggle, Status, Badge } from '../../layouts/extras'
import AddLoanType from './add-loan-type';
import { useToasts } from 'react-toast-notifications'
import swal from '@sweetalert/with-react'

class LoanTypes extends Component {
    constructor(props) {
        super(props);
        // setMode 0 = default, 1- create, 2- update 
        this.state = {
            loanTypes: [],
            pageNumber: 1,
            pageSize: 0,
            totalEntries: 0,
            totalPages: 0,
            sorted: [],
            setMode: 0,
            activeWidget: '',
            selectedLoanType: null
        }
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);

    // const { addToast } = useToasts()

    }
    forceUpdateHandler(){
        console.log('refresh')
        this.forceUpdate();
      };
    componentDidMount()
    {
        this.getLoanTypes()
    }
    setTabMode(index = 0)
    {
        this.setState({setMode: index, selectedLoanType: null})
        index == 0 ? this.getLoanTypes() : null;
    }
    getLoanTypes()
    {
        createApolloClient.query({
            query: LOAN_TYPES
          }).then(response => {
              const result = response.data.loanTypes
              this.setState({
                  loanTypes: result, 
                  sorted: result,

                })
            }, error => console.log(error))
    }
    editLoanType(loanType){
        this.setState({selectedLoanType: loanType, setMode: 1})
    }

    delete(id){
        console.log(id)
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this  file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                createApolloClient.mutate({
                    mutation: DELETE_LOAN_TYPE,
                    variables:{ id },
                    // refetchQueries: () => [`loanTypes`]
                    

                    update: (cache, {data: {deleteLoanType}}) => {
                        try {
                            let { loanTypes } = cache.readQuery({ query: LOAN_TYPES });
                            loanTypes = loanTypes.filter(x => x.id != id);
                            // loanTypes[foundIndex] = data;
                            console.log(loanTypes)
                            this.setState({sorted: loanTypes})
                cache.writeQuery({ query: LOAN_TYPES }, loanTypes);
                // cache.writeQuery({query: LOAN_TYPES, data: {'loanTypes': loanTypes}});
                            swal("Data has been deleted!", {
                                icon: "success",
                            });
                            // component.forceUpdate(callback)
                            this.forceUpdateHandler()
                            // LoanSettings.selectTab(0,0)
                          } catch (e) {
                              console.log(e)
                          }
                    }
                })
                .then(response => {
                    this.forceUpdateHandler()
                    swal("Data has been deleted!", {
                            icon: "success",
                          });
                }, error => console.log(error))
              
            } else {
              return;
            }
          });
    }
    
    render () {
       
    const {loanTypes, sorted, setMode, selectedLoanType } = this.state
    
    return (
        <div>   
        <div className="bg-grey">
            
        {setMode === 0 &&
             <div >
                 <div className="row">
                    <div className="col-md-12">
                        <button type="button" className="btn float-right mr-3 mt-4" onClick={()=> this.setState({setMode: 1, selectedLoanType: null})}>ADD LOAN TYPE</button>
                    </div>
                 </div>
             

             <div className="table-responsive p-3">
                 { sorted.length > 0 &&
                 <div>
                 <table className="table table-borderless">
                 <thead>
                 <tr>
                     <th>&#x23;</th>
                     <th>Loan Type</th>
                     <th>Duration (Months)</th>
                     <th>Interest(%)</th>
                     {/* <th>Interest Type</th> */}
                     <th>Insured</th>
                     <th>Status</th>
                     <th>Date Created</th>
                     <th>Actions</th>
                 </tr>
                 </thead>
                 <tbody>
                 { sorted.map((type, index) => (
                 <tr key={index}>
                     <td>{index + 1}</td>
                     <td>{type.name} {type.other_names}</td>
                     <td>{type.duration}</td>
                     <td>{type.interest}</td>
                     {/* <td>{type.interest_type}</td> */}
                     <td>
                         {type.is_insured ? <Badge type='success' title='True'/> : <Badge type='moved' title='False'/>}
                         </td>
                     <td className={type.status}> <Status status={type.status} /></td>
                     <td> {type.inserted_at}</td>
                     <td><EditFilledIcon size="meduim" isBold primaryColor="#0052CC" onClick={() => this.editLoanType(type)} /> <span className="view-icon" onClick={() => this.editLoanType(type)}>Edit</span>
                     <Dropdown className="drop-link">
                        <Dropdown.Toggle as={CustomToggle} id="dropdown-basic">
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="ks-menu-dropdown bg-menu">
                            <Dropdown.Item className="ks-menu-dropdown-item" onClick={() => this.delete(type.id)}>Delete</Dropdown.Item>
                        </Dropdown.Menu>
                        </Dropdown>
                     </td>
                 </tr>
                  ))}
                
                 </tbody>
             </table>
             </div>
                 }
                 { sorted && !sorted.length && 
                     <EmptyData title="Empty Loan Type" text="No Available  Data"/>
                 } 
                 { !sorted
                     &&
                    <Loader />
                 }
             
             </div>
         </div>
        }
        {
            setMode === 1 &&
            <div className="p-4">
                <p className="page-title mt-5">Add Loan Type
                    <span onClick={() => this.setTabMode(0)} className="float-right close-button">Close <CrossCircleIcon primaryColor="#FF7452" /></span>
                </p>
                <AddLoanType handleClick={this.setTabMode} selectedLoanType={selectedLoanType} />
            </div>
        }
        </div>
        </div>

    )
}
};

export default LoanTypes;
