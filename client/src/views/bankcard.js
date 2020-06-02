import { Table, Button,Modal,Form,Input,message } from 'antd';
import React, { Component } from 'react';
const { Column } = Table;
const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class BankCard extends Component {
    state = {
        data: [],
        showModal:false,
        addLoading:false
    }
    componentDidMount() {
        this.getCardList();
        this.props.form.validateFields();
    }
    getCardList = () => {
        this.props.fetchData('/cardlist', {}, (data) => {
            if (data.tag === 0) {
                this.setState({
                    data: data.cardlist
                })
            }
        });
    }
    setPrimary = (bkid, acnum) => {
        this.props.fetchData('/setprimarybankcard', { bankid: bkid, accountnumber: acnum }, (data) => {
            if (data.tag === 0) {
                this.getCardList();
            }
        });
    }
    verifybankcar=(bkid, acnum) => {
        this.props.fetchData('/verifybankcard', { bankid: bkid, accountnumber: acnum }, (data) => {
            if (data.tag === 0) {
                this.getCardList();
            }
        });
    }
    removeCard = (bkid, acnum) => {
        this.props.fetchData('/removebankcard', { bankid: bkid, accountnumber: acnum }, (data) => {
            if (data.tag === 0) {
                this.getCardList();
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
                this.props.fetchData('/addbankcard', values, (data) => {
                    if (data.tag === 0) {
                        this.setState({ addLoading: false,showModal: false });
                        this.getCardList();
                    }
                    else if (data.tag === 1) {
                        this.setState({ addLoading: false});
                        message.error('You already has this bank account');
                    }
                    else if (data.tag === 2) {
                        this.setState({ addLoading: false});
                        message.error('account or password is incorrect');
                    }
                });
                console.log('Received values of form: ', values);
            }
        });
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const bkerror = isFieldTouched('bankid') && getFieldError('bankid');
        const acnnumerror = isFieldTouched('accountnumber') && getFieldError('accountnumber');
        return (
            <div>
                <Button onClick={() => { this.setState({showModal:true}) }} type="primary">Add Bank Card</Button>
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
                                {getFieldDecorator('bankid', {
                                    rules: [{ required: true, message: 'Please input your Bank ID!' },{len:15,message:'Please input 15 letter'}],
                                })(
                                    <Input  placeholder="Bank ID" />
                                )}
                            </FormItem>
                            <FormItem
                                validateStatus={acnnumerror ? 'error' : ''}
                                help={acnnumerror || ''}
                            >
                                {getFieldDecorator('accountnumber', {
                                    rules: [{ required: true, message: 'Please input your Bank Acount Number!'},{len:15,message:'Please input 15 letter'}],
                                })(
                                    <Input  placeholder="Bank Acount Number" />
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
                <Table dataSource={this.state.data}>
                    <Column
                        title="Bank ID"
                        dataIndex="BankId"
                        key="BankId"
                    />
                    <Column
                        title="Bank Account"
                        dataIndex="AccountNumber"
                        key="AccountNumber"
                    />
                    <Column
                        title="Primary Account"
                        dataIndex="IsPrimary"
                        key="IsPrimary"
                        render={(text, record, index) => {
                            if (this.state.data[index].IsPrimary === 'Y') {
                                return (<div>Yes</div>)
                            }
                            else {

                                var row = this.state.data[index]
                                console.log(row)
                                return (
                                    <Button onClick={() => { this.setPrimary(row.BankId, row.AccountNumber) }} type="primary">Set Primary Card</Button>
                                )
                            }
                        }}
                    />
                    <Column
                        title="Verified"
                        dataIndex="verified"
                        key="verified"
                        render={(text, record, index) => {
                            if (this.state.data[index].verified === 'Y') {
                                return (<div>Yes</div>)
                            }
                            else {

                                var row = this.state.data[index]
                                console.log(row)
                                return (
                                    <Button onClick={() => { this.verifybankcar(row.BankId, row.AccountNumber) }} type="primary">Verify</Button>
                                )
                            }
                        }}
                    />
                    <Column
                        title="Action"
                        key="action"
                        render={(text, record, index) => {
                            var row = this.state.data[index]
                            return (<Button onClick={() => { this.removeCard(row.BankId, row.AccountNumber) }} type="primary">Delete</Button>);
                        }}
                    />
                </Table>
            </div>

        );
    }
}

const WrappedBankCard = Form.create()(BankCard);
export default WrappedBankCard;