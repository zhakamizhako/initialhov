import logo from "./logo.svg";
import React, { Component } from "react";
import "./App.css";
import { Layout, Menu } from "antd";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

import "antd/dist/antd.css";

const { Header, Content, Footer } = Layout;

const client = new ApolloClient({
  uri: "https://rickandmortyapi.com/graphql",
  cache: new InMemoryCache(),
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isFetching: false,
      data: [],
    };
  }

  componentDidMount() {
    console.log("whoop, whoop.");
  }

  async Fetch(){
    
  }

  render() {
    return (
      <div className="App">
        <Layout className="layout">
          <Header title="Atlas">
            <div className="logo"></div>
            <Menu theme="dark" mode="horizontal">
              Rick n' Morty Info
            </Menu>
          </Header>
        </Layout>
      </div>
    );
  }
}

export default App;
