import React, { Component } from 'react'
import { Button, Modal, Form, Icon, Input,message } from 'antd'
const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class Info extends Component {

    state = {
        modalVisible: false,
        verifyLoading: false
    }
    componentDidMount(){
        this.props.form.validateFields();
    }
    showModal = () => {
        this.setState({
            modalVisible: true,
        });
    }
    handleCancel = () => {
        if(this.state.verifyLoading===false)
        {
            this.setState({ modalVisible: false });
        } 
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ loginloading: true });
                this.props.fetchData('/verifyssn', values, (data) => {
                    if (data.tag === 0) {
                        this.setState({ verifyLoading: false,modalVisible: false });
                        this.props.getUserInfo()
                    }
                    else {
                        this.setState({ verifyLoading: false, });
                        message.error('account or password is incorrect');
                    }
                });
                console.log('Received values of form: ', values);
            }
        });
    }
    ssn() {
        if (this.props.userInfo.SSN === '' || this.props.userInfo.SSN === undefined ||this.props.userInfo.SSN === null) {
            return (
                <div>
                    SSN is unverified.
                </div>
            )
        }
        else {
            return (
                <div>
                    {'SSN:' + String(this.props.userInfo.SSN)}
                </div>
            )
        }
    }
    showVerifySSN(getFieldDecorator, getFieldsError, getFieldError, isFieldTouched) {
        if (this.props.userInfo.SSN === '' || this.props.userInfo.SSN === undefined ||this.props.userInfo.SSN === null) {

            // Only show error after a field is touched.
            const userNameError = isFieldTouched('name') && getFieldError('name');
            const passwordError = isFieldTouched('ssn') && getFieldError('ssn');
            return (
                <div>
                    <Button onClick={this.showModal} type="primary">Verify SSN</Button>
                    <Modal
                        title="Modal"
                        visible={this.state.modalVisible}
                        onCancel={this.handleCancel}
                        footer={[
                        ]}
                    >
                        <Form layout="inline" onSubmit={this.handleSubmit}>
                            <FormItem
                                validateStatus={userNameError ? 'error' : ''}
                                help={userNameError || ''}
                            >
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: 'Please input your name!' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Name" />
                                )}
                            </FormItem>
                            <FormItem
                                validateStatus={passwordError ? 'error' : ''}
                                help={passwordError || ''}
                            >
                                {getFieldDecorator('ssn', {
                                    rules: [{ required: true, message: 'Please input your SSN!' },{len:15,message:'Please input 15 letter'}],
                                })(
                                    <Input prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="SSN" />
                                )}
                            </FormItem>
                            <FormItem>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    disabled={hasErrors(getFieldsError())}
                                    loading ={this.state.verifyLoading}
                                >
                                    Submit
                            </Button>
                            </FormItem>
                        </Form>
                    </Modal>
                </div>

            )
        }
        else {
            return (
                <div />
            )
        }
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        return (
            <div>
                {this.showVerifySSN(getFieldDecorator, getFieldsError, getFieldError, isFieldTouched)}
                <div>
                    {'Name:' + String(this.props.userInfo.NAME)}
                </div>
                <div>
                    {this.ssn()}
                </div>
            </div>
        );
    }
}

const WrappedInfo = Form.create()(Info);

export default WrappedInfo;