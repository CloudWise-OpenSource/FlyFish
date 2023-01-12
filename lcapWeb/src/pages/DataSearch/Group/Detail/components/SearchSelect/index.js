import React from 'react';
import { Select, Spin, Tooltip, Icon } from '@chaoswise/ui';
import debounce from 'lodash/debounce';
import {
  getDataSearchListService,
  validateSelectItemValueService,
} from './services';
import { FormattedMessage } from 'react-intl';
import styles from './assets/style.less';

const { Option } = Select;

export default class SearchSelect extends React.Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.lastValidId = 0;
    this.fetchData = debounce(this.fetchData, 800);
    this.isValid = true;
    this.message = '';
    this.selectRef = React.createRef();
  }

  state = {
    data: [],
    fetching: false,
    isValidating: false,
    isValid: true,
    message: '',
  };

  componentDidUpdate(prevProps) {
    if (prevProps.queryType !== this.props.queryType && !this.state.isValid) {
      const { value } = this.props;
      if (value && value.settingId) {
        this.innerValidate(value);
      }
    }
  }

  setValidResult(result) {
    this.setState({
      message: result.message,
      isValid: result.isValid,
    });
  }

  validate() {
    const { value } = this.props;
    return new Promise((resolve) => {
      let isValid = this.state.isValid;
      let message = this.state.message;
      if (!value || !value.settingId) {
        isValid = false;
        message = (
          <FormattedMessage
            id='pages.dataSearch.groupDetail.selectItemNullMessage'
            defaultValue='请选择查询项！'
          />
        );
        this.setState({
          isValid,
          message,
        });
        resolve({
          isValid,
          message,
        });
        return;
      }
      if (this.state.isValidating) {
        this.innerValidateResolve = resolve;
      } else {
        resolve({
          isValid,
          message,
        });
      }
    });
  }

  innerValidate(value) {
    this.setState({
      isValid: true,
      message: '',
      isValidating: true,
    });
    let isValid = true;
    let message = '';
    this.lastValidId += 1;
    const lastValidId = this.lastValidId;
    validateSelectItemValueService(value.settingId, this.props.queryType).then(
      (resp) => {
        if (lastValidId !== this.lastValidId) {
          return;
        }
        const result = resp.data || {};
        if (!result.avaliable) {
          isValid = false;
          message = result.msg || (
            <FormattedMessage
              id='pages.dataSearch.groupDetail.selectItemErrorMessage'
              defaultValue='选中的查询项存在问题，请检查查询项！'
            />
          );
        }
        if (
          this.innerValidateResolve &&
          typeof this.innerValidateResolve === 'function'
        ) {
          this.innerValidateResolve({
            isValid,
            message,
          });
          this.innerValidateResolve = null;
        }
        this.setState({
          isValid,
          message,
          isValidating: false,
        });
      },
      () => {
        isValid = false;
        message = (
          <FormattedMessage
            id='pages.dataSearch.groupDetail.selectItemErrorMessage'
            defaultValue='选中的查询项存在问题，请检查查询项！'
          />
        );
        if (
          this.innerValidateResolve &&
          typeof this.innerValidateResolve === 'function'
        ) {
          this.innerValidateResolve({
            isValid,
            message,
          });
          this.innerValidateResolve = null;
        }
        this.setState({
          isValid,
          message,
          isValidating: false,
        });
      }
    );
  }

  fetchData = (value) => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    getDataSearchListService(value).then((resp) => {
      if (fetchId !== this.lastFetchId) {
        return;
      }
      let data = resp.data ? resp.data.data || [] : [];
      data = data.map((i) => ({
        settingId: i.settingId,
        queryName: i.queryName,
      }));
      this.setState({ data, fetching: false });
    });
  };

  handleChange = (value) => {
    let targetId = null;
    if (value) {
      targetId = value.key;
    }
    const { onChange } = this.props;

    if (targetId) {
      const data = this.state.data || [];
      const target = data.find((item) => item.settingId === targetId);
      if (target) {
        onChange && onChange(target);
        this.innerValidate(target);
      }
    } else {
      this.setState({
        isValid: true,
        message: '',
      });
      onChange && onChange(null);
    }
    if (this.selectRef && this.selectRef.current) {
      this.selectRef.current.blur();
    }
    this.setState({
      data: [],
      fetching: false,
    });
  };

  render() {
    const { fetching, data, isValid, message, isValidating } = this.state;
    const { value } = this.props;
    return (
      <div className={styles.dataSearchSelectItem}>
        <Select
          labelInValue
          showSearch
          disabled={isValidating}
          ref={this.selectRef}
          value={
            value ? { key: value.settingId, label: value.queryName } : undefined
          }
          placeholder='请选择'
          notFoundContent={fetching ? <Spin size='small' /> : null}
          filterOption={false}
          className={`${!isValid ? styles.dataSearchSelectItemError : ''} ${
            isValidating ? styles.dataSearchSelectItemValidating : ''
          }`}
          onSearch={this.fetchData}
          onFocus={this.fetchData}
          onChange={this.handleChange}
          style={{ width: '100%' }}
          dropdownRender={(menu) => (
            <React.Fragment>
              <p
                style={{
                  padding: '4px 12px',
                  marginBottom: 0,
                  color: 'rgba(0,0,0,0.4)',
                }}
              >
                <FormattedMessage
                  id='pages.dataSearch.groupDetail.selectItemTips'
                  defaultValue='默认展示20条数据，请输入进行精确匹配'
                />
              </p>
              {menu}
            </React.Fragment>
          )}
        >
          {data.map((d) => (
            <Option key={d.settingId}>{d.queryName}</Option>
          ))}
        </Select>
        {message ? (
          <Tooltip title={message}>
            <Icon
              className={styles.dataSearchSelectItemTip}
              type='exclamation-circle'
            />
          </Tooltip>
        ) : (
          ''
        )}
        {isValidating ? (
          <div className={styles.validatingSpan}>
            <Spin size='small' />
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}
