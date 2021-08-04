import { Card, Spin } from 'antd'
import Meta from 'antd/lib/card/Meta'
import { LoadingOutlined } from '@ant-design/icons'
import React from 'react'
import PropTypes from 'prop-types'

const CharacterInfo = props => {
  const HandleClick = async (id) => {
    props.clickHandler(id)
  }

  const { id, name, status, species, type, gender, image, isClicked, origin } = props
  return (
        <Card onClick={() => HandleClick(id)} style={styles.cardStyle} title={name} hoverable cover={image ? (<img src={image} height={250} />) : null}>
            <div style={{ alignContent: 'start' }}>
                <Meta description={`Status: ${status != 'unknown' ? status : 'Unknown'}`} />

                <Meta description={`Species: ${species}`} />

                <Meta description={`Type: ${type || 'None'}`} />

                <Meta description={`Gender: ${gender}`} />

                <Meta description={`Origin: ${origin.name}`} />

                {isClicked && (
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                )}
                {!isClicked && (
                    <div style={{ paddingBottom: 27 }} />
                )}

            </div>
        </Card>
  )
}

const styles = {
  cardStyle: {
    width: 240,
    marginBottom: 20
  }
}

CharacterInfo.propTypes = {
  clickHandler: PropTypes.func,
  id: PropTypes.number,
  name: PropTypes.string,
  species: PropTypes.string,
  status: PropTypes.string,
  type: PropTypes.string,
  gender: PropTypes.string,
  image: PropTypes.string,
  isClicked: PropTypes.bool,
  origin: PropTypes.object
}

export default CharacterInfo
