import { Table, Button,Modal,Form,Input,message } from 'antd';
import React, { Component } from 'react';
const { Column } = Table;
const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class Email extends Component {
    state = {
        data: [],
        showModal:false,
        addLoading:false
    }
    componentDidMount() {
        this.getPhoneandEmail();
        this.props.form.validateFields();
    }
    getPhoneandEmail = () => {
        this.props.fetchData('/getuserphoneandemail', {}, (data) => {
            if (data.tag === 0) {
                this.setState({
                    data: data.email
                })
            }
        });
    }
    removeEmail = (email) => {
        this.props.fetchData('/removeemail', { email:email }, (data) => {
            if (data.tag === 0) {
                this.getPhoneandEmail();
            }
            else 
            {
                message.error('You only have this verified email link to account');
            }
        });
    }
    verifyEmail=(email) => {
        this.props.fetchData('/verifyemail', { email:email }, (data) => {
            if (data.tag === 0) {
                this.getPhoneandEmail();
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
                this.props.fetchData('/addemail', values, (data) => {
                    if (data.tag === 0) {
                        this.setState({ addLoading: false,showModal: false });
                        this.getPhoneandEmail();
                    }
                    else if (data.tag === 1) {
                        this.setState({ addLoading: false});
                        message.error('email have use by others');
                    }
                    else if (data.tag === 2) {
                        this.setState({ addLoading: false});
                        message.error('You already have this email');
                    }
                });
                console.log('Received values of form: ', values);
            }
        });
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const bkerror = isFieldTouched('email') && getFieldError('email');
        return (
            <div>
                <Button onClick={() => { this.setState({showModal:true}) }} type="primary">Add E-mail</Button>
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
                                {getFieldDecorator('email', {
                                    rules: [{ required: true, message: 'Please input your E-mail!' },{type: 'email', message: 'The input is not valid E-mail!'}],
                                })(
                                    <Input  placeholder="E-mail" />
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
                        title="E-mail"
                        dataIndex="EmailAddress"
                        key="EmailAddress"
                    />
                    <Column
                        title="Verification"
                        dataIndex="Status"
                        key="Status"
                        render={(text, record, index) => {
                            if (this.state.data[index].Status === 'verified') {
                                return (<div>Yes</div>)
                            }
                            else {
                                var row = this.state.data[index]
                                console.log(row)
                                return (
                                    <Button onClick={() => { this.verifyEmail(row.EmailAddress) }} type="primary">Verify</Button>
                                )
                            }
                        }}
                    />
                    <Column
                        title="Action"
                        key="action"
                        render={(text, record, index) => {
                            var row = this.state.data[index]
                            return (<Button onClick={() => { this.removeEmail(row.EmailAddress) }} type="primary">Delete</Button>);
                        }}
                    />
                </Table>
            </div>

        );
    }
}

const WrappedEmail = Form.create()(Email);
export default WrappedEmail;