import { Card } from 'antd';
import React, { useState, useRef } from 'react';


const CharacterInfo = props => {
    const listing = 'categories';
    const { name, status, species, type, gender, origin, location, image, episode } = props;
    return (
        <div>
            <Card style={styles.cardStyle} title={name} hoverable cover={image ? (<img src={image} height={250} />) : null}>
                <div>
                    {`Name: ${name}`}
                    {`Status: ${status}`}
                    {`Species: ${species}`}
                    {`Type: ${type}`}
                    {`Gender: ${gender}`}
                </div>
            </Card>
        </div>
    );
};

const styles = {
    cardStyle: {
        width: 240,
        marginBottom: 10
    },
};

CharacterInfo.propTypes = {

};

export default CharacterInfo;
