/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { message } from "@chaoswise/ui";
import { observer, toJS } from "@chaoswise/cw-mobx";
import store from "./model/index";
import { successCode } from "@/config/global";
import { useIntl } from "react-intl";
import Detail from "../Detail";

const Create = observer((props) => {
  const intl = useIntl();
  const { setDataSearch, saveDataSearch, resetDataSearch } = store;
  let dataSearch = toJS(store.dataSearch);

  useEffect(() => { 
    dataSearch.queryType = props.match.params.type;
    setDataSearch(dataSearch);
    return () => {
      resetDataSearch();
    };
  }, []);

  return (
    <React.Fragment>
      <Detail
        dataSearch={dataSearch}
        onCancel={() => {
          props.history.push({
            pathname: `/data-search/search-manage`,
          });
        }}
        onChange={(...args) => setDataSearch(...args)}
        onSave={(params, successCallback) => {
          saveDataSearch(params, (res) => {
            if (res.code === successCode) {
              successCallback && successCallback();
              message.success(
                intl.formatMessage({
                  id: "common.addSuccess",
                  defaultValue: "新增成功！",
                })
              );
              props.history.push({
                pathname: `/data-search/search-manage`,
              });
            } else {
              message.error(
                res.msg ||
                  intl.formatMessage({
                    id: "common.addError",
                    defaultValue: "新增失败，请稍后重试！",
                  })
              );
            }
          });
        }}
      />
    </React.Fragment>
  );
});
export default Create;
