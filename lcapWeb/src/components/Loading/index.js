import React, { Fragment } from 'react';
import { Skeleton } from '@chaoswise/ui';

const Loading = () => {
  return (
    <Fragment>
      <Skeleton active/>
      <Skeleton active/>
      <Skeleton active/>
    </Fragment>
    
  );
};

export default Loading;
