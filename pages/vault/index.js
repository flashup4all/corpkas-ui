import React, {useState} from 'react';

import Tabs from '@atlaskit/tabs';
import AdminMainLayout from '../../layouts/main/main';
import VualtTransactions from '../../components/vault/transactions';
import TransactionSchedule from '../../components/transactions/transaction-schedule';
import Withdrawals from '../../components/transactions/withdrawals';

const tabs = [
  { label: 'Incomes', components: () => null },
  { label: 'Withdrawals', components: () => null },

];

const ManageTransactions = () => {
  const [seletedTab, setSeletedTab] = useState(0)
  const [tabName, setTabName] = useState('Incomes')
  const selectTab = (selected, selectedIndex) => {
    setSeletedTab(selectedIndex)
  }
  return (
    <div>
      <div className="d-flex align-items-baseline mb-3 mt-3">
        <p>{tabName} </p><h3 className="ml-1 page-title bold"> | Manage Vault </h3>
      </div>
      <div className="row d-flex justify-content-around">
        <div className="card-box col-md-4 col-md-4 p-4">
            <div>
                <p className="card-box-p">Incoming Interest Charge</p>
            </div>
            <div className="d-flex align-items-center">
                <div className="trend-img mr-3">
                    <img src="/cards-icons/trending_up_24px.png" alt="" />
                </div>
                <h1 className="card-box-h1">₦4,150,000.00</h1>
            </div>
        </div>
        <div className="card-box col-md-4 col-md-4 p-4">
            <div>
                <p className="card-box-p">Incoming Insurrance Charge</p>
            </div>
            <div className="d-flex align-items-center">
                <div className="trend-img mr-3">
                    <img src="/cards-icons/trending_up_24px.png" alt="" />
                </div>
                <h1 className="card-box-h1">₦1,000,600.00</h1>
            </div>
        </div>
        <div className="card-box col-md-4 col-md-4 p-4">
            <div>
                <p className="card-box-p">Incoming Withdrawal Charge</p>
            </div>
            <div className="d-flex align-items-center">
                <div className="trend-img mr-3">
                    <img src="/cards-icons/trending_up_24px.png" alt="" />
                </div>
                <h1 className="card-box-h1">₦950,500.00</h1>
            </div>
        </div>
        {/* <div className="col-lg-2 d-flex flex-column align-items-center justify-content-center pt-4">
            <div className="init-btn"><img src="/cards-icons/+.png" alt="" /></div>
            <p className="card-box-p mt-3">Initiate Withdrawal</p>
        </div> */}
      </div>

      <div className="bg-grey ks-tabs mt-5">
        <Tabs onSelect={(selected, selectedIndex) => selectTab(selected, selectedIndex)} tabs={tabs} />
      </div>

      <div className="bg-grey mt-5">
        { seletedTab === 0 &&
          <VualtTransactions status="1" />
        }
        { seletedTab === 1 &&
          <VualtTransactions />
        }
      </div>
    </div>
    )
  }

export default ManageTransactions;
ManageTransactions.layout = AdminMainLayout;