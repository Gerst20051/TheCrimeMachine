import axios from 'axios';
import React, { PureComponent } from 'react';
import MapGL from 'react-map-gl';
import DeckGL, { GeoJsonLayer } from 'deck.gl';

class Map extends PureComponent {
  constructor(props) {
    super(props);

    const mapConfig = {
      center: [35.16431663614179, -80.8406820123691],
      zoom: 11,
    };

    this.state = {
      viewport: {
        bearing: 0,
        height: window.innerHeight,
        isDragging: false,
        latitude: mapConfig.center[0],
        longitude: mapConfig.center[1],
        pitch: 50,
        startDragLngLat: mapConfig.center,
        width: window.innerWidth,
        zoom: mapConfig.zoom,
      },
      geojson: null,
    };

    axios.get('mapping.geojson')
      .then(({ data }) => {
        this.setState({
          geojson: data,
        });
      });

    this.onViewportChange = this.onViewportChange.bind(this);
  }

  onViewportChange(viewport) {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport },
    });
  }

  initialize(gl) {
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE_MINUS_DST_ALPHA, gl.ONE);
    gl.blendEquation(gl.FUNC_ADD);
  }

  render() {
    const { viewport, geojson } = this.state;

    const geojsonLayer = new GeoJsonLayer({
      data: geojson,
      filled: false,
      getLineColor: d => [175, 175, 175],
      id: 'geojson-layer',
      lineWidthMinPixels: 1,
      lineWidthScale: 1,
      stroked: true,
    });

    return (
      <div className="reactmapgldeckgl">
        <MapGL
          {...viewport}
          mapboxApiAccessToken="pk.eyJ1IjoiZ2Vyc3QyMDA1MSIsImEiOiJjanRsY3VjZXEwcjR6NDRsbDk2cm5iaHFyIn0.G1ciUhbhW09irCgaYC2kIw"
          mapStyle="mapbox://styles/mapbox/dark-v9"
          perspectiveEnabled={true}
          onViewportChange={this.onViewportChange}
        >
          <DeckGL
            {...viewport}
            layers={[geojsonLayer]}
            onWebGLInitialized={this.initialize}
          />
        </MapGL>
      </div>
    );
  }
}

export default Map;
