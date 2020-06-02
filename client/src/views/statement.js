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
export default class Statement extends Component {
    state = { 
        statements: [],
        statementtype:'1',
    }
    
    componentDidMount() {
        //this.getStatement('2009-10-9','2019-10-9')
        this.getLastMonthStatement(val);
    }
    getStatement = (startDate,endDate) => {
        this.props.fetchData('/selectdatestatement', { startdata: startDate, endDate: endDate }, (data) => {
            if (data.tag === 0) {
                var sortedstatement = data.statements.sort(function (a, b) {
                    return new Date(b.inittime) - new Date(a.inittime);
                });
                this.setState({
                    statements: sortedstatement
                })
                console.log(sortedstatement);
            }
            else {

            }
        });
    }
    cancelSendTransaction = (id) => {
        this.props.fetchData('/canceltransaction', { transactionId: id }, (data) => {
            if (data.tag === 0) {
                message.success('sucess')
                this.props.getUserInfo();
                if(this.state.statementtype==='4')
                {
                    this.getStatement(sd,ed)
                }
                else{
                    this.getLastMonthStatement(val);
                }
                
            }
            else {
                message.error(`error ${data.tag}`)
            }
        });
    }
    payReqeustTransaction = (id) => {
        this.props.fetchData('/payrequest', { transactionId: id }, (data) => {
            if (data.tag === 0) {
                message.success('sucess')
                this.props.getUserInfo();
                if(this.state.statementtype==='4')
                {
                    this.getStatement(sd,ed)
                }
                else{
                    this.getLastMonthStatement(val);
                }
            }
            else if(data.tag===1)
            {
                message.error(`Your balance is not enough and you do not have primary bank card`)
            }else if (data.tag === 2) {
                message.error('Amount of payment is over the payment limitation');
            }
            else {
                message.error(`error ${data.tag}`)
            }
        });
    }

    convertUTCDateToLocalDate(date) {
        var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();

        newDate.setHours(hours - offset);

        return newDate;
    }

    getLastMonthStatement=(num)=>{
        var dateAgo = moment().subtract(num, 'months');
        this.getStatement(dateAgo.format(),moment().subtract(0, 'months').format())
    }

    handleSizeChange = (e) => {
        this.setState({ statementtype: e.target.value });
        switch(e.target.value){
            case "1":{
                this.getLastMonthStatement(3)
                val=3
                break;
            }
            case "2":{
                this.getLastMonthStatement(6)
                val=6
                break;
            }
            case "3":{
                this.getLastMonthStatement(12)
                val=12
                break;
            }
            case "4":{
                //this.getStatement('2009-10-9','2019-10-9')
                break;
            }
            default:{
                break;
            }
        }
      }
    pickedDate=(moments)=>{
        console.log(moments)
        this.getStatement(moments[0].format(),moments[1].format())
    }
    datapikcer(){
        var d=moment().format(dateFormat)
        if(this.state.statementtype==='4')
        {
            return( <RangePicker
                defaultValue={[moment(moment().format(dateFormat) ,dateFormat),moment( moment().format(dateFormat),dateFormat)]} format={dateFormat} onChange={this.pickedDate}/>)
        }   
    }
    render() {
        return (
            <div>
                <div style={{ "flex-direction": "column" }}>
                    <Radio.Group value={this.state.statementtype} onChange={this.handleSizeChange}>
                        <Radio.Button value="1">Last 3 Months</Radio.Button>
                        <Radio.Button value="2">Last 6 Months</Radio.Button>
                        <Radio.Button value="3">Last 1 year</Radio.Button>
                        <Radio.Button value="4">Select Date</Radio.Button>
                    </Radio.Group>
                    {this.datapikcer()}
                </div>
                <Table dataSource={this.state.statements}>
                    <Column
                        title="Transaction ID"
                        dataIndex="id"
                        key="id"
                    />
                    <Column
                        title="Amount"
                        dataIndex="amount"
                        key="amount"
                    />
                    <Column
                        title="Transaction Type"
                        dataIndex="type"
                        key="type"
                        render={(text, record, index) => {
                            var type = record.type
                            switch (type) {
                                case 0: {
                                    return (<div>Send money to</div>)
                                }
                                case 1: {
                                    return (<div>pay the request money of</div>)
                                }
                                case 2: {
                                    return (<div>money send from </div>)
                                }
                                case 3: {
                                    return (<div>request from</div>)
                                }
                                default: {
                                    return (<div>unknow</div>)
                                }
                            }
                        }}
                    />
                    <Column
                        title="Target"
                        dataIndex="target"
                        key="target"
                        render={(text, record, index) => {
                            var row = record
                            return (<div style={{"flex-direction": "row"}}>{row.target?(undefined):(<div>Unregister:</div>)}{row.target||(row.email||row.phone)}</div>)
                        }}
                    />
                    <Column
                        title="Memo"
                        dataIndex="memo"
                        key="memo"
                    />
                    <Column
                        title="InitiatedTime"
                        dataIndex="inittime"
                        key="inittime"
                        render={(text, record, index) => {
                            var date = new Date(text);
                            return (<div>{date.toLocaleString()}</div>)
                        }}
                    />
                    <Column
                        title="Status"
                        dataIndex="tstatus"
                        key="tstatus"
                    />
                    <Column
                        title="Action"
                        key="action"
                        render={(text, record, index) => {
                            var row = record
                            if (row.type === 0 && row.tstatus === "pending") {
                                var today = new Date();
                                var inittime = new Date(row.inittime);
                                var diffMs = (today - inittime);
                                var minutes = Math.floor((diffMs / 1000) / 60);
                                if (minutes < 10) {
                                    return (<Button onClick={() => { this.cancelSendTransaction(row.id) }} type="primary">Cancel</Button>);
                                }
                            }
                            else if (row.type === 1 && row.tstatus === "started") {
                                return (<Button onClick={() => { this.payReqeustTransaction(row.id) }} type="primary">Pay</Button>);
                            }

                        }}
                    />
                </Table>
            </div>
        )
    }
}