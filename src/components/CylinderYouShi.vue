<template></template>

<script>
import { loadRemoteFile } from "@/utils/utils.js";
import center from "@/utils/center.json";

const baseUrl = process.env.BASE_URL;
const youshiUrl = `${baseUrl}static/旅游数据/贵州旅游优势度.xlsx`;

export default {
  created() {
    this.addGeojsonLayer();
    this.loadYouSHiData();
  },
  methods: {
    addGeojsonLayer() {
      this.gzs = new mars3d.layer.GeoJsonLayer({
        name: "gzs",
        url: `${baseUrl}static/gzs.json`,
        symbol: {
          styleOptions: {
            opacity: 0.7,
            outline: true,
            outlineColor: "#ccc",
          },
        },
        // popup: "{NAME}",
      });
      $map.addLayer(this.gzs);
    },

    async loadYouSHiData() {
      const excelData = await loadRemoteFile(youshiUrl);
      const data = excelData[0];
      if (!this.graphicLayer) {
        this.graphicLayer = new mars3d.layer.GraphicLayer();
        $map.addLayer(this.graphicLayer);
      }

      for (let i = 0; i < data.length; i++) {
        const el = data[i];
        const name = el["行政区"];
        const lngLat = this.getPosition(name);
        if (!lngLat) continue;
        const position = Cesium.Cartesian3.fromDegrees(...lngLat, 10);
        const height = el["优势度"] * 10000;
        // const color = el[]
        const html = `区县：${name}<br>优势度：${el["优势度"]}`;

        this.createZT(position, height, "", html);
      }
    },

    createZT(position, len, color, html) {
      const graphic = new mars3d.graphic.CylinderEntity({
        position: position,
        style: {
          length: len,
          topRadius: 6000.0,
          bottomRadius: 6000.0,
        },
      });
      this.graphicLayer.addGraphic(graphic);

      graphic.bindTooltip(html);

      return graphic;
    },

    getPosition(name) {
      let coord;
      let features = center.features;
      for (let i = 0; i < features.length; i++) {
        if (name === features[i].properties.NAME) {
          coord = features[i].geometry.coordinates;
          break;
        }
      }
      return coord;
    },
  },
};
</script>

<style>
</style>