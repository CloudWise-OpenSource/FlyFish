import React from 'react';
import { Icon, Tooltip } from '@chaoswise/ui';

export const data = [
  {
      "type": "input",
      "label": "Input",
      "rules": [{
        required: false,
      }],
      "comProps": {},
      "mega-props": {
        span: 1
      },
      "addonAfter": (
        <Tooltip title='提示信息'>
          <Icon type="question-circle" />
        </Tooltip>
      )
  },
  {
      "type": "select",
      "label": "Select",
      "rules": [],
      "comProps": {
        dataSource: [
          { label: 'One', value: '1', key: '1' },
          { label: 'Two', value: '2', key: '2' },
          { label: 'Three', value: '3', key: '3' },
          { label: 'Four', value: '4', key: '4' }
        ]
      },
      "mega-props": {
        span: 1
      }
  },
  {
      "type": "textarea",
      "label": "TextArea",
      "rules": [],
      "comProps": {}
  },
  {
      "type": "password",
      "label": "Password",
      "rules": [],
      "comProps": {}
  },
  {
      "type": "numberpicker",
      "label": "NumberPicker",
      "rules": [],
      "comProps": {}
  },
  {
      "type": "switch",
      "label": "Switch",
      "rules": [],
      "comProps": {}
  },
  {
      "type": "datepicker",
      "label": "DatePicker",
      "rules": [],
      "comProps": {}
  },
  {
      "type": "rangepicker",
      "label": "RangePicker",
      "rules": [],
      "comProps": {}
  },
  {
      "type": "weekpicker",
      "label": "WeekPicker",
      "rules": [],
      "comProps": {}
  },
  {
      "type": "monthpicker",
      "label": "MonthPicker",
      "rules": [],
      "comProps": {}
  },
  {
      "type": "yearpicker",
      "label": "YearPicker",
      "rules": [],
      "comProps": {}
  },
  {
      "type": "timepicker",
      "label": "TimePicker",
      "rules": [{
        required: true,
      }],
      "comProps": {}
  },
  {
      "type": "range",
      "label": "Range",
      "rules": [],
      "comProps": {
        min: 0,
        max: 1024,
        marks: [0, 1024]
      }
  },
  {
      "type": "upload",
      "label": "Upload",
      "rules": [],
      "comProps": {}
  },
  {
      "type": "checkbox",
      "label": "Checkbox",
      "rules": [],
      "comProps": {
        dataSource: [
          { label: 'One', value: '1', key: '1' },
          { label: 'Two', value: '2', key: '2' },
          { label: 'Three', value: '3', key: '3' },
          { label: 'Four', value: '4', key: '4' }
        ]
      }
  },
  {
      "type": "radio",
      "label": "Radio",
      "rules": [],
      "comProps": {
        dataSource: [
          { label: 'One', value: '1', key: '1' },
          { label: 'Two', value: '2', key: '2' },
          { label: 'Three', value: '3', key: '3' },
          { label: 'Four', value: '4', key: '4' }
        ]
      }
  },
  {
      "type": "rating",
      "label": "Rating",
      "rules": [],
      "comProps": {
        min: 0,
        max: 1024,
        marks: [0, 1024]
      }
  },
  {
      "type": "transfer",
      "label": "Transfer",
      "rules": [],
      "comProps": {
        dataSource: [
          { label: 'One', value: '1', key: '1' },
          { label: 'Two', value: '2', key: '2' },
          { label: 'Three', value: '3', key: '3' },
          { label: 'Four', value: '4', key: '4' }
        ],
        render: record => record.label
      }
  }
];