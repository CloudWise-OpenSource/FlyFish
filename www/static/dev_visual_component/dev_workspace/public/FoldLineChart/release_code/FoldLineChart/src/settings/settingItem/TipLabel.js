import React from 'react';
import {
  Icon,
  Tooltip
} from 'datavi-editor/templates';
import PropTypes from 'prop-types';

const TipLabel = ({ message, label }) => (
  <span>
    {label}&nbsp;
    <Tooltip title={message}>
      <Icon type="meh-o" />
    </Tooltip>
  </span>
)

TipLabel.propTypes = {
  /**
   * @description 提示信息
   * @default ''
   */
  message: PropTypes.string.isRequired,
  /**
   * @description 标题
   * @default ''
   */
  label: PropTypes.string.isRequired
}

TipLabel.defaultProps = {
  message: '',
  label: ''
}

export default TipLabel;