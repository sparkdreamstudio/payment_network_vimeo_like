import { Table, Button, Modal, Form, Input, message, InputNumber, Icon } from 'antd';
import React, { Component } from 'react';
import { validate } from 'email-validator';
const { Column } = Table;
var validator = require("email-validator"); 
const FormItem = Form.Item;

let id = 1;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class RequestMoney extends Component {
    state = {
        submitloading: false,
    }
    componentDidMount() {
        this.props.form.validateFields();
    }

    remove = (k) => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }

    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(++id);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ submitloading: true });
                
                var params={};
                if(values.memo===undefined)
                {
                    params.memo='';
                }
                else{
                    params.memo=values.memo;
                }
                params.payors=[];
                var payorskeys= values.keys;
                payorskeys.map((key, index)=>{
                    var payor={};
                    payor.username=values[`username${key}`];
                    payor.amount=Number(values[`amount${key}`]);
                    payor.type=validator.validate(payor.username)===true?1:0
                    params.payors.push(payor)
                })
                this.props.fetchData('/requesttransaction', params, (data) => {
                    this.setState({ submitloading: false });
                    if (data.tag === 0) {
                        message.success('Sucess');
                    }
                    else if (data.tag === 1) {
                        message.error('Amount can not be 0');
                    }else if (data.tag === 2) {
                        message.error('Do not request money to yourself');
                    }
                    else{
                        message.error('Unkown error');
                    }
                });
                console.log('Received values of form: ', values);
            }
        });
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldValue } = this.props.form;
        //const bkerror = isFieldTouched('username') && getFieldError('username');
        //const acnnumerror = isFieldTouched('amount') && getFieldError('amount');
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        };
        getFieldDecorator('keys', { initialValue: [1] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            const nameerror = isFieldTouched(`username${k}`) && getFieldError(`username${k}`);
            const amounterror = isFieldTouched(`amount${k}`) && getFieldError(`amount${k}`);
            return (
                <div key={k}>
                    <FormItem
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        label={index === 0 ? `Email or phone of number ${index}` : ''}
                        required={false}
                        help={nameerror || ''}
                        key={`username${k}`}
                    >
                        {getFieldDecorator(`username${k}`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                required: true,
                                whitespace: true,
                                message: "Please input user's phone or e-mail you wanna send money!",
                            }],
                        })(
                            <Input placeholder="Email or phone" style={{ width: '60%', marginRight: 8 }} />
                        )}
                    </FormItem>
                    <FormItem
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        label={index === 0 ? `Amount of number ${index}` : ''}
                        required={false}
                        help={amounterror || ''}
                        key={`amount${k}`}
                    >
                        {getFieldDecorator(`amount${k}`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [{
                                required: true,
                                message: "Please input amount of money!"
                            },
                            {
                                type: "number",
                                required: true,
                                message: "Please input decimal number!",
                                transform: (value) => {
                                    return Number(value) ? Number(value) : value;
                                }
                            }],
                        })(
                            <Input placeholder="Amount" style={{ width: '60%', marginRight: 8 }} />
                        )}

                        {keys.length > 1 ? (
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                disabled={keys.length === 1}
                                onClick={() => this.remove(k)}
                            />
                        ) : null}
                    </FormItem>
                </div>
            )
        });
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    {formItems}
                    <FormItem {...formItemLayoutWithOutLabel}>
                        <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                            <Icon type="plus" /> Add
                    </Button>
                    <FormItem
                    >
                        {getFieldDecorator('memo', {
                            rules: [{ required: false, message: "" }],
                        })(
                            <Input.TextArea placeholder="Memo" autosize={{ minRows: 2, maxRows: 6 }} />

                        )}
                    </FormItem>
                    </FormItem>
                    <FormItem>
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={hasErrors(getFieldsError())}
                            loading={this.state.submitloading}
                        >
                            Submit
                            </Button>
                    </FormItem>
                </Form>
            </div>
        );

    }
}

const WrappedRequestMoney = Form.create()(RequestMoney);
export default WrappedRequestMoney;