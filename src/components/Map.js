import axios from 'axios';
import React, { PureComponent } from 'react';
import MapGL from 'react-map-gl';
import DeckGL, { GeoJsonLayer } from 'deck.gl';

class CrimeMap extends PureComponent {
  constructor(props) {
    super(props);

    const mapConfig = {
      center: [35.16431663614179, -80.8406820123691],
      zoom: 11,
    };

    this.state = {
      data: null,
      geojson: null,
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
    };

    axios.get('mapping.geojson')
      .then(({ data }) => {
        this.setState({
          geojson: data,
        });
      });

    axios.get('data.json')
      .then(({ data }) => {
        this.setState({
          data,
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

  getFeatureFromGeoJson(id) {
    return this.state.geojson.features.find(feature => {
      return feature.properties.id === parseInt(id);
    });
  }

  convertValueToColor(minimum, maximum, value) {
    const ratio = 2 * (value - minimum) / (maximum - minimum);
    const b = parseInt(Math.max(0, 255 * (1 - ratio)));
    const r = parseInt(Math.max(0, 255 * (ratio - 1)));
    const g = 255 - b - r;
    return [ r, g, b ];
  }

  getValueForPropertyAndYear(property, year) {
    return Math.random();
  }

  getAreaLayersToDisplay() {
    const propertyToDisplay = 'Violent_Crimes';
    const yearToDisplay = '2016';

    const layers = [];

    this.state.data.forEach(area => {
      const feature = this.getFeatureFromGeoJson(area.NPA);
      const value = this.getValueForPropertyAndYear(propertyToDisplay, yearToDisplay);
      const color = this.convertValueToColor(0, 1, value);

      layers.push(new GeoJsonLayer({
        data: {
          type: 'FeatureCollection',
          features: [
            feature,
          ],
        },
        filled: true,
        getFillColor: [color[0], color[1], color[2], 50],
        id: `geojson-layer-${area.NPA}`,
        stroked: false,
      }));
    });

    return layers;
  }

  getLayers(geojson) {
    const geojsonLayer = new GeoJsonLayer({
      data: geojson,
      filled: false,
      getLineColor: d => [175, 175, 175],
      id: 'geojson-layer',
      lineWidthMinPixels: 1,
      lineWidthScale: 1,
      stroked: true,
    });

    const areaLayers = ((this.state.data && this.state.geojson) && this.getAreaLayersToDisplay()) || [];
    return [geojsonLayer].concat(areaLayers);
  }

  render() {
    const { viewport, geojson } = this.state;

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
            layers={this.getLayers(geojson)}
            onWebGLInitialized={this.initialize}
          />
        </MapGL>
      </div>
    );
  }
}

export default CrimeMap;
