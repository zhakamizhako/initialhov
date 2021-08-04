/* eslint-disable react/display-name */
import { Button, Table, Tag } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'

const EpisodeTable = props => {
  const handleClick = async (data) => {
    props.clickHandler(data)
  }

  const columns = [
    {
      title: 'Code',
      dataIndex: 'episode',
      key: 'episode'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (entry, data) => {
        return (<Button type='link' onClick={() => handleClick(data.id)}>{entry}</Button>)
      }
    },
    {
      title: 'Air Date',
      dataIndex: 'air_date',
      key: 'air_date'
    }

  ]

  const { data, usePagination } = props
  return (
        <div>
            <Table columns={columns} pagination={usePagination} dataSource={data} />
        </div>
  )
}

EpisodeTable.propTypes = {
  clickHandler: PropTypes.function,
  data: PropTypes.object,
  usePagination: PropTypes.bool

}

export default EpisodeTable
