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
      //地图对象
      map: null,
      //聚合图层对象
      clusterObj: null,

    }
  }

  componentDidMount() {
    this.initMap()
  }

  componentWillReceiveProps(nextProps) {
    // console.log('nextProps', nextProps);
    const { map, clusterObj } = this.state;

    if (JSON.stringify(nextProps.address) !== JSON.stringify(this.props.address)) {
      if (clusterObj !== null) {
        clusterObj.clearLayers();
        this.props.handleSaveValue('')
      }
      //创建聚合点位
      this.createClusterMarker(nextProps.address);
    };

    if (nextProps.selectTItemValue !== this.props.selectTItemValue) {
      let Item = nextProps.address.find((item) => item.name === nextProps.selectTItemValue);

      if (!!Item) {
        // 点击的地点设置为地图中心点位
        map.setView([Item.lat, Item.lng]);
        // 打开小弹窗
        this.createPopupModule([Item.lat, Item.lng], map)
      } else {
        // 点击的地点设置为地图中心点位
        map.setView([nextProps.address[0].lat, nextProps.address[0].lng]);
        // 打开小弹窗
        // this.createPopupModule([nextProps.address[0].lat, nextProps.address[0].lng], map)
      }
    }


  }

  initMap = () => {
    let host = 'https://iserver.supermap.io';
    let url = host + '/iserver/services/map-china400/rest/maps/China';
    const { address, handleSaveShowListEl } = this.props;

    //初始化地图
    let map = L.map('map', {
      center: [39.9, 116.4],    //北京市的经纬度
      maxZoom: 18,
      zoom: 10
    });

    //移动地图收起大的元素
    map.on('dragend', () => {
      handleSaveShowListEl(false)
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
    let fireIcon = this.defineIconTypes(fire), thunderboltIcon = this.defineIconTypes(thunderbolt);

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

      this.handlerMouseOverIcon(marker, item.showIndex, item.name, latLng, map)

      cluster.addLayer(marker);
      this.setState({
        clusterObj: cluster
      })
    })

    map.addLayer(cluster);

  }

  /**
   * 创建图标，鼠标移入图标显示弹窗(直接显示弹窗)
   * @param {Obj} marker  图标图层
   * @param {} latLng 经纬度
   * @param {*} map 地图图层
   */
  handlerMouseOverIcon = (marker, showIndex,name, latLng, map) => {

    this.createTooltipEl(showIndex+1, marker)

    marker.on('click', () => {
      this.createPopupModule(latLng, map);

      this.props.handleSaveValue(name)

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
    !!showIndex && marker.bindTooltip(index, {
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
  defineIconTypes(url) {
    let Icon = L.icon({
      iconUrl: url,
      iconSize: [20, 20]
    })

    return Icon;
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

    const { handleSetIsShowDetailsPagesValue } = this.props;

    popup.setLatLng(latLng).setContent(Cards).openOn(map);

    //获取弹窗元素并为弹窗元素添加点击事件
    let cardBoxEl = popup.getElement();
    cardBoxEl.onclick = function () {
      handleSetIsShowDetailsPagesValue(true)
      // alert('您好！欢迎您');

    }
  }


  handleOtherModle = (marker, latLng, map) => {
    let myIcon = L.divIcon({ html: '<div>111</div>', className: 'my-div-icon' });
    L.marker(latLng, { icon: myIcon }).addTo(map)
    // marker.addLayer()
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

    const { isShowBigEl, isShowListEl, selectTItemValue } = this.state;

    //list列表需要的数据
    const listProps = {
      listDate: isShowListEl ? newDate : [],
      handleSaveValue: this.handleSaveValue,
      selectTItemValue
    }

    return (
      <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
        <div style={{ width: '100%', height: '100%' }} id="map"></div>
      </div>
    )
  }
};