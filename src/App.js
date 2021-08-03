import logo from "./logo.svg";
import React, { Component } from "react";
import "./App.css";
import { Layout, Menu, Row, Col, Pagination } from "antd";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

import "antd/dist/antd.css";
import CharacterCard from './Content/CharacterInfo.js'

import { Wrapper, Grid } from "react-auto-grid";

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
      data: null,
      currentCharacterData: {},
      query: null,
      currentPage: 1,
      currentCharacterPage: 1,
      episodeListPage: 1,

    };
  }

  componentDidMount() {
    console.log("whoop, whoop.");
    this.initialFetch(1)
  }

  async fetchCharacterData(id) {
    client.query({
      query: gql`
      query{
        character(id:${id}){
            name,
            status,
            species,
            type,
            gender,
            origin {
              name
            },
            location{
              name,
              dimension,
              type
            },
            image,
            episode {
              name,
              air_date,
              episode,
            }
        }
      }
      `
    })
      .then(result => {
        console.log(result)
        this.setState({ data: result.data })
      })
      .catch(error => {
        this.setState({ error: error })
      })
  }

  async changePage(x) {
    this.setState(state => {
      let { currentPage } = state
      currentPage = x
      this.initialFetch(x)

      return { currentPage }
    })
  }

  async initialFetch(x) {
    client.query({
      query: gql`
      query{
        characters(page:${x}){
          info{
            count,
            pages
          }
          results {
            name,
            status,
            species,
            type,
            gender,
            origin {
              name
            },
            location{
              name,
              dimension,
              type
            },
            image,
            episode {
              name,
              air_date,
              episode,
            }
          }
        }
      }
      `
    })
      .then(result => {
        console.log(result)
        this.setState({ data: result.data })
      })
      .catch(error => {
        this.setState({ error: error })
      })
  }

  render() {
    return (
      <div className="App">
        <Layout className="layout">
          <Header>
            <div className="logo"></div>
            <Menu theme="dark" mode="horizontal">
              Rick n' Morty Info
            </Menu>
          </Header>

          {this.state.data && (
            <div style={{ marginTop: 20}}>
              <Pagination showQuickJumper current={this.state.currentPage} total={this.state.data.characters.info.pages} onChange={(e) => this.changePage(e)} />
              <div style={{marginTop:20, marginBottom:10}}>
              <Row>
                {this.state.data && this.state.data.characters.results.map(entry => (
                  <Col   xs={{ span: 2, offset: 1 }} lg={{ span: 1, offset: 1, }}>
                    <CharacterCard name={entry.name} image={entry.image} gender={entry.gender} type={entry.type} />
                  </Col>
                ))}
              </Row>
              {console.log(this.state.data)}
              </div>
              {console.log(this.state.data.characters.info.pages)}
              <Pagination showQuickJumper current={this.state.currentPage} total={this.state.data.characters.info.pages} onChange={(e) => this.changePage(e)} />
            </div>
          )}

        </Layout>
        <Footer style={{bottom:1}}>
          Rick n' Morty Info
          Based on rickandmortyapi.com's GraphQL API
        </Footer>
      </div>
    );
  }
}

const styles = {
  bodyMargin: {
    paddingBottom: 20

  },
};

export default App;
