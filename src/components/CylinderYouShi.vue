<template>
  <div class="analysis-panel" v-show="active">
    <div class="title">统计情况</div>
    <div class="content">
      <div class="cell" v-for="item in anaData" :key="item">
        <div class="name">
          <i class="el-icon-pie-chart"></i>
          {{ item["优势度等级"] }}
        </div>
        <div class="count">
          <span>{{ item["个数"] }}</span> 个
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loadRemoteFile } from "@/utils/utils.js";

import center from "@/utils/center.json";

const baseUrl = process.env.BASE_URL;
const youshiUrl = `${baseUrl}static/旅游数据/贵州旅游优势度.xlsx`;

export default {
  props: {
    active: false,
  },
  components: {},
  data() {
    return {
      anaData: [],
      columns: ["优势度等级", "个数"],
    };
  },
  created() {
    this.loadYouSHiData();
    // this.addBaseLayer();
  },
  watch: {
    active(newVal) {
      this.graphicLayer && (this.graphicLayer.show = newVal);
    },
  },
  methods: {
    async loadYouSHiData() {
      const excelData = await loadRemoteFile(youshiUrl);
      const data = excelData[0];
      this.anaData = excelData[1];
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
        const html = `区县：${name}<br>优势度：${el["优势度"].toFixed(3)}`;

        this.createZT(position, height, "", html);
      }
    },

    addBaseLayer() {
      this.baseLayer = new mars3d.layer.GeoJsonLayer({
        type: "geojson",
        name: "淮海经济区11市",
        url: "http://data.marsgis.cn/file/geojson/huaihai.json",
        symbol: {
          styleOptions: {
            materialType: mars3d.MaterialType.PolyGradient,
            color: "#3388cc",
            opacity: 0.7,
            alphaPower: 1.3,
            length: "{gdp}",
          },
          styleField: "Name",
          styleFieldOptions: {
            济宁市: { color: "#D4AACE" },
            临沂市: { color: "#8DC763" },
            菏泽市: { color: "#F7F39A" },
            枣庄市: { color: "#F7F39A" },
            徐州市: { color: "#96F0F1" },
            宿迁市: { color: "#EAC9A8" },
            连云港市: { color: "#F7F39A" },
            商丘市: { color: "#D4AACE" },
            宿州市: { color: "#8DC763" },
            亳州市: { color: "#96F0F1" },
            淮北市: { color: "#EAC9A8" },
          },
        },
        popup: "{Name}",
        show: true,
      });
      $map.addLayer(this.baseLayer);
    },

    createZT(position, len, color, html) {
      const graphic = new mars3d.graphic.CylinderEntity({
        position: position,
        style: {
          length: len,
          topRadius: 3000.0,
          bottomRadius: 3000.0,
          materialType: "CircleScan",
          color: "#34c9ee",
        },
      });
      this.graphicLayer.addGraphic(graphic);
      graphic.bindTooltip(html);

      this.graphicLayer.show = this.active;

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

<style lang="scss" scoped>
.cell {
  padding-right: 20px;
  &:last-child {
    padding-right: 0;
  }
}
</style>