/* eslint-disable react/display-name */
import { Table, Button } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'

const LocationTable = props => {
  const handleClick = async (data) => {
    props.clickHandler(data)
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (entry, data) => {
        return (<Button type='link' onClick={() => handleClick(data.id)}>{entry}</Button>)
      }
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Dimension',
      dataIndex: 'dimension',
      key: 'dimension'
    }

  ]

  const { data } = props
  return (
        <div>
            <Table columns={columns} pagination={false} dataSource={data} />
        </div>
  )
}

LocationTable.propTypes = {
  data: PropTypes.object,
  clickHandler: PropTypes.func
}

export default LocationTable
