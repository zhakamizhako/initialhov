import { Card, Spin, Table, Tag, } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { LoadingOutlined } from '@ant-design/icons';
import React, { useState, useRef } from 'react';


const LocationTable = props => {
    const listing = 'categories';

    const handleClick = async (data) => {
        props.clickHandler(data)
    }

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Dimension",
            dataIndex: "dimension",
            key: "dimension",
        },
        {
            render: data => (
                <div color={"blue"}><Tag onClick={() => handleClick(data)}>View Residents</Tag></div>
            )
        },

    ]

    const { data } = props;

    console.log('tble props')
    console.log(props)
    return (
        <div>
            <Table columns={columns} pagination={false} dataSource={data} />
        </div>
    );
};

const styles = {
    cardStyle: {
        width: 240,
        marginBottom: 20
    },
};

LocationTable.propTypes = {

};

export default LocationTable;
