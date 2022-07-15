import React, { Component } from "react";
import { Table, Tooltip } from "@chaoswise/ui";

class TablePreview extends Component {
  state = {};
  render() {
    let { data } = this.props;
    if (!data || data.length === 0) {
      return "";
    }
      let columns = Object.keys(data[0]).map((key,index) => {
          return {
            title: key,
            dataIndex: key,
            key: key,
            ellipsis:true,
            render: (text) => {
                return (
                  <Tooltip title={JSON.stringify(text)}>
                    <span >{JSON.stringify(text)}</span>
                  </Tooltip>
                );
            
            },
           
          };
      });
    return (
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: columns.length * 200 }}
        pagination={false}
      />
    );
  }
}

export default TablePreview;
