import React, {useState} from 'react';
import { useQuery } from '@apollo/client';
import Tabs from '@atlaskit/tabs';
import AdminMainLayout from '../../layouts/main/main';
import LoanTypes from '../../components/loans/loan-types';
import LoanBankSchedule from '../../components/loans/loan-bank-schedule';
import RepaymentSchedule from '../../components/loans/repayment-schedule';
import Loans from '../../components/loans/loans';
import CreateLoan from '../../components/loans/applyforloan'; 
import { LOAN_SETTING } from '../../gql/loans'

const tabs = [
  { label: 'All Loans', components: () => null },
  { label: 'Loan Request', components: null },
  { label: 'Active Loans', components: null },
  { label: 'Overdue Loans', components: null },
  { label: 'Apply For Loan', components: null },
  { label: 'Bank Schedule', components: null },
  { label: 'Repayment Schedule', components: null },

];

const LoanSettings = () => {
  const [seletedTab, setSeletedTab] = useState(0)
  const [tabName, setTabName] = useState('All Loans')
  const [loanSetting, setLoanSetting] = useState(null)
  const {getLoading, getError, response} = useQuery(LOAN_SETTING, {
    onCompleted:({ getLoanSetting }) => {
        setLoanSetting(getLoanSetting)
    }
})
  const selectTab = (selected, selectedIndex) => {
    setSeletedTab(selectedIndex)
    setTabName(selected.label)
  }
  return (
    <div>
        <div className="d-flex align-items-baseline mb-3 mt-3">
          <p>Manage Loans </p><h3 className="ml-1 page-title bold"> | {tabName}</h3>
        </div>
      <div className="bg-grey ks-tabs">
        <Tabs onSelect={(selected, selectedIndex) => selectTab(selected, selectedIndex)} tabs={tabs} />
      </div>

      <div className="bg-grey mt-5">
        { seletedTab === 0 &&
          <Loans status="" showSearch={true}/>
        }
        { seletedTab === 1 &&
          <Loans  status="0" />
        }
        { seletedTab === 2 &&
          <Loans  status="1" />
        }
        { seletedTab === 3 &&
          <Loans  status="1" />
        }
        { seletedTab === 4 &&
          <CreateLoan  status="1" />
        }
        { seletedTab === 5 &&
          <LoanBankSchedule status="0" />
        }
        { seletedTab === 5 &&
          <LoanBankSchedule status="0" />
        }
        { seletedTab === 6 &&
          <RepaymentSchedule status="0" />
        }
      </div>
    </div>
    )
  }

export default LoanSettings;
LoanSettings.layout = AdminMainLayout;