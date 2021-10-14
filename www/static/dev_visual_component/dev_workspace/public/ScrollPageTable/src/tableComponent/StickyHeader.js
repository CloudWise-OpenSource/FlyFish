import React from 'react';
import ColGroup from './ColGroup'

import classnames from 'classnames';
import PropTypes from 'prop-types';
import { shapeOfColumn } from '../optionShape';
import { noop } from '../utils';

const StickyHeader = ({ prefix, columns, forwardRef }) => {

  if (!columns || !columns.length) return null;
  return (
    <div className={`${prefix}-sticky-header`} ref={ref => forwardRef(ref)}>
      <table className={`${prefix}-sticky-header-table`}>
        <ColGroup columns={columns} />
        <thead>
          <tr>
            {
              columns.map(({ ellipsis, align, className, dataIndex, title }) => (
                <td
                  key={dataIndex}
                  className={classnames(className, {
                    [`${prefix}-cell-ellipsis`]: ellipsis,
                    [`${prefix}-cell-align-${align}`]: align,
                  })}
                >{title}</td>
              ))
            }
          </tr>
        </thead>
      </table>
    </div>
  )
}

StickyHeader.propTypes = {
  prefix: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.shape(shapeOfColumn)).isRequired,
  forwardRef: PropTypes.func,
}

StickyHeader.defaultProps = {
  columns: [],
  forwardRef: noop
}

StickyHeader.displayName = 'StickyHeader';

export default StickyHeader;