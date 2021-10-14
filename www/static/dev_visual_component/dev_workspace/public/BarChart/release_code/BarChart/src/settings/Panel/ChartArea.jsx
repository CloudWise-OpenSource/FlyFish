import React from 'react';
import PropsType from 'prop-types';

import Grid from './Grid'
import Rect from './Rect'

const ChartArea = ({
  initialValues,
  onChange
}) => {
  return (
    <React.Fragment>
      <Grid needVisible initialValues={initialValues} onChange={onChange} />
      {/* <Rect initialValues={initialValues} onChange={onChange} /> */}
    </React.Fragment>
  )
}

ChartArea.propTypes = {
  initialValues: PropsType.object.isRequired,
  onChange: PropsType.func.isRequired
}

ChartArea.defaultProps = {
  initialValues: {},
  onChange: () => { }
}

export default ChartArea;