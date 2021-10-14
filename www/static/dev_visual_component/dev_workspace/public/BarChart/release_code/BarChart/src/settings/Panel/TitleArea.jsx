import React from 'react';
import PropsType from 'prop-types';

import Title from './Title';

const TitleArea = ({
  initialValues,
  onChange
}) => {
  return (
    <React.Fragment>
      <Title title="主标题" initialValues={initialValues} onChange={onChange} />
      <Title title="副标题" needShow={false} initialValues={initialValues} onChange={onChange} />
    </React.Fragment>
  )
}

TitleArea.propTypes = {
  initialValues: PropsType.object.isRequired,
  onChange: PropsType.func.isRequired
}

TitleArea.defaultProps = {
  initialValues: {},
  onChange: () => { }
}

export default TitleArea;