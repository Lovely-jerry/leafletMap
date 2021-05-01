import React, { Component } from 'react';
import sty from './DetailsPages.less';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { tiledMapLayer } from "@supermap/iclient-leaflet";

export default class DetailsPages extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    goToIndex = () => {
        const { handleSetIsShowDetailsPagesValue } = this.props;
        handleSetIsShowDetailsPagesValue(false);
    }

    render() {
        return (<div className={sty.detailsPagesBox}>
            <header style={{ height: '30px' }}>
                <button onClick={this.goToIndex}>返回到首页</button>
            </header>
            <main style={{ height: 'calc(100% - 30px)' }}>
                <div style={{ width: '100%', height: '100%' }} id="map"></div>
            </main>
        </div>)
    }
}