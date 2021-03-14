import React from 'react';
import './App.css';
import starlinkLogo from './images/starlink_logo.svg';
import { Layout } from 'antd';
import Main from './components/Main';

const { Header, Footer, Content } = Layout;

function App() {
  return (
    <Layout>
      <Header>
        <p className="title">
        Tracking <img src={starlinkLogo} className="App-logo" alt="logo"></img>  
        Satellites
        </p>
      </Header>
      <Content>
        <Main />
      </Content>
      <Footer>
        (c)2021 Tracking Starlink Satellites. All Rights Reserved. Website Made by Shuyan.
      </Footer>
    </Layout>
  );
}

export default App;
