import { Card } from 'antd';
import React, { useState, useRef } from 'react';


const CharacterInfo = props => {
    const listing = 'categories';
    const { name, status, species, type, gender, origin, location, image, episode } = props;
    return (
            <Card style={styles.cardStyle} title={name} hoverable cover={image ? (<img src={image} height={250} />) : null}>
                <div>
                    {`Name: ${name}`}

                    {`Status: ${status}`}

                    {`Species: ${species}`}

                    {`Type: ${type}`}
                    
                    {`Gender: ${gender}`}
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
