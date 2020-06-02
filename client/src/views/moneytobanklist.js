import { Table, Button, Modal, Form, Input, message, Radio,DatePicker } from 'antd';
import React, { Component } from 'react';
const { Column } = Table;
const {RangePicker } = DatePicker;
const FormItem = Form.Item;
var moment=require('moment')

var val=3
var sd=''
var ed=''
const dateFormat = 'YYYY/MM/DD';
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class MoneytoBank extends Component {
    state = { 
        meneytobanklist: [],
        showModal:false,
        addLoading:false
    }
    
    componentDidMount() {
        //this.getStatement('2009-10-9','2019-10-9')
        this.getlist();
        this.props.form.validateFields();
    }
    getlist=()=>{
        this.props.fetchData('/moneytobanklist', {  }, (data) => {
            console.log(data)
            if (data.tag === 0) {
                var sortedlist = data.info.sort(function (a, b) {
                    return new Date(b.InitiatedTime) - new Date(a.InitiatedTime);
                });
                this.setState({meneytobanklist:sortedlist})
            }
            else{
                message.error(`error ${data.tag}`)
            }
        });
    }
    handleCancel = () => {
        if(this.state.addLoading===false)
        {
            this.setState({ showModal: false });
        } 
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ addLoading: true });
                this.props.fetchData('/sendmoneytobank', values, (data) => {
                    if (data.tag === 0) {
                        this.setState({ addLoading: false,showModal: false });
                        this.getlist();
                        this.props.getUserInfo();
                    }
                    else if (data.tag === 1) {
                        this.setState({ addLoading: false});
                        message.error('Amount is over your balance');
                    }
                    else if (data.tag === 2) {
                        this.setState({ addLoading: false});
                        message.error('This card is not verified');
                    }
                    else if (data.tag === 3) {
                        this.setState({ addLoading: false});
                        message.error('Amount is over single limit');
                    }
                    else if (data.tag === 4) {
                        this.setState({ addLoading: false});
                        message.error('Amount is over rolling limitation of withdraw');
                    }
                    else if (data.tag === 5) {
                        this.setState({ addLoading: false});
                        message.error('This bank acount is not yours');
                    }
                });
                console.log('Received values of form: ', values);
            }
        });
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const bkerror = isFieldTouched('bid') && getFieldError('bid');
        const acnnumerror = isFieldTouched('anum') && getFieldError('anum');
        const amterror = isFieldTouched('amount') && getFieldError('amount');
        return (
            <div>
                <Button onClick={() => { this.setState({showModal:true}) }} type="primary">Withdraw</Button>
                <Modal
                        title="Modal"
                        visible={this.state.showModal}
                        onCancel={this.handleCancel}
                        footer={[
                        ]}
                    >
                        <Form layout="inline" onSubmit={this.handleSubmit}>
                            <FormItem
                                validateStatus={bkerror ? 'error' : ''}
                                help={bkerror || ''}
                            >
                                {getFieldDecorator('bid', {
                                    rules: [{ required: true, message: 'Please input your Bank ID!' },{len:15,message:'Please input 15 letter'}],
                                })(
                                    <Input  placeholder="Bank ID" />
                                )}
                            </FormItem>
                            <FormItem
                                validateStatus={acnnumerror ? 'error' : ''}
                                help={acnnumerror || ''}
                            >
                                {getFieldDecorator('anum', {
                                    rules: [{ required: true, message: 'Please input your Bank Acount Number!'},{len:15,message:'Please input 15 letter'}],
                                })(
                                    <Input  placeholder="Bank Acount Number" />
                                )}
                            </FormItem>
                            <FormItem
                                validateStatus={amterror ? 'error' : ''}
                                help={amterror || ''}
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
                                    <Input  placeholder="Amount" />
                                )}
                            </FormItem>
                            <FormItem>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    disabled={hasErrors(getFieldsError())}
                                    loading ={this.state.addLoading}
                                >
                                    Submit
                            </Button>
                            </FormItem>
                        </Form>
                    </Modal>
                <Table dataSource={this.state.meneytobanklist}>
                    <Column
                        title="Transaction ID"
                        dataIndex="Id"
                        key="Id"
                    />
                    <Column
                        title="Amount"
                        dataIndex="Amount"
                        key="Amount"
                    />
                    <Column
                        title="Bank ID"
                        dataIndex="BankId"
                        key="BankId"
                    />
                    <Column
                        title="Bank AccountNumber"
                        dataIndex="AccountNumber"
                        key="AccountNumber"
                    />
                    <Column
                        title="Type"
                        dataIndex="Type"
                        key="Type"
                        render={(text, record, index) => {
                            return (<div style={{"flex-direction": "row"}}>{text==='F'?("Transfer in"):("Withdraw")}</div>)
                        }}
                    />
                    <Column
                        title="InitiatedTime"
                        dataIndex="InitiatedTime"
                        key="InitiatedTime"
                        render={(text, record, index) => {
                            var date = new Date(text);
                            return (<div>{date.toLocaleString()}</div>)
                        }}
                    />
                </Table>
            </div>
        )
    }
}
const WrappedMoneytoBank = Form.create()(MoneytoBank);
export default WrappedMoneytoBank;