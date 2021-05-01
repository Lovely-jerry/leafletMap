import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { cloneDeep } from 'lodash'
import styles from './index.css';
import MapView from "@/pages/component/MapView";
import DetailsPages from '@/pages/component/DetailsPages'
import List from '@/pages/component/List'

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
      ],
      //显示详情弹窗
      isShowDetailsPages: false,
      //是否显示查询数据
      isShowListEl: false,
      //选择地点值
      selectTItemValue: '',
      //是否显示showDate1
      isShowBigEl: true
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

  //设置是否显示详情页面
  handleSetIsShowDetailsPagesValue = (value) => {
    this.setState({
      isShowDetailsPages: value
    })
  }

  /**
   * 点击小元素显示大的div元素
   */
   handleShowBigEl = () => {
    this.setState({
      isShowBigEl: true
    })
  }

  handleSetNewDate = (date, type) => {
    // const { dataProcessing } = this.props;
    this.dataProcessing(date);

    this.setState({
      isShowListEl: type === 'update'
    })
  }

  //保存选中的值
  handleSaveValue = (value) => {
    this.setState({
      selectTItemValue: value
    })
  }

  //保存是否显示列表元素
  handleSaveShowListEl=(val)=>{
    this.setState({
      isShowBigEl: val
    })
  }

  render() {
    const { address, isShowDetailsPages,isShowBigEl, isShowListEl, selectTItemValue } = this.state;

    //地图组件需要的参数
    const mapProps = {
      address,
      selectTItemValue,
      dataProcessing: this.dataProcessing,
      handleSaveValue: this.handleSaveValue,
      handleSaveShowListEl:this.handleSaveShowListEl,
      handleSetIsShowDetailsPagesValue: this.handleSetIsShowDetailsPagesValue
    }

    //详情组件需要的参数
    const detailsPagesProps = {
      handleSetIsShowDetailsPagesValue: this.handleSetIsShowDetailsPagesValue
    }

    let newDate = [
      { "name": "景山公园", "lat": "39.924144", "lng": "116.390533", "type": "park" },
      { "name": "故宫", "lat": "39.916462", "lng": "116.390790", "type": "viewSpot" },
      { "name": "天安门", "lat": "39.907064", "lng": "116.391305", "type": "viewSpot" },
      { "name": "北海公园", "lat": "39.923973", "lng": "116.383323", "type": "park" },
      { "name": "国家博物馆", "lat": "39.903717", "lng": "116.395339", "type": "viewSpot" },
      { "name": "人民大会堂", "lat": "39.903244", "lng": "116.387400", "type": "viewSpot" }
    ]

    //list列表需要的数据
    const listProps = {
      listDate: isShowListEl ? newDate : [],
      handleSaveValue: this.handleSaveValue,
      selectTItemValue
    }

    return (
      <div className={styles.normal}>
        <MapView {...mapProps} />
        <div className='divEl'>
          <button onClick={() => { this.handleSetNewDate(newDate, 'update') }}>更新数据</button>&nbsp;&nbsp;
          <button onClick={() => { this.handleSetNewDate([], 'reset') }}>重置数据</button>
        </div>
        {!!isShowListEl && <div className='showDateEl'>
          {isShowBigEl ?
            <div style={{ height: '500px' , overflowY:'auto'}}>
              <List {...listProps} />
            </div> :
            <div style={{ height: '50px',lineHeight:'50px',textAlign:'center' }} onClick={this.handleShowBigEl}>点我点我快点我</div>
          }
        </div>}
        {!!isShowDetailsPages && <DetailsPages {...detailsPagesProps} />}
      </div>
    );
  }
}
