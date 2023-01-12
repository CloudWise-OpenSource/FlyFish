import React from 'react';
import Basic from './Basic';

const Sider = () => {
  return <Basic 
    megaLayoutProps={{
      labelAlign: 'top',
      labelWidth: null,
      columns: 1
    }}
  />;
};

export default Sider;