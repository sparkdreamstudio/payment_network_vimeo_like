import { Table, Button, Modal, Form, Input, message, InputNumber } from 'antd';
import React, { Component } from 'react';
const { Column } = Table;
const FormItem = Form.Item;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class SendMoney extends Component {
    state = {
        submitloading: false,
    }
    componentDidMount() {
        this.props.form.validateFields();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ submitloading: true });
                if(values.memo === undefined)
                {
                    values.memo='';
                }
                this.props.fetchData('/createsendtransaction', values, (data) => {
                    this.setState({ submitloading: false });
                    if (data.tag === 0) {
                        this.props.getUserInfo();
                        message.success('Sucess');
                    }
                    else if (data.tag === 1) {
                        message.error('balance is not enough and you do not have primary bank card');
                    }else if (data.tag === 2) {
                        message.error('Amount can not be 0');
                    }else if (data.tag === 3) {
                        message.error('Amount of payment is over the payment limitation');
                    }
                    else if (data.tag === 4) {
                        message.error('Don not send money to yourself');
                    }
                    else
                    {
                        message.error('Unkown error');
                    }
                });
                console.log('Received values of form: ', values);
            }
        });
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const bkerror = isFieldTouched('username') && getFieldError('username');
        const acnnumerror = isFieldTouched('amount') && getFieldError('amount');
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        validateStatus={bkerror ? 'error' : ''}
                        help={bkerror || ''}
                    >
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: "Please input user's phone or e-mail you wanna send money!" }],
                        })(
                            <Input placeholder="Phone or E-mail" />
                        )}
                    </FormItem>
                    <FormItem
                        validateStatus={bkerror ? 'error' : ''}
                        help={acnnumerror || ''}
                    >
                        {getFieldDecorator('amount', {
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
                            <Input placeholder="Amount" />
                        )}
                    </FormItem>
                    <FormItem
                        validateStatus={bkerror ? 'error' : ''}
                    >
                        {getFieldDecorator('memo', {
                            rules: [{ required: false, message: "" }],
                        })(
                            <Input.TextArea placeholder="Memo" autosize={{ minRows: 2, maxRows: 6 }} />

                        )}
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

const WrappedSendMoney = Form.create()(SendMoney);
export default WrappedSendMoney;