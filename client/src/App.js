import React, { Component } from 'react';
import Home from './views/Home'
import Loginform from './views/Login'
import Regist from './views/Register'
import './App.css';

class App extends Component {
  state = {
    loginStatus: false,
    regist: false,
    userInfo: {},
    loading: true
  }
  componentDidMount() {
    this.getUserInfo()
  }
  getUserInfo=()=>{
    fetch('/getuserinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    }).then(res => res.json())
      .then(data => {
        console.log(data)
        this.setState({ loading: false })
        if (data.tag === -10) {
          this.setState({ loginStatus: false });
        }
        else {
          this.setState({ userInfo: data.info,loginStatus: true })
        }
      });
  }
  fetchData(url, params, func) {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    }).then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.tag === -10) {
          this.setState({ loginStatus: false });
        }
        else {
          func(data);
        }
      });
  }

  onLogin = (login) => {
    if (this.state.loginStatus === false && login === true) {
      this.fetchData('/getuserinfo', {}, (data) => {
        this.setState({ userInfo: data.info })
      })
    }
    this.setState({ loginStatus: login })
  }
  pageswitch() {
    if (this.state.loading) {
      return (<div />);
    }
    else if (this.state.loginStatus) {
      return (<Home getUserInfo={this.getUserInfo} userInfo={this.state.userInfo} fetchData={(url, params, func) => this.fetchData(url, params, func)} setLogin={this.onLogin} />);
    }
    else if (this.state.regist === false) {
      return (<Loginform
        fetchData={(url, params, func) => this.fetchData(url, params, func)}
        setLogin={this.onLogin}
        swtichPage={(ifregist) => this.setState({ regist: ifregist })}
      />);
    }
    else {
      return (<Regist
        fetchData={(url, params, func) => this.fetchData(url, params, func)}
        setLogin={this.onLogin}
        swtichPage={(ifregist) => this.setState({ regist: ifregist })}
      />);
    }
  }
  render() {
    return (
      <div className="App" >
        {this.pageswitch()}
      </div>
    );
  }
}

export default App;