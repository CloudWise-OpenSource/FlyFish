import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { noop } from '../utils';
import { PAGESIZE } from '../constant';

const Pagination = ({
  forwardRef,
  total,
  pageSize,
  onChange,
  prefix,
  page
}) => {
  const totalPage = total ? Math.ceil(total / pageSize) : 0;
  const paginationPrefix = `${prefix}-pagination`;
  const prevClassnames = classnames(`${paginationPrefix}-item`, {
    [`${paginationPrefix}-disable`]: page === 1
  });
  const nextClassnames = classnames(`${paginationPrefix}-item`, {
    [`${paginationPrefix}-disable`]: page === totalPage
  });
  const paginationItemClassnames = (index) => classnames(`${paginationPrefix}-item`, {
    [`${paginationPrefix}-item-active`]: page === index + 1
  })
  return (
    <ul ref={ref => forwardRef(ref)} className={paginationPrefix}>
      <li className={prevClassnames} onClick={(event) => page !== 1 && onChange(page - 1, event)}>
        <i><svg viewBox="64 64 896 896" focusable="false" className="" data-icon="left" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path></svg></i>
      </li>
      {
        new Array(totalPage).fill('').map((_, index) => (
          <li
            key={index}
            className={paginationItemClassnames(index)}
            onClick={() => (index + 1 !== page) && onChange(index + 1)}
          >{index + 1}</li>
        ))
      }
      <li className={nextClassnames} onClick={(event) => page !== totalPage && onChange(page + 1, event)}>
        <i><svg viewBox="64 64 896 896" focusable="false" className="" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg></i>
      </li>
    </ul>
  )
}

Pagination.propTypes = {
  forwardRef: PropTypes.func,
  total: PropTypes.number,
  pageSize: PropTypes.number,
  onChange: PropTypes.func,
  prefix: PropTypes.string.isRequired,
  page: PropTypes.number
}

Pagination.defaultProps = {
  forwardRef: noop,
  onChange: noop,
  total: 0,
  pageSize: PAGESIZE,
  page: 1
}

export default Pagination;