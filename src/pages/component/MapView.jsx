import { Component } from 'react';
import { Cards } from "./Cards.jsx";
import { cloneDeep } from 'lodash'
import './MapView.less'

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { tiledMapLayer } from "@supermap/iclient-leaflet";

import fire from '../../assets/fire.png';
import thunderbolt from '../../assets/thunderbolt-fill.png'

export default class MapView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      //是否显示showDate1
      isShowBigEl: true,
      //地图对象
      map: null          

    }
  }

  componentDidMount() {
    this.initMap()
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps', nextProps);
    //创建聚合点位
    this.createClusterMarker(nextProps.address)
  }

  initMap = () => {
    let host = 'https://iserver.supermap.io';
    let url = host + '/iserver/services/map-china400/rest/maps/China';
    const { address } = this.props;

    //初始化地图
    let map = L.map('map', {
      center: [39.9, 116.4],    //北京市的经纬度
      maxZoom: 18,
      zoom: 10
    });

    //移动地图收起大的元素
    map.on('moveend', () => {
      this.setState({
        isShowBigEl: false
      })
    })

    //添加图层
    tiledMapLayer(url, { noWrap: true }).addTo(map);

    this.setState({
      map
    }, () => {
      //创建聚合点位
      this.createClusterMarker(address)
    })

  }



  /**
   * 创建聚合点位图层
   * @param {Obj} map 地图对象
   */
  createClusterMarker = (address) => {
    const { map } = this.state;

    console.log('address', address);
    let { fireIcon, thunderboltIcon } = this.defineIconTypes()

    // 实例化markerCluster
    let cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
    });
    let marker, icon = fireIcon;

    address.forEach((item, index) => {
      let latLng = [item.lat, item.lng];

      if (item.type !== 'viewSpot') {
        icon = thunderboltIcon
      }

      marker = L.marker(latLng, { icon });

      this.handlerMouseOverIcon(marker, item.showIndex, latLng, map)

      // item.type === 'viewSpot' ?
      //   this.handlerMouseOverIcon(marker, index,latLng, map) :
      //   this.handleOtherModle(marker, latLng, map)

      cluster.addLayer(marker)
    })

    map.addLayer(cluster)

  }

  /**
   * 创建图标，鼠标移入图标显示弹窗(直接显示弹窗)
   * @param {Obj} marker  图标图层
   * @param {} latLng 经纬度
   * @param {*} map 地图图层
   */
  handlerMouseOverIcon = (marker, showIndex, latLng, map) => {

    this.createTooltipEl(showIndex, marker)

    marker.on('mouseover', () => {
      this.createPopupModule(latLng, map)
    });

  }

  /**
   * 创建小弹窗样式
   * @param {} Index 
   * @param {Object} marker 图标图层
   * @returns 
   */
  createTooltipEl(showIndex, marker) {
    // 设置显示的序号
    let index = showIndex > 9 ? `${showIndex}` : `0${showIndex}`;
    //创建序号元素
    showIndex !== -1 && marker.bindTooltip(index, {
      permanent: true,
      direction: 'top',
      offset: [0, -10]
    }).openTooltip();

    return marker
  }

  /**
   * 定义图标种类，并将其返回
   * @returns Object 图标对象组
   */
  defineIconTypes() {
    let fireIcon = L.icon({
      iconUrl: fire,
      iconSize: [20, 20]
    })
    let thunderboltIcon = L.icon({
      iconUrl: thunderbolt,
      iconSize: [20, 20]
    })

    return { fireIcon, thunderboltIcon }
  }

  /**
   * 创建小弹窗元素，并为其绑定点击事件
   * @param {Array} latLng 经纬度数组
   * @param {Object} map 地图对象
   */
  createPopupModule = (latLng, map) => {
    let popup = L.popup({
      minWidth: 300,
      maxHeight: 200,
      closeButton: false
    })

    popup.setLatLng(latLng).setContent(Cards).openOn(map);

    //获取弹窗元素并为弹窗元素添加点击事件
    let cardBoxEl = popup.getElement();
    cardBoxEl.onclick = function () {
      alert('您好！欢迎您');
    }
  }


  handleOtherModle = (marker, latLng, map) => {
    let myIcon = L.divIcon({ html: '<div>111</div>', className: 'my-div-icon' });
    L.marker(latLng, { icon: myIcon }).addTo(map)
    // marker.addLayer()
  }
  /**
   * 点击小元素显示大的div元素
   */
  handleShowBigEl = () => {
    this.setState({
      isShowBigEl: true
    })
  }

  handleSetNewDate = (date) => {
    const { dataProcessing } = this.props;
    dataProcessing(date);
  }

  render() {

    let newDate = [
      { "name": "景山公园", "lat": "39.924144", "lng": "116.390533", "type": "park" },
      { "name": "故宫", "lat": "39.916462", "lng": "116.390790", "type": "viewSpot" },
      { "name": "天安门", "lat": "39.907064", "lng": "116.391305", "type": "viewSpot" },
      { "name": "北海公园", "lat": "39.923973", "lng": "116.383323", "type": "park" },
      { "name": "国家博物馆", "lat": "39.903717", "lng": "116.395339", "type": "viewSpot" },
      { "name": "人民大会堂", "lat": "39.903244", "lng": "116.387400", "type": "viewSpot" }
    ]

    const { isShowBigEl } = this.state;
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <div style={{ width: '100%', height: '100%' }} id="map"></div>
        <div className='divEl'>
          <button onClick={()=>{this.handleSetNewDate(newDate)}}>更新数据</button>&nbsp;&nbsp;
          <button onClick={()=>{this.handleSetNewDate([])}}>重置数据</button>
        </div>
        <div className='showDateEl'>
          {isShowBigEl ?
            <div style={{ height: '600px' }}>showData</div> :
            <div style={{ height: '50px' }} onClick={this.handleShowBigEl}>showData---dddd</div>
          }
        </div>
      </div>
    )
  }
};