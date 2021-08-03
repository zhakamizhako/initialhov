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

const { Header, Content, Footer } = Layout;

import { Wrapper, Grid } from "react-auto-grid";

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
            <div style={{ marginTop: 20 }}>
              <Pagination showQuickJumper current={this.state.currentPage} total={this.state.data.characters.info.pages} onChange={(e) => this.changePage(e)} />
              <Row>
                {this.state.data && this.state.data.characters.results.map(entry => (
                  <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                    <CharacterCard name={entry.name} image={entry.image} />
                  </Col>
                ))}
              </Row>
              {console.log(this.state.data)}
              <Pagination showQuickJumper current={this.state.currentPage} total={this.state.data.characters.info.pages} onChange={(e) => this.changePage(e)} />
            </div>
          )}

        </Layout>
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
