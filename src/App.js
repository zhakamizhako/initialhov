import logo from './logo.svg';
import React, { Component } from 'react'
import './App.css';
import { Layout, Menu } from 'antd';

const { Header, Content, Footer } = Layout;
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

import 'antd/dist/antd.css';

const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql',
  cache: new InMemoryCache()
});

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    console.log('whoop, whoop.')
  }


  render() {
    return (<div className="App">
      <Layout className="layout">
        <Header title="Atlas">
          <div className="logo"></div>
          <Menu theme="dark" mode="horizontal">
            Rick n' Morty Info
          </Menu>
        </Header>


      </Layout>
    </div>)
  }
}

// function App() {
//   return (

//   );
// }

export default App;
