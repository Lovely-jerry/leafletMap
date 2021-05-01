import React, { useEffect } from 'react';
import styles from './List.less'
import { isEmpty } from 'lodash'

export default function List(props) {


    const { listDate, selectTItemValue, handleSaveValue } = props;

    useEffect(() => {

        let boxEl = document.getElementById('boxEl');

        let scrolllValue = 127;

        let index = listDate.findIndex(item => item.name === selectTItemValue);

        scrolllValue = scrolllValue * index;

        console.log('scrolllValue', scrolllValue, boxEl);

        index !== -1 && boxEl.scrollTo(0, scrolllValue)


    }, [listDate, selectTItemValue])


    return (<div style={{ width: '100%', height: '100%' }} id='boxEl'>
        <div style={{ width: '100%', height: '100%' }}>
            {!isEmpty(listDate) && listDate.map((item) => {
                return (<div
                    className={styles.listBox}
                    key={item.name}
                    onClick={() => { handleSaveValue(item.name) }}
                    style={selectTItemValue === item.name ? { backgroundColor: '#ffa' } : null}
                >
                    <h3>地点 : {item.name}</h3>
                    <p>类型 : {item.type}</p>
                    <p>经纬度 : <span title={`${item.lat}--${item.lng}`}>{item.lat}--{item.lng}</span></p>
                </div>)
            })}
        </div>
    </div>)
}