import React, { Component } from "react";
import { Table, Tooltip } from "@chaoswise/ui";

class TablePreview extends Component {
  state = {};
  render() {
    let { columns, data } = this.props;
    if (!data || data.length === 0) {
      return "";
    }
    const myData = data && data.map(item => {
      return {
        ...item
      };
    });
    let endColumns = columns && columns.map((item, index) => {
      return {
        title: (text) => {
          return (
            <Tooltip title={item.name}>
              <div >{item.name}</div>
            </Tooltip>
          );
        },
        ellipsis: true,
        dataIndex: item.name,
        key: item.name,
        render: (text) => {
          if (text || text == 0||text==false) {
            if(Object.prototype.toString.call(text) === '[object Object]'){
              return (
                <Tooltip title={JSON.stringify(text)} placement="topLeft">
                  <span> {JSON.stringify(text)}</span>
                </Tooltip>
              );
            }else{
              return (
                <Tooltip title={text} placement="topLeft">
                  <span> {text}</span>
                </Tooltip>
              );
            }
           
          }
          return "";
        },

      };
    });
    return (
      <Table
        style={{ marginTop: '12px' }}
        columns={endColumns}
        dataSource={myData}
        scroll={{ x: endColumns.length * 200 ,y:'35vh'}}
        pagination={false}
        rowKey={(record) => columns && columns.length > 0 ? record[columns[0]] : record}
      />
    );
  }
}

export default TablePreview;
