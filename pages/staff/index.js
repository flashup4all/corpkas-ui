import React, {useState} from 'react';

import Tabs from '@atlaskit/tabs';
import AdminMainLayout from '../../layouts/main/main';
import Createstaff from '../../components/staff/createstaff';
import ListOfStaff from '../../components/staff/listofstaff';

const tabs = [
  { label: 'Staff', components: () => null },
  { label: 'Create Staff', components: null },

];

const Managestaff = () => {
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
          <ListOfStaff />
        }
        { seletedTab === 1 &&
          <Createstaff />
        }
      </div>
    </div>
    )
  }

export default Managestaff;
Managestaff.layout = AdminMainLayout;