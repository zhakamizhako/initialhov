import logo from "./logo.svg";
import React, { Component } from "react";
import "./App.css";
import { Layout, Menu, Row, Col, Pagination, notification, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

import "antd/dist/antd.css";
import CharacterCard from './Content/CharacterCard.js'
import LocationTable from './Content/LocationTable.js'

import { Wrapper, Grid } from "react-auto-grid";
import Sider from "antd/lib/layout/Sider";
import EpisodeTable from "./Content/EpisodeTable";

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

      dataCharacters: null,
      dataSelectedCharacter: null,

      dataLocation: null,
      dataSelectedLocation: null,

      currentCharacterData: {},
      query: null,

      currentPageLocation: 1,
      currentCharacterPage: 1,
      currentPageEpisode: 1,

      selectedLocationId: null,
      seletedEpisodeId: null,
      selectedCharId: null,

      mode: 0, // 0 - character view, 1 - viewing character, 2 - episode list, 3 - viewing episode, 4 - location list, 5 - location listing
    };

    this.clickHandlerCharacterSelect = this.clickHandlerCharacterSelect.bind(this);
  }

  componentDidMount() {
    console.log("whoop, whoop.");
    this.GetCharacters(1)
    this.fetchLocations(1)
    this.fetchEpisodes(1)
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
        this.setState({ dataCharacters: result.data })
      })
      .catch(error => {
        notification.error({
          message: "Query Failed",
          description: error.message,
          placement: 'topRight'
        })
        this.setState({ error: error })
      })
  }

  async fetchLocations(x) {
    client.query({
      query: gql`query{
        locations(page:${x}){
          info{
            count,
            pages
          }
          results {
            id,
            name,
            dimension,
            type
          }
        }
      }`
    }).then(result => {
      console.log(result)
      this.setState({ dataLocation: result.data, isFetching: false })
    })
      .catch(error => {
        notification.error({
          message: "Query Failed",
          description: error.message,
          placement: 'topRight'
        })
        this.setState({ error: error })
      })
  }

  async fetchLocationData() {

  }

  async fetchEpisodes(x) {
    client.query({
      query: gql`
        query{
          episodes(page:${x}){
            info{
              count,
              pages
            }
            results {
                id,
              name,
              air_date,
              episode
            }
          }
        }`
    }).then(result => {
      console.log('episode')
      console.log(result)
      this.setState({ dataEpisodes: result.data, isFetching: false })
    })
      .catch(error => {
        notification.error({
          message: "Query Failed",
          description: error.message,
          placement: 'topRight'
        })
        this.setState({ error: error })
      })
  }

  async fetchEpisodeData() {

  }

  async changePageCharacters(x) {
    this.setState(state => {
      let { currentCharacterPage, isFetching } = state
      isFetching = true
      currentCharacterPage = x
      this.GetCharacters(x)

      return { currentCharacterPage, isFetching }
    })
  }

  async changePageLocation(x) {
    this.setState(state => {
      let { currentPageLocation, isFetching } = state
      isFetching = true
      currentPageLocation = x
      this.fetchLocations(x)

      return { currentPageLocation, isFetching }
    })
  }

  async changePageEpisode(x) {
    this.setState(state => {
      let { currentPageEpisode, isFetching } = state
      isFetching = true
      currentPageEpisode = x
      this.fetchEpisodes(x)

      return { currentPageEpisode, isFetching }
    })
  }

  async clickHandlerCharacterSelect(data) {
    console.log('eh')
    console.log(data)
    this.setState({ selectedCharId: data })
  }

  async GetCharacters(x) {
    client.query({
      query: gql`
      query{
        characters(page:${x}){
          info{ count, pages }
          results { id, name, status, species, type, gender, origin { name }, image,  }
        }
      }
      `
    })
      .then(result => {
        console.log(result)
        this.setState({ dataCharacters: result.data, isFetching: false })
      })
      .catch(error => {
        notification.error({
          message: "Query Failed",
          description: error.message,
          placement: 'topRight'
        })
        this.setState({ error: error })
      })
  }

  handleMenu(mode) {
    this.setState({ mode: mode })
  }

  render() {
    return (
      <div className="App">
        <Layout className="layout">
          <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <div className="logo"></div>
            {/* <Sider breakpoint="lg" collapsedWidth="0"> */}
            {/* <div> */}
            <Menu mode="horizontal" theme="dark" defaultActiveFirst={2} >
              <Menu.Item key="1" >
                Rick n' Morty Info
              </Menu.Item>
              <Menu.Item key="2" onClick={() => this.handleMenu(0)} >
                Characters
              </Menu.Item>
              <Menu.Item key="3" onClick={() => this.handleMenu(4)}>
                Locations
              </Menu.Item>
              <Menu.Item key="4" onClick={() => this.handleMenu(2)}>
                Episodes
              </Menu.Item>
            </Menu>
            {/* </div> */}
            {/* </Sider> */}
          </Header>

          <Content style={{ marginTop: 64 }}>



            {this.state.mode == 0 && (

              this.state.dataCharacters && (
                <div style={{ marginTop: 20, marginLeft: 20, marginRight: 20, alignContent: 'center' }}>
                  <Pagination defaultPageSize={1} showQuickJumper current={this.state.currentCharacterPage} total={this.state.dataCharacters.characters.info.pages} onChange={(e) => this.changePageCharacters(e)} />
                  {this.state.isFetching ? (<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />) : <div style={{ paddingBottom: 27 }} />}
                  <div style={{ marginTop: 20, marginBottom: 10 }}>
                    <Row style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                      {this.state.dataCharacters && this.state.dataCharacters.characters.results.map(entry => (
                        <Col style={styles.colSpacer}>
                          <CharacterCard clickHandler={this.clickHandlerCharacterSelect} id={entry.id} name={entry.name} species={entry.species} image={entry.image} gender={entry.gender} type={entry.type} status={entry.status} isClicked={entry.id == this.state.selectedCharId} />
                        </Col>
                      ))}
                    </Row>
                    {console.log(this.state.dataCharacters)}
                  </div>
                  {console.log(this.state.dataCharacters.characters.info.pages)}

                  {this.state.isFetching ? (<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />) : <div style={{ paddingBottom: 27 }} />}
                  <Pagination defaultPageSize={1} showQuickJumper current={this.state.currentCharacterPage} total={this.state.dataCharacters.characters.info.pages} onChange={(e) => this.changePageCharacters(e)} />
                </div>
              )

            )}

            {this.state.mode == 4 && (
              <div style={{ marginTop: 20, marginLeft: 20, marginRight: 20, alignContent: 'center' }}>
                {console.log(this.state.dataLocation)}
                <Pagination defaultPageSize={1} showQuickJumper current={this.state.currentPageLocation} total={this.state.dataLocation.locations.info.pages} onChange={(e) => this.changePageLocation(e)} />
                {this.state.isFetching ? (<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />) : <div style={{ paddingBottom: 27 }} />}
                <LocationTable data={this.state.dataLocation.locations.results} />
                {this.state.isFetching ? (<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />) : <div style={{ paddingBottom: 27 }} />}
                <Pagination defaultPageSize={1} showQuickJumper current={this.state.currentPageLocation} total={this.state.dataLocation.locations.info.pages} onChange={(e) => this.changePageLocation(e)} />
              </div>


            )}

            {this.state.mode == 2 && (
              <div style={{ marginTop: 20, marginLeft: 20, marginRight: 20, alignContent: 'center' }}>
                {console.log(this.state.dataEpisodes)}
                <Pagination defaultPageSize={1} showQuickJumper current={this.state.currentPageEpisode} total={this.state.dataEpisodes.episodes.info.pages} onChange={(e) => this.changePageEpisode(e)} />
                {this.state.isFetching ? (<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />) : <div style={{ paddingBottom: 27 }} />}
                <EpisodeTable data={this.state.dataEpisodes.episodes.results} />
                {this.state.isFetching ? (<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />) : <div style={{ paddingBottom: 27 }} />}
                <Pagination defaultPageSize={1} showQuickJumper current={this.state.currentPageEpisode} total={this.state.dataEpisodes.episodes.info.pages} onChange={(e) => this.changePageEpisode(e)} />
              </div>


            )}

          </Content>

        </Layout>
        <Footer style={{ bottom: 1 }}>
          <div>
            Rick n' Morty Info
            Based on rickandmortyapi.com's GraphQL API
          </div>
          <a href="https://github.com/zhakamizhako/initialhov">https://github.com/zhakamizhako/initialhov</a>
        </Footer>
      </div>
    );
  }
}

const styles = {
  bodyMargin: {
    paddingBottom: 20
  },
  colSpacer: {
    marginLeft: 10,
    marginRight: 10,
  }
};

export default App;
