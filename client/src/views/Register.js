
import React from 'react';

import { Form, Input, Tooltip, Icon, Button, message, Radio } from 'antd';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;


class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    registloading: false,
    value: 1,
  };

  handleRegist = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ registloading: true });
        var url= this.state.value===1?'/registbyemail':'/registbyphone';
        console.log(url)
        this.props.fetchData(url, values, (data) => {
          this.setState({ registloading: false });
          if (data.tag === 0) {
            this.props.swtichPage(false)
            message.success('Create Success');
          }
          else if (data.tag === 1) {
            message.error('phone or email has been registered');
          }
          else {
            message.error('unkown error');
          }
        });
        console.log('Received values of form: ', values);

      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  onRadioChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  };
  registOption(getFieldDecorator,formItemLayout){
    if(this.state.value===1){
      return (
        <FormItem
            {...formItemLayout}
            label="E-mail"
          >
            {getFieldDecorator('email', {
              rules: [{
                type: 'email', message: 'The input is not valid E-mail!',
              }, {
                required: true, message: 'Please input your E-mail!',
              }],
            })(
              <Input />
            )}
          </FormItem>
      );
    }
    else{
      return (
        <FormItem
            {...formItemLayout}
            label="Phone Number"
          >
            {getFieldDecorator('phone', {
              rules: [{ required: true, message: 'Please input your phone number!' }],
            })(
              <Input style={{ width: '100%' }} />
            )}
          </FormItem>
      );
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    return (
      <div>
        <RadioGroup onChange={this.onRadioChange} value={this.state.value}>
          <Radio value={1}>Regist by Email</Radio>
          <Radio value={2}>Regist by Phone</Radio>
        </RadioGroup>
        <Form style={{ margin: 'auto', }} onSubmit={this.handleRegist}>
          {this.registOption(getFieldDecorator,formItemLayout)}
          <FormItem
            {...formItemLayout}
            label="Password"
          >
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: 'Please input your password!',
              }, {
                validator: this.validateToNextPassword,
              }],
            })(
              <Input type="password" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Confirm Password"
          >
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: 'Please confirm your password!',
              }, {
                validator: this.compareToFirstPassword,
              }],
            })(
              <Input type="password" onBlur={this.handleConfirmBlur} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                Name&nbsp;
                                        <Tooltip title="Input your real name">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Please input Name!', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
          
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">Register</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);

export default WrappedRegistrationForm;
