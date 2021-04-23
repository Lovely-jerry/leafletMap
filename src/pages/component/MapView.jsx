import { Component } from 'react';
import { Cards } from "./Cards.jsx";
import './MapView.css'

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

//解决默认maker无法显示的问题
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

import { tiledMapLayer } from "@supermap/iclient-leaflet";

import fire from '../../assets/fire.png';
import thunderbolt from '../../assets/thunderbolt-fill.png'


// import smile from '../../assets/smile-filling.png'

export default class MapView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      address: [
        { "name": "人民大会堂", "lat": "39.903244", "lng": "116.387400", "type": "viewSpot" },
        { "name": "天安门", "lat": "39.907064", "lng": "116.391305", "type": "viewSpot" },
        { "name": "故宫", "lat": "39.916462", "lng": "116.390790", "type": "viewSpot" },
        { "name": "国家博物馆", "lat": "39.903717", "lng": "116.395339", "type": "viewSpot" },
        { "name": "北海公园", "lat": "39.923973", "lng": "116.383323", "type": "park" },
        { "name": "景山公园", "lat": "39.924144", "lng": "116.390533", "type": "park" }
      ]

    }
  }

  componentDidMount() {
    this.initMap()
  }

  initMap = () => {
    let host = 'https://iserver.supermap.io';
    let url = host + '/iserver/services/map-china400/rest/maps/China';

    //初始化地图
    let map = L.map('map', {
      center: [39.9, 116.4],    //北京市的经纬度
      maxZoom: 18,
      zoom: 13
    });


    //添加图层
    tiledMapLayer(url, { noWrap: true }).addTo(map);

    //创建聚合点位
    this.createClusterMarker(map)



  }

  /**
   * 创建聚合点位图层
   * @param {Obj} map 地图对象
   */
  createClusterMarker = (map) => {
    const { address } = this.state;

    let fireIcon = L.icon({
      iconUrl: fire,
      iconSize: [20, 20]
    })
    let thunderboltIcon = L.icon({
      iconUrl: thunderbolt,
      iconSize: [20, 20]
    })


    // 实例化markerCluster
    let cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
    });
    let marker, icon = fireIcon;

    address.forEach(item => {
      let latLng = [item.lat, item.lng];

      if (item.type !== 'viewSpot') {
        icon = thunderboltIcon
      }

      marker = L.marker(latLng, { icon });
      item.type === 'viewSpot' ?
        this.handlerMouseOverIcon(marker, latLng, map) :
        this.handleOtherModle(marker,latLng, map)

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
  handlerMouseOverIcon = (marker, latLng, map) => {

    marker.on('mouseover', () => {
      this.createPopupModule(latLng, map)
    });

  }

  handleOtherModle = (marker, latLng, map) => {
    let myIcon = L.divIcon({ html:'<div>111</div>',className:'my-div-icon' });
    L.marker(latLng, { icon: myIcon }).addTo(map)
    // marker.addLayer()
  }

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


  render() {
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <div style={{ width: '100%', height: '100%' }} id="map"></div>
        {/* <div style={{ width: '400px', height: '100%', position: 'absolute', right: 0, top: 0, backgroundColor: '#eea' }} /> */}
      </div>
    )

  }
}
