import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ColGroup from './ColGroup';

import { shapeOfColumn, shapeOfEmpty, event as eventType } from '../optionShape';
import { typeOf, noop } from '../utils';
import { chunk } from 'data-vi/helpers';

const checkTypeForRender = (content, record, index) => {
  if (typeOf(content, 'Function')) {
    return content(content, record, index);
  }
  return content;
}

const TableContent = ({
  columns,
  dataSource,
  prefix,
  empty: {
    message = '',
    icon = ''
  } = {},
  rowKey,
  onRow,
  onCell,
  getContainer,
  pageSize
}) => {
  return (
    dataSource.length
      ?
      <table ref={ref => getContainer(ref)}>
        <ColGroup columns={columns} /> 
        {
          chunk(dataSource, pageSize).map((chunkData, pageIndex) => (
            <tbody key={pageIndex} data-index={pageIndex + 1}>
              {
                chunkData.map((record, index) => (
                  <tr key={record[rowKey] || index} onClick={(event) => onRow(event, record, index)}>
                    {
                      columns.map(({ dataIndex, ellipsis, align, className }) => (
                        <td
                          className={classnames(className, {
                            [`${prefix}-cell-ellipsis`]: ellipsis,
                            [`${prefix}-cell-align-${align}`]: align,
                          })}
                          key={dataIndex}
                          onClick={(event) => onCell(event, record[dataIndex], record, index)}
                        >{checkTypeForRender(record[dataIndex], record, index)}-page-{pageIndex + 1}</td>
                      ))
                    }
                  </tr>
                ))
              }
            </tbody>
          ))
        }
      </table>
      :
      <div className={`${prefix}-container-empty`}>
        <img src={icon} />
        <span>{message}</span>
      </div>
  )
}

TableContent.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape(shapeOfColumn)).isRequired,
  dataSource: PropTypes.arrayOf(PropTypes.object).isRequired,
  prefix: PropTypes.string,
  empty: PropTypes.shape(shapeOfEmpty),
  rowKey: PropTypes.string.isRequired,
  pageSize: PropTypes.number,
  ...eventType,
}

TableContent.defaultProps = {
  columns: [],
  dataSource: [],
  rowKey: 'key',
  onCell: noop,
  onRow: noop,
  getContainer: noop
}

export default TableContent;