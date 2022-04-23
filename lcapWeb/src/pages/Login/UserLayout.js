import React from 'react';
import { Form, Icon, Input, Button, Row, Col, message } from 'antd';
import style from './UserLayout.less';
import _ from 'lodash';
import store from './model/index';
import { toJS } from '@chaoswise/cw-mobx';
import globalStore from '@/stores/globalStore';
const { userInfo } = globalStore;
const {
  register,
  login
} = store;
import logoLogin from './logo.png';
class UserLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      countDown: 0,
      loginType: 0,
      captchaCodeImg: null,
    };
  }

  componentDidMount() {

    const { currentUser = {}, form } = this.props;
    form.setFieldsValue(currentUser);
    this.getCaptchaCode = _.throttle(this.getCaptchaCode, 500);
    this.getCaptchaCode();
  }
  componentWillUnmount() {
    this.distoryTimers();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const { loginType } = this.state;
      if (!err) {
        console.log('Received values of form: ', values);
      }
      switch (loginType) {
        case 0:
          return this.handleLogin(values);

        case 1:
          return this.handleRegister(values);
      }
      message.success('保存成功！');
    });
  };
  // todo Login
  HandleLogin(form) {
    console.log(form);
  }
  // todo Register
  handleRegister(form) {
    console.log(form);
  }
  changeLoginType(type) {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      loginType: type,
    });
  }
  distoryTimers() {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }
  findIndex(data) {
    return data.find(item => {
      if (item.index !== 2 && item.index !== 6 && item.index !== 9 && item.index !== 12) {
        return item;
      }
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (!err) {
        if (!this.state.loginType) {
          login(values, (res) => {
            if (res.code == 0) {
              globalStore.getUserInfo((res) => {
                message.success('登录成功');
                localStorage.setItem('id', res.id);
                let item = this.findIndex(toJS(res.menus));
                this.props.history.push(item.url);
              }); //成功后获取个人信息
            } else {
              message.error(res.msg || '注册失败');
            }
          });
        } else {
          register(values, (res) => {
            if (res.code == 0) {
              message.success('注册成功');
              this.setState({
                loginType: 0,
              });

            } else {
              message.error(res.msg || '注册失败');
            }
          });
        }
      }
      // localStorageUtil.setItem('user', { ...values, userId: 1, userName: 1, password: 1 });
      // this.props.history.push('/');
    });
  };
  getPhoneCode() {
    if (this.timer) {
      return;
    }
    this.setState({
      countDown: 59,
    });
    message.info('发送验证码成功，请注意查收！');
    this.timer = setInterval(() => {
      if (this.state.countDown === 0) {
        this.distoryTimers();
        this.setState({
          countDown: 0,
        });
      } else {
        this.setState({
          countDown: this.state.countDown - 1,
        });
      }
    }, 1000);
  }
  getCaptchaCode() {

  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { countDown, loginType } = this.state;
    return (
      <div className={style.UserLayout}>
        <Form onSubmit={this.handleSubmit} className={style.loginForm}>
          <img className={style.logo} src={logoLogin} />
          <Row gutter={12} type="flex" justify="center">
            <Col span={24}>
              <Form.Item>
                {getFieldDecorator('username', {
                  rules: [
                    {
                      required: true,
                      message: '请输入用户名！',
                    }
                  ],
                })(
                  <Input
                    allowClear
                    prefix={<Icon type="user" style={{ color: '#1890FF' }} />}
                    placeholder={`${loginType == 0 ? '' : '*'}请输入用户名`}
                  />
                )}
              </Form.Item>
            </Col>
            {loginType == 1 ?
              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator('phone', {
                    rules: [
                      {
                        required: true,
                        message: '请输入手机号！',
                      },
                      {
                        pattern: /^[1]([3-9])[0-9]{9}$/,
                        message: "请输入正确的手机号",
                      },
                    ],
                  })(
                    <Input
                      allowClear
                      prefix={<Icon type="mobile" style={{ color: '#1890FF' }} />}
                      placeholder={`${loginType == 0 ? '' : '*'}请输入手机号`}
                    />
                  )}
                </Form.Item>
              </Col> : null
            }

            {loginType == 1 ? <Col span={24}>
              <Form.Item>
                {getFieldDecorator('email', {
                  rules: [
                    {
                      required: true,
                      message: '请输入邮箱！',
                    },
                    {
                      pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                        // pattern: /^[A-Za-zd0-9]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/,
                      message: "请输入正确的邮箱格式",
                    },
                  ],
                })(
                  <Input
                    allowClear
                    prefix={<Icon type="mail" style={{ color: '#1890FF' }} />}
                    placeholder={`${loginType == 0 ? '' : '*'}请输入邮箱`}
                  />
                )}
              </Form.Item>
            </Col> : null}

            <Col span={24}>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '请输入登录密码！',
                    }
                  ],
                })(
                  loginType == 0 ? <Input.Password
                    allowClear
                    prefix={<Icon type="lock" style={{ color: '#1890FF' }} />}
                    placeholder={`${loginType == 0 ? '' : '*'}请输入登录密码`}
                  /> :
                    <Input.Password
                      allowClear
                      prefix={<Icon type="lock" style={{ color: '#1890FF' }} />}
                      placeholder={`${loginType == 0 ? '' : '*'}请输入登录密码`}
                    />
                )}
              </Form.Item>
            </Col>

            <Col span={24}>
              <Button type="primary" style={{ width: '100%', height: '40px' }} htmlType="submit" className="login-form-button">
                {loginType == 0 ? '登录' : '注册'}
              </Button>
            </Col>
          </Row>
          <p className={style.tips}>
            {loginType == 0 ? (
              <>
                {' '}
                还没有账号,
                <Button type="link" onClick={() => this.changeLoginType(1)}>
                  去注册 &gt;
                </Button>
              </>
            ) : (
              <>
                {' '}
                已有账号,
                <Button type="link" onClick={() => this.changeLoginType(0)}>
                  去登录 &gt;
                </Button>
              </>
            )}
          </p>
        </Form>
      </div>
    );
  }
}

export default Form.create({ name: 'normal_login' })(UserLayout);
