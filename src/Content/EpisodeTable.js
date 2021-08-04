import { Card, Spin, Table, Tag, } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { LoadingOutlined } from '@ant-design/icons';
import React, { useState, useRef } from 'react';


const EpisodeTable = props => {
    const listing = 'categories';

    const handleClick = async (data) => {
        props.clickHandler(data)
    }

    const columns = [
        {
            title: "Code",
            dataIndex: "episode",
            key: "episode",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Air Date",
            dataIndex: "air_date",
            key: "air_date",
        },
        {
            render: data => (
                <div color={"blue"}><Tag onClick={() => handleClick(data)}>View Characters</Tag></div>
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

EpisodeTable.propTypes = {

};

export default EpisodeTable;
