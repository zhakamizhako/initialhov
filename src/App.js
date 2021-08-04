/* eslint-disable react/no-unescaped-entities */
// import logo from './logo.svg'
import React, { Component } from 'react'
import './App.css'
import { Layout, Menu, Row, Col, Pagination, notification, Spin, Card, Button, Carousel } from 'antd'
import { LoadingOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import {
  ApolloClient,
  InMemoryCache,
  gql
} from '@apollo/client'

import 'antd/dist/antd.css'
import CharacterCard from './Content/CharacterCard.js'
import LocationTable from './Content/LocationTable.js'

import EpisodeTable from './Content/EpisodeTable'

const { Header, Content, Footer } = Layout

const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql',
  cache: new InMemoryCache()
})
class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null,
      isFetching: false,

      dataCharacters: null,
      dataSelectedCharacter: null,

      dataLocation: null,
      dataSelectedLocation: null,
      dataSelectedEpisode: null,

      currentCharacterData: {},
      query: null,

      currentPageLocation: 1,
      currentCharacterPage: 1,
      currentPageEpisode: 1,

      selectedLocationId: null,
      seletedEpisodeId: null,
      selectedCharId: null,

      mode: 0, // 0 - character view, 1 - viewing character, 2 - episode list, 3 - viewing episode, 4 - location list, 5 - location listing,
      history: []
    }

    this.clickHandlerCharacterSelect = this.clickHandlerCharacterSelect.bind(this)
    this.clickHandlerEpisodeSelect = this.clickHandlerEpisodeSelect.bind(this)
    this.clickHandlerLocationSelect = this.clickHandlerLocationSelect.bind(this)
  }

  componentDidMount () {
    console.log('whoop, whoop.')
    this.GetCharacters(1)
    this.fetchLocations(1)
    this.fetchEpisodes(1)
  }

  async fetchCharacterData (id) {
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
              name,
              id,
            },
            location{
              name,
              dimension,
              type,
              id
            },
            image,
            episode {
              id,
              name,
              air_date,
              episode,
            }
        }
      }
      `
    })
      .then(result => {
        console.log('character fetch')
        console.log(result)
        this.setState({ dataSelectedCharacter: result.data })
        this.setMode(1)
      })
      .catch(error => {
        notification.error({
          message: 'Query Failed',
          description: error.message,
          placement: 'topRight'
        })
        this.setState({ error: error })
      })
  }

  async fetchLocations (x) {
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
          message: 'Query Failed',
          description: error.message,
          placement: 'topRight'
        })
        this.setState({ error: error })
      })
  }

  async fetchLocationData (x) {
    client.query({
      query: gql`query {
        location(id: ${x}) {
          id
          name
          dimension
          residents {
            id
            name
            status
            species
            type
            gender
            image
            origin {
              name
            }
          }
        }
      }
      `
    }).then(result => {
      console.log(result)
      this.setState({ dataSelectedLocation: result.data, isFetching: false })
      this.setMode(5)
    })
      .catch(error => {
        notification.error({
          message: 'Query Failed',
          description: error.message,
          placement: 'topRight'
        })
        this.setState({ error: error })
      })
  }

  async fetchEpisodes (x) {
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
          message: 'Query Failed',
          description: error.message,
          placement: 'topRight'
        })
        this.setState({ error: error })
      })
  }

  async fetchSelectedEpisodeData (x) {
    client.query({
      query: gql`
        query{
          episode(id:${x}){
            id,
            name,
            air_date,
            episode,
            characters{
              id
              name
              status
              species
              type
              gender
              image
              origin {
                id
                name
              }
            }
          }
        }
      `
    }).then(result => {
      console.log('episode')
      console.log(result)
      this.setState({ dataSelectedEpisode: result.data, isFetching: false })
      this.setMode(3)
    })
      .catch(error => {
        notification.error({
          message: 'Query Failed',
          description: error.message,
          placement: 'topRight'
        })
        this.setState({ error: error })
      })
  }

  async changePageCharacters (x) {
    this.setState(state => {
      let { currentCharacterPage, isFetching } = state
      isFetching = true
      currentCharacterPage = x
      this.GetCharacters(x)

      return { currentCharacterPage, isFetching }
    })
  }

  async changePageLocation (x) {
    this.setState(state => {
      let { currentPageLocation, isFetching } = state
      isFetching = true
      currentPageLocation = x
      this.fetchLocations(x)

      return { currentPageLocation, isFetching }
    })
  }

  async changePageEpisode (x) {
    this.setState(state => {
      let { currentPageEpisode, isFetching } = state
      isFetching = true
      currentPageEpisode = x
      this.fetchEpisodes(x)

      return { currentPageEpisode, isFetching }
    })
  }

  async clickHandlerCharacterSelect (data) {
    console.log('eh')
    console.log(data)
    this.setState({ selectedCharId: data })
    this.fetchCharacterData(data)
  }

  async clickHandlerEpisodeSelect (data) {
    console.log('eh')
    console.log(data)
    this.setState({ selectedEpisode: data, selectedCharId: null })
    this.fetchSelectedEpisodeData(data)
  }

  async clickHandlerLocationSelect (data) {
    console.log('eh')
    console.log(data)
    this.setState({ selectedLocationId: data, selectedCharId: null })
    this.fetchLocationData(data)
  }

  async GetCharacters (x) {
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
          message: 'Query Failed',
          description: error.message,
          placement: 'topRight'
        })
        this.setState({ error: error })
      })
  }

  handleMenu (mode) {
    this.setMode(mode)
    this.setState({ selectedCharId: null })
  }

  goBack () {
    this.setState(state => {
      let { history, mode, selectedCharId } = state
      mode = !history ? 0 : history[history.length - 1]

      console.log(history)
      console.log(history.length)
      history.pop()

      console.log(history)
      console.log(mode)

      selectedCharId = 0

      return { mode, history, selectedCharId }
    })
    // this.setState({ mode: 0 })
  }

  setMode (x) {
    this.setState(state => {
      let { mode, history } = state
      history.push(mode, 0)
      mode = x
      return { mode, history }
    })
  }

  renderViewCharacter () {
    return (<div style={{ textAlign: 'start' }}>
      <Button type="ghost" onClick={() => this.goBack()} style={{ alignSelf: 'start' }} icon={(<ArrowLeftOutlined />)}></Button> Viewing Character Info
      <Card hoverable={false}>
        <Card.Grid hoverable={false}>
          <Card.Meta title={this.state.dataSelectedCharacter ? this.state.dataSelectedCharacter.character.name : 'Unknown'} />
          <Card.Meta description={`Status: ${this.state.dataSelectedCharacter.character.status !== 'unknown' ? this.state.dataSelectedCharacter.character.status : 'Unknown'}`} />

          <Card.Meta description={`Species: ${this.state.dataSelectedCharacter.character.species}`} />

          <Card.Meta description={`Type: ${this.state.dataSelectedCharacter.character.type ? this.state.dataSelectedCharacter.character.type : 'None'}`} />

          <Card.Meta description={`Gender: ${this.state.dataSelectedCharacter.character.gender}`} />

          {/* <Card.Meta description={`Origin ${this.state.dataSelectedCharacter.character.origin.name}`} />
           */}

           Origin: {<Button type="link" onClick={() => this.clickHandlerLocationSelect(this.state.dataSelectedCharacter.character.origin.id)} >{this.state.dataSelectedCharacter.character.origin.name}</Button>}
           <br/>

          {/* <Card.Meta description={`Last Seen on: ${this.state.dataSelectedCharacter.character.location.name}`} /> */}

          Last Seen on:{<Button type="link" onClick={() => this.clickHandlerLocationSelect(this.state.dataSelectedCharacter.character.location.id)} >{this.state.dataSelectedCharacter.character.location.name}</Button>}

          <div style={{ paddingTop: 20 }}>
          <strong>Appearances</strong>
          <EpisodeTable clickHandler={this.clickHandlerEpisodeSelect} data={this.state.dataSelectedCharacter.character.episode} usePagination/>
          </div>
        </Card.Grid>
        <Card.Grid style={styles.CardGridStyle} hoverable={false}>
          <Card hoverable={false} cover={<img alt="example" src={this.state.dataSelectedCharacter.character.image} width={150} />}></Card>
        </Card.Grid>
      </Card>
    </div>)
  }

  renderViewLocation () {
    return (<div style={{ textAlign: 'start' }}>
    <Button type="ghost" onClick={() => this.goBack()} style={{ alignSelf: 'start' }} icon={(<ArrowLeftOutlined />)}></Button> View Location Info
    <Card hoverable={false}>

        <Card.Meta title={this.state.dataSelectedLocation ? this.state.dataSelectedLocation.location.name : 'Unknown'} />
        {/* <Card.Meta description={`Status: ${this.state.dataSelectedLocation.location.status !== 'unknown' ? this.state.dataSelectedLocation.location.status : 'Unknown'}`} /> */}

        <Card.Meta description={`Type: ${this.state.dataSelectedLocation.location.type ? this.state.dataSelectedLocation.location.type : 'None'}`} />

        <Card.Meta description={`Dimension: ${this.state.dataSelectedLocation.location.dimension}`} />

        <div style={{ paddingTop: 20 }}/>
    </Card>
    <div style={{ marginTop: 20, marginLeft: 20, marginRight: 20, alignContent: 'center' }}>
      <strong>Residents</strong>
                  {/* <Pagination defaultPageSize={1} showQuickJumper current={this.state.currentCharacterPage} total={this.state.dataSelectedEpisode.characters.info.pages} onChange={(e) => this.changePageCharacters(e)} /> */}
                  {/* {this.state.isFetching ? (<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />) : <div style={{ paddingBottom: 27 }} />} */}
                  <div style={{ marginTop: 20, marginBottom: 10 }}>
                    <Row style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                      {this.state.dataCharacters && this.state.dataSelectedLocation.location.residents.map(entry => (
                        <Col key={entry.id} style={styles.colSpacer}>
                          <CharacterCard clickHandler={this.clickHandlerCharacterSelect} origin={entry.origin} image={entry.image} id={entry.id} name={entry.name} species={entry.species} image={entry.image} gender={entry.gender} type={entry.type} status={entry.status} isClicked={entry.id === this.state.selectedCharId} />
                        </Col>
                      ))}
                    </Row>
                  </div>
        </div>
  </div>)
  }

  renderViewEpisode () {
    return (<div style={{ textAlign: 'start' }}>
    <Button type="ghost" onClick={() => this.goBack()} style={{ alignSelf: 'start' }} icon={(<ArrowLeftOutlined />)}></Button> View Episode Info
    <Card hoverable={false} style={{ marginLeft: 20, marginRight: 20 }}>
        <Card.Meta title={this.state.dataSelectedEpisode ? this.state.dataSelectedEpisode.episode.name : 'Unknown'} />
        <Card.Meta title={this.state.dataSelectedEpisode ? this.state.dataSelectedEpisode.episode.episode : 'Unknown'} />

        <Card.Meta description={`Air Date: ${this.state.dataSelectedEpisode.episode.air_date}`} />

        <div style={{ paddingTop: 20 }}/>
    </Card>
      <div style={{ marginTop: 20, marginLeft: 20, marginRight: 20, alignContent: 'center' }}>
      <strong>Character Appearances</strong>
                  {/* <Pagination defaultPageSize={1} showQuickJumper current={this.state.currentCharacterPage} total={this.state.dataSelectedEpisode.characters.info.pages} onChange={(e) => this.changePageCharacters(e)} /> */}
                  {/* {this.state.isFetching ? (<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />) : <div style={{ paddingBottom: 27 }} />} */}
                  <div style={{ marginTop: 20, marginBottom: 10 }}>
                    <Row style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                      {this.state.dataCharacters && this.state.dataSelectedEpisode.episode.characters.map(entry => (
                        <Col key={entry.id} style={styles.colSpacer}>
                          <CharacterCard clickHandler={this.clickHandlerCharacterSelect} origin={entry.origin} id={entry.id} name={entry.name} species={entry.species} image={entry.image} gender={entry.gender} type={entry.type} status={entry.status} isClicked={entry.id === this.state.selectedCharId} />
                        </Col>
                      ))}
                    </Row>
                  </div>
        </div>
  </div>)
  }

  render () {
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
          </Header>

          <Content style={{ marginTop: 64 }}>

            {/* View Characters */}
            {this.state.mode === 0 && (
              this.state.dataCharacters && (
                <div style={{ marginTop: 20, marginLeft: 20, marginRight: 20, alignContent: 'center' }}>
                  <Pagination defaultPageSize={1} showQuickJumper current={this.state.currentCharacterPage} total={this.state.dataCharacters.characters.info.pages} onChange={(e) => this.changePageCharacters(e)} />
                  {this.state.isFetching ? (<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />) : <div style={{ paddingBottom: 27 }} />}
                  <div style={{ marginTop: 20, marginBottom: 10 }}>
                    <Row style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                      {this.state.dataCharacters && this.state.dataCharacters.characters.results.map(entry => (
                        <Col key={entry.id} style={styles.colSpacer}>
                          <CharacterCard clickHandler={this.clickHandlerCharacterSelect} origin={entry.origin} id={entry.id} name={entry.name} species={entry.species} image={entry.image} gender={entry.gender} type={entry.type} status={entry.status} isClicked={entry.id === this.state.selectedCharId} />
                        </Col>
                      ))}
                    </Row>
                  </div>
                  {this.state.isFetching ? (<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />) : <div style={{ paddingBottom: 27 }} />}
                  <Pagination defaultPageSize={1} showQuickJumper current={this.state.currentCharacterPage} total={this.state.dataCharacters.characters.info.pages} onChange={(e) => this.changePageCharacters(e)} />
                </div>
              )
            )}

            {/* View Character info */}
            {this.state.mode === 1 && this.renderViewCharacter()}

            {this.state.mode === 2 && (
              <div style={{ marginTop: 20, marginLeft: 20, marginRight: 20, alignContent: 'center' }}>
                {console.log(this.state.dataEpisodes)}
                <Pagination defaultPageSize={1} showQuickJumper current={this.state.currentPageEpisode} total={this.state.dataEpisodes.episodes.info.pages} onChange={(e) => this.changePageEpisode(e)} />
                {this.state.isFetching ? (<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />) : <div style={{ paddingBottom: 27 }} />}

                <EpisodeTable data={this.state.dataEpisodes.episodes.results} clickHandler={this.clickHandlerEpisodeSelect}/>

                {this.state.isFetching ? (<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />) : <div style={{ paddingBottom: 27 }} />}
                <Pagination defaultPageSize={1} showQuickJumper current={this.state.currentPageEpisode} total={this.state.dataEpisodes.episodes.info.pages} onChange={(e) => this.changePageEpisode(e)} />
              </div>
            )}

            {this.state.mode === 3 && this.renderViewEpisode()}

            {/* Location List */}
            {this.state.mode === 4 && this.state.dataLocation && (
              <div style={{ marginTop: 20, marginLeft: 20, marginRight: 20, alignContent: 'center' }}>
                {console.log(this.state.dataLocation)}
                <Pagination defaultPageSize={1} showQuickJumper current={this.state.currentPageLocation} total={this.state.dataLocation.locations.info.pages} onChange={(e) => this.changePageLocation(e)} />
                {this.state.isFetching ? (<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />) : <div style={{ paddingBottom: 27 }} />}

                <LocationTable data={this.state.dataLocation.locations.results} clickHandler={this.clickHandlerLocationSelect} />

                {this.state.isFetching ? (<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />) : <div style={{ paddingBottom: 27 }} />}
                <Pagination defaultPageSize={1} showQuickJumper current={this.state.currentPageLocation} total={this.state.dataLocation.locations.info.pages} onChange={(e) => this.changePageLocation(e)} />
              </div>
            )}
            {this.state.mode === 5 && this.renderViewLocation()}

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
    )
  }
}

const styles = {
  bodyMargin: {
    paddingBottom: 20
  },
  colSpacer: {
    marginLeft: 10,
    marginRight: 10
  },
  CardGridStyle: {
    width: '25%',
    textAlign: 'center'
  }
}

export default App
