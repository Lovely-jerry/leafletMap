import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { cloneDeep } from 'lodash'
import styles from './index.css';
import MapView from "@/pages/component/MapView";

export default class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      address: [
        { "name": "人民大会堂", "lat": "39.903244", "lng": "116.387400", "type": "viewSpot", 'showIndex': -1 },
        { "name": "天安门", "lat": "39.907064", "lng": "116.391305", "type": "viewSpot", 'showIndex': -1 },
        { "name": "故宫", "lat": "39.916462", "lng": "116.390790", "type": "viewSpot", 'showIndex': -1 },
        { "name": "国家博物馆", "lat": "39.903717", "lng": "116.395339", "type": "viewSpot", 'showIndex': -1 },
        { "name": "北海公园", "lat": "39.923973", "lng": "116.383323", "type": "park", 'showIndex': -1 },
        { "name": "景山公园", "lat": "39.924144", "lng": "116.390533", "type": "park", 'showIndex': -1 },
        { "name": "北京通州", "lat": "39.866540", "lng": "116.663230", "type": "park", 'showIndex': -1 },
        { "name": "怀柔", "lat": "40.245308", "lng": "116.690163", "type": "park", 'showIndex': -1 },
        { "name": "大兴", "lat": "39.660475", "lng": "116.387191", "type": "park", 'showIndex': -1 }
      ]
    }
  }


  /**
   * 对查询到的数据进行处理
   * @param {*} newAddress 
   */
  dataProcessing = (newAddress) => {
    const { address } = this.state;
    let obj = {}, tempAddress = cloneDeep(address), tempNewAddress = cloneDeep(newAddress);

    tempNewAddress.forEach((item, index) => {
      obj[item.name] = index;
    })

    let nameList = Object.keys(obj);

    tempAddress.forEach((item) => {
      if (nameList.includes(item.name)) {
        item.showIndex = obj[item.name]
      } else {
        item.showIndex = -1
      }
    })

    console.log('newaddress', tempAddress);
    this.setState({
      address: tempAddress
    })
  }

  render() {
    const { address } = this.state;
    return (
      <div className={styles.normal}>
        <MapView address={address} dataProcessing={this.dataProcessing} />
      </div>
    );
  }
}
