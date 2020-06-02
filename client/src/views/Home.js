import { Layout, Menu, Breadcrumb, Icon,Button } from 'antd';
import React, { Component } from 'react';
import Info from './info';
import BankCard from './bankcard'
import Phone from './Phone'
import Email from './email'
import SendMoney from './sendMoney'
import RequestMoney from './requestMoney'
import Statement from './statement'
import MoneytoBankList from './moneytobanklist'
import { Buffer } from 'buffer';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default class Home extends Component {
    state={
        selectedMenu:'1'
    }
    handleClickMenu = (e) => {
        this.setState({selectedMenu:e.key})
    }

    pageShow(){
        if(this.state.selectedMenu==='1')
        {
            return (
                <Info getUserInfo={this.props.getUserInfo} fetchData={(url, params, func) => this.props.fetchData(url, params, func)} userInfo={this.props.userInfo}/>
            )
        }
        else if(this.state.selectedMenu==='2'){
            return (
                <BankCard getUserInfo={this.props.getUserInfo} fetchData={(url, params, func) => this.props.fetchData(url, params, func)} userInfo={this.props.userInfo}/>
            )
        }
        else if(this.state.selectedMenu==='3'){
            return (
                <Phone getUserInfo={this.props.getUserInfo} fetchData={(url, params, func) => this.props.fetchData(url, params, func)} userInfo={this.props.userInfo}/>
            )
        }else if(this.state.selectedMenu==='4'){
            return (
                <Email getUserInfo={this.props.getUserInfo} fetchData={(url, params, func) => this.props.fetchData(url, params, func)} userInfo={this.props.userInfo}/>
            )
        }else if(this.state.selectedMenu==='5'){
            return (
                <SendMoney getUserInfo={this.props.getUserInfo} fetchData={(url, params, func) => this.props.fetchData(url, params, func)} userInfo={this.props.userInfo}/>
            )
        }
        else if(this.state.selectedMenu==='6'){
            return (
                <RequestMoney getUserInfo={this.props.getUserInfo} fetchData={(url, params, func) => this.props.fetchData(url, params, func)} userInfo={this.props.userInfo}/>
            )
        }
        else if(this.state.selectedMenu==='7'){
            return (
                <Statement getUserInfo={this.props.getUserInfo} fetchData={(url, params, func) => this.props.fetchData(url, params, func)} userInfo={this.props.userInfo}/>
            )
        }
        else if(this.state.selectedMenu==='8'){
            return (
                <MoneytoBankList getUserInfo={this.props.getUserInfo} fetchData={(url, params, func) => this.props.fetchData(url, params, func)} userInfo={this.props.userInfo}/>
            )
        }
    }

    logOut=()=>{
        this.props.fetchData('/logout', {}, (data) => {
            
        });
    }
    
    render() {
        return (
            <Layout>
                <Button onClick={this.logOut} type="primary">Log Out</Button>
                <Header style={{textAlign:'left'}} className="header">
                    <div className="logo" />
                    <div style={{color:'white'}}>{"Name:"+String(this.props.userInfo.NAME)+" ,Balance:"+String(this.props.userInfo.Balance)+" ,PendingBalance:"+String(this.props.userInfo.PendingBalance)+",Withdraw limit:"+String(this.props.userInfo.ToBankRollingLimit)+",Payment limit:"+String(this.props.userInfo.paymentRollingLimit)+",Single withdraw limit:"+String(this.props.userInfo.SingleToBankLimit)}  </div> 
                </Header>
                <Layout>
                    <Sider width={200} style={{ background: '#fff' }}>
                        <Menu
                            onClick={this.handleClickMenu}
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1','sub2']}
                            style={{ height: '100%', borderRight: 0 }}
                        >
                            <SubMenu key="sub1" title={<span><Icon type="user" />User</span>}>
                                <Menu.Item key="1">Info</Menu.Item>
                                <Menu.Item key="2">BankCard</Menu.Item>
                                <Menu.Item key="3">Mobile</Menu.Item>
                                <Menu.Item key="4">Email</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub2" title={<span><Icon type="dollar" />Transaction</span>}>
                                <Menu.Item key="5">Send Money</Menu.Item>
                                <Menu.Item key="6">Request Money</Menu.Item>
                                <Menu.Item key="7">statement</Menu.Item>
                                <Menu.Item key="8">Send Money to bank</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                            {this.pageShow()}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}
