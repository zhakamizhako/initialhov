import { Card, Spin, } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { LoadingOutlined } from '@ant-design/icons';
import React, { useState, useRef } from 'react';


const CharacterInfo = props => {
    const listing = 'categories';

    const HandleClick = async (id) => {
        props.clickHandler(id)
    }

    const { id, name, status, species, type, gender, image, isClicked } = props;
    return (
        <Card onClick={() => HandleClick(id)} style={styles.cardStyle} title={name} hoverable cover={image ? (<img src={image} height={250} />) : null}>
            <div style={{ alignContent: 'start' }}>
                <Meta description={`Status: ${status != 'unknown' ? status : "Unknown"}`} />

                <Meta description={`Species: ${species}`} />

                <Meta description={`Type: ${type ? type : 'None'}`} />

                <Meta description={`Gender: ${gender}`} />

                {isClicked && (
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                )}
                {!isClicked && (
                    <div style={{ paddingBottom: 27 }} />
                )}

            </div>
        </Card>
    );
};

const styles = {
    cardStyle: {
        width: 240,
        marginBottom: 20
    },
};

CharacterInfo.propTypes = {

};

export default CharacterInfo;
