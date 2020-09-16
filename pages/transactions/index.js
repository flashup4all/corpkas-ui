import React, {useState} from 'react';

import Tabs from '@atlaskit/tabs';
import AdminMainLayout from '../../layouts/main/main';
import Transactions from '../../components/transactions/transactions';
import TransactionSchedule from '../../components/transactions/transaction-schedule';
import Withdrawals from '../../components/transactions/withdrawals';

const tabs = [
  { label: 'Pending', components: () => null },
  { label: 'All', components: () => null },
  { label: 'Schedule', components: null },

];

const ManageTransactions = () => {
  const [seletedTab, setSeletedTab] = useState(0)
  const selectTab = (selected, selectedIndex) => {
    setSeletedTab(selectedIndex)
  }
  return (
    <div>
      <div className="bg-grey ks-tabs">
        <Tabs onSelect={(selected, selectedIndex) => selectTab(selected, selectedIndex)} tabs={tabs} />
      </div>

      <div className="bg-grey mt-5">
        { seletedTab === 0 &&
          <Transactions status="0" />
        }
        { seletedTab === 1 &&
          <Transactions />
        }
        { seletedTab === 2 &&
          <TransactionSchedule />
        }
      </div>
    </div>
    )
  }

export default ManageTransactions;
ManageTransactions.layout = AdminMainLayout;