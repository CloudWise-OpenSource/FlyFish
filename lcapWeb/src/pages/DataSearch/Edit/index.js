/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { message } from "@chaoswise/ui";
import { observer, toJS, loadingStore } from "@chaoswise/cw-mobx";
import store from "./model/index";
import { successCode } from "@/config/global";
import { useIntl } from "react-intl";
import Detail from "../Detail";
import Loading from "@/components/Loading";

const Create = observer((props) => {
  const intl = useIntl();
  const { setDataSearch, saveDataSearch } = store;
  const { dataSearch } = store;
  const loading = loadingStore.loading["DataSearchEdit/getDataSearch"];

  useEffect(() => { 
    store.getDataSearch(props.match.params.id);
    return () => {
      setDataSearch({});
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <React.Fragment>
      <Detail
        dataSearch={toJS(dataSearch)}
        onChange={(...args) => setDataSearch(...args)}
        onSave={(params, successCallback) => {
          saveDataSearch(params, (res) => {
            if (res.code === successCode) {
              successCallback && successCallback();
              message.success(
                intl.formatMessage({
                  id: "common.saveSuccess",
                  defaultValue: "保存成功！",
                })
              );
              props.history.push({
                pathname: `/data-search/search-manage`,
              });
            } else {
              message.error(
                res.msg ||
                  intl.formatMessage({
                    id: "common.saveError",
                    defaultValue: "保存失败，请稍后重试！",
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
