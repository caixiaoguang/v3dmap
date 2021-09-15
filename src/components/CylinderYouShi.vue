<template>
  <div class="analysis-panel" v-show="active">
    <div class="title">统计情况</div>
    <div class="content">
      <div class="cell" v-for="item in Object.keys(anaData)" :key="item">
        <div class="name">
          <i class="el-icon-pie-chart"></i>
          {{ item }}
        </div>
        <div class="count">
          <span>{{ anaData[item] }}</span> 个
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loadRemoteFile } from "@/utils/utils.js";
import geostats from "geostats";

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
      // this.anaData = excelData[1];
      if (!this.graphicLayer) {
        this.graphicLayer = new mars3d.layer.GraphicLayer();
        $map.addLayer(this.graphicLayer);
      }

      let values = [];
      for (let i = 0; i < data.length; i++) {
        const el = data[i];
        values.push(el["优势度"]);
      }
      const numStats = {
        优势区: 0,
        中等区: 0,
        劣势区: 0,
      };
      const serie = new geostats(values);
      serie.setPrecision(3);
      serie.getClassJenks(3);
      const bounds = serie.bounds;
      serie.serie.forEach((el) => {
        if (el >= bounds[0] && el < bounds[1]) {
          numStats["劣势区"]++;
        }
        if (el >= bounds[1] && el < bounds[2]) {
          numStats["中等区"]++;
        }
        if (el >= bounds[2] && el < bounds[3]) {
          numStats["优势区"]++;
        }
      });
      this.anaData = numStats;

      for (let i = 0; i < data.length; i++) {
        let color;
        const el = data[i];
        const name = el["行政区"];
        const youshiValue = el["优势度"];
        const lngLat = this.getPosition(name);
        if (!lngLat) continue;
        const position = Cesium.Cartesian3.fromDegrees(...lngLat, 10);
        const height = el["优势度"] * 10000;
        // const color = el[]
        const html = `区县：${name}<br>优势度：${el["优势度"].toFixed(3)}`;
        if (youshiValue >= bounds[0] && youshiValue < bounds[1]) {
          color = Cesium.Color.fromHsl(0.6 - 0.3, 1.0, 0.5);
        } else if (youshiValue >= bounds[1] && youshiValue < bounds[2]) {
          color = Cesium.Color.fromHsl(0.6 - 0.01, 1.0, 0.5);
        } else if (youshiValue >= bounds[2] && youshiValue < bounds[3]) {
          color = Cesium.Color.fromHsl(0.6 - 0.5, 1.0, 0.5);
        }

        this.createZT(position, height, color, html);
      }
    },

    createZT(position, len, color, html) {
      const graphic = new mars3d.graphic.CylinderEntity({
        position: position,
        style: {
          length: len,
          topRadius: 3000.0,
          bottomRadius: 3000.0,
          materialType: mars3d.MaterialType.PolyGradient,
          // color: "#34c9ee",
          color,
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