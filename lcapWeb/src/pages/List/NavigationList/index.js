import React from 'react';
import { observer } from '@chaoswise/cw-mobx';
import { AbreastLayout } from '@chaoswise/ui';
import NavigationTree from './components/NavigationTree';
import SearchList from './components/NavigationSearchList';
const NavigationList = observer(() => {
  // 使用左右布局容器
  return (
    <AbreastLayout
      SiderWidth="300px"
      Siderbar={<NavigationTree></NavigationTree>}
      style={{ border: '1px solid #e9e9e9' }}
      type="leftOperationArea"
    >
      <SearchList></SearchList>
    </AbreastLayout>
  );
});
export default NavigationList;