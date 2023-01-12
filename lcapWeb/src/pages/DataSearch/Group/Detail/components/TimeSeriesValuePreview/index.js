import React, { Component } from 'react';
import { Tooltip } from '@chaoswise/ui';
import { toJS } from '@chaoswise/cw-mobx';
import { CWTable, Tabs } from '@chaoswise/ui';
import styles from './assets/style.less';
import { FormattedMessage } from 'react-intl';
import TablePreview from './components/TablePreview';

const { TabPane } = Tabs;

class TimeSeriesValuePreview extends Component {
  state = {};

  shouldComponentUpdate(prevProps) {
    let { data } = this.props;
    if (prevProps.data === data) {
      return false;
    }
    return true;
  }

  render() {
    let data = toJS(this.props.data);
    if (!data || data.length === 0) {
      return '';
    }
    return (
      <React.Fragment>
        <Tabs className={styles.tabSwitch}>
          {data.map((item, index) => (
            <TabPane
              tab={
                <React.Fragment>
                  <FormattedMessage
                    id='pages.dataSearch.groupDetail.searchItemPrefix'
                    defaultValue='查询'
                  />
                  {index + 1}
                </React.Fragment>
              }
              key={index}
            >
              <div
              // style={{
              //   height: 44 * (item.length > 10 ? 11 : item.length + 1),
              // }}
              >
                <TablePreview data={item} />
              </div>
            </TabPane>
          ))}
        </Tabs>
      </React.Fragment>
    );
  }
}

export default TimeSeriesValuePreview;
