import { Form, Icon, Input, Button, message, Modal, Tooltip } from 'antd';
import React, { Component } from 'react';
import './Login.css'
const FormItem = Form.Item;


class NormalLoginForm extends Component {
    state = {
        loginloading: false,
    }
    handleLogin = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            if (!err) {
                this.setState({ loginloading: true });
                this.props.fetchData('/login', values, (data) => {
                    this.setState({ loginloading: false });
                    if (data.tag === 0) {
                        this.props.setLogin(true);
                    }
                    else {
                        message.error('account or password is incorrect');
                    }
                });
                console.log('Received values of form: ', values);
            }
        });

    }

    handleOk = () => {
        this.setState({ registloading: true });
        setTimeout(() => {
            this.setState({ registloading: false, visible: false });
        }, 3000);
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }

    

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form onSubmit={this.handleLogin} className="login-form">
                    <FormItem>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="E-mail or phone" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button loading={this.state.loginloading} type="primary" htmlType="submit" className="login-form-button">
                            {this.state.loading ? 'Logging' : 'Log in'}
                        </Button>
                        Or <Button type="dashed" onClick={() => this.props.swtichPage(true)}>register now!</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm;