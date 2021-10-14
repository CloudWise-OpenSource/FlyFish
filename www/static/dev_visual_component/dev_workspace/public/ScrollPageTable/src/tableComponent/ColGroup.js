import React from 'react';
import PropTypes from 'prop-types';
import { shapeOfColumn } from '../optionShape';

const ColGroup = ({
  columns
}) => (
  <colgroup>
    {
      columns.map(({ width }, index) => {
        const style = {};
        if (width) {
          style.width = width;
        }
        return <col key={index} style={style} />
      })
    }
  </colgroup>
)

ColGroup.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape(shapeOfColumn)).isRequired
}

ColGroup.defaultProps = {
  columns: []
}

export default ColGroup;