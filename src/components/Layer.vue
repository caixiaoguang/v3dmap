<template>
  <!-- <div class="drawer-button" @click="showDrawer = true" v-show="!showDrawer">
    <i class="el-icon-s-unfold"></i>
  </div> -->

  <over-view v-if="ready" :active="overview"></over-view>
  <cylinder-you-shi v-if="ready" :active="youShi"></cylinder-you-shi>
  <focus-province v-if="ready" :active="focusProvince"></focus-province>
  <poly-line layerName="gzs_polyline" v-if="ready" :active="district" />

  <!-- <poly-line
    layerName="gzs_road"
    :hasMaterial="true"
    :materialStyle="{ width: 10 }"
    v-if="ready"
    :active="road"
  /> -->

  <vc-primitive-tileset
    url="http://159.75.121.194/xingyi/tileset.json"
    @readyPromise="onTilesetReady"
    v-if="photo"
  ></vc-primitive-tileset>

  <div class="layer-panel">
    <div class="layer-item">
      <div class="layer-name">
        <i class="el-icon-sunny"></i>
        <span>基础底图</span>
      </div>
      <div class="layer-switch">
        <el-radio-group v-model="baseMap" @change="changeBaseMap">
          <el-radio label="satellite" style="margin-bottom: 5px"
            >影像图</el-radio
          >
          <el-radio label="nightMap">暗色地图</el-radio>
        </el-radio-group>
      </div>
    </div>

    <div class="layer-item">
      <div class="layer-name">
        <i class="el-icon-sunny"></i>
        <span>天气</span>
      </div>
      <div class="layer-switch">
        <el-checkbox v-model="rain" @change="handleRain">雨</el-checkbox>
        <el-checkbox v-model="snow" @change="handleSnow">雪</el-checkbox>
      </div>
    </div>

    <div class="layer-item">
      <div class="layer-name">
        <i class="el-icon-sunny"></i>
        <span>矢量数据</span>
      </div>
      <div class="layer-switch">
        <el-checkbox v-model="district">行政区划</el-checkbox>
        <el-checkbox v-model="road">道路</el-checkbox>
      </div>
    </div>

    <div class="layer-item">
      <div class="layer-name">
        <i class="el-icon-sunny"></i>
        <span>旅游资源</span>
      </div>
      <div class="layer-switch">
        <el-checkbox v-model="overview">概况</el-checkbox>
        <el-checkbox v-model="youShi">优势度</el-checkbox>
        <el-checkbox v-model="focusProvince">重点县</el-checkbox>
      </div>
    </div>

    <div class="layer-item">
      <div class="layer-name">
        <i class="el-icon-sunny"></i>
        <span>三维图层</span>
      </div>
      <div class="layer-switch">
        <el-checkbox v-model="photo">倾斜摄影</el-checkbox>
        <el-checkbox v-model="single">单体建筑</el-checkbox>
        <div class="slider-wrap">
          <span class="slider-name">经度：</span>
          <el-slider
            v-model="longitude"
            :step="0.01"
            :min="103"
            :max="109"
            @change="positionModify"
          ></el-slider>
          <span class="slider-name">纬度：</span>
          <el-slider
            v-model="latitude"
            :step="0.01"
            :min="24"
            :max="30"
            @change="positionModify"
          ></el-slider>
          <span class="slider-name">高度：</span>
          <el-slider
            v-model="height"
            :step="1"
            :min="0"
            :max="500"
            @change="positionModify"
          ></el-slider>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createSnowStage, createRainStage } from "@/utils/weather_glsl.js";
import OverView from "@/components/overview/OverView";
import CylinderYouShi from "@/components/CylinderYouShi";
import PolyLine from "@/components/Polyline";
import FocusProvince from "@/components/FocusProvince";

export default {
  props: {
    ready: false,
  },
  components: {
    OverView,
    CylinderYouShi,
    FocusProvince,
    PolyLine,
  },
  data() {
    return {
      rain: false,
      snow: false,
      showDrawer: false,
      overview: false,
      youShi: false,
      focusProvince: false,
      district: true,
      road: false,
      baseMap: "satellite",
      photo: false,
      single: false,
      longitude: "",
      latitude: "",
      height: "",
    };
  },

  watch: {
    ready(newVal) {
      if (newVal) {
        this.satellite = new mars3d.layer.TdtLayer({
          name: "satellite",
          layer: "img_d",
          key: ["164d40b29ad7c5c159c3b51a20c584d8"],
        });
        this.nightMap = new mars3d.layer.ArcGisLayer({
          name: "nightmap",
          url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
          showClickFeature: false,
        });
        this.activeBasemap = this.satellite;
        $map.addLayer(this.satellite);
      }
    },
  },
  mounted() {},

  methods: {
    onTilesetReady(tileset, viewer) {
      const cartographic = Cesium.Cartographic.fromCartesian(
        tileset.boundingSphere.center
      );
      this.tileset = tileset;
      this.longitude = this.originLon = Cesium.Math.toDegrees(
        cartographic.longitude
      );
      this.latitude = this.originLat = Cesium.Math.toDegrees(
        cartographic.latitude
      );
      this.height = 0;

      this.positionModify();

      // viewer.zoomTo(tileset);
    },
    onSingleTilesetReady(tileset, viewer) {
      const cartographic = Cesium.Cartographic.fromCartesian(
        tileset.boundingSphere.center
      );
    },
    positionModify() {
      const surface = Cesium.Cartesian3.fromDegrees(
        this.originLon,
        this.originLat,
        // cartographic.height
        0
      );

      const offset = Cesium.Cartesian3.fromDegrees(
        this.longitude,
        this.latitude,
        this.height - 1135
      );
      const translation = Cesium.Cartesian3.subtract(
        offset,
        surface,
        new Cesium.Cartesian3()
      );

      this.tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

      const destination = new mars3d.LatLngPoint(
        this.longitude,
        this.latitude,
        100
      );

      $map.flyToPoint(destination, {
        radius: 500, //距离目标点的距离
        pitch: -30,
        duration: 4,
        complete: (e) => {
          //飞行完成回调方法
        },
      });
    },
    changeBaseMap(newVal) {
      $map.addLayer(this[newVal]);
      $map.removeLayer(this.activeBasemap);
      this.activeBasemap = this[newVal];
    },
    tianDiTuReady(obj) {
      const { vm } = obj;

      console.log(vm);
      this.tianDiTu = vm;
    },
    handleSnow(value) {
      if (value) {
        this.addWeather("snow");
      } else {
        this.removeWeather("snow");
      }
    },
    handleRain(value) {
      if (value) {
        this.addWeather("rain");
      } else {
        this.removeWeather("rain");
      }
    },
    addWeather(type) {
      if (!window.Cesium || !window.viewer) {
        this.snow = false;
        this.rain = false;
        return;
      }

      this.collection = viewer.scene.postProcessStages;

      if (type === "rain") {
        this.rainSystem = createRainStage();
        this.collection.add(this.rainSystem);
      } else {
        this.snowSystem = createSnowStage();
        this.collection.add(this.snowSystem);
      }
    },
    removeWeather(type) {
      if (type === "rain") {
        this.collection.remove(this.rainSystem);
      } else {
        this.collection.remove(this.snowSystem);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$bgColor: #3f4854;

.drawer-button {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  color: #fff;
  font-size: 30px;
  cursor: pointer;
  &:hover {
    color: rgb(233, 232, 232);
  }
}

.layer-panel {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  width: 190px;
  height: 100vh;
  padding: 12px 15px;
  background-color: $bgColor;
  border: 2px solid #275d926e;
  color: #fff;

  .layer-item {
    margin-bottom: 10px;
    .layer-name {
      font-size: 15px;
      background-color: #fff;
      background-color: #34c9ee83;
      color: #fff;
      border-radius: 5px;
      padding: 6px;
      i {
        margin-right: 5px;
        font-weight: 1000;
      }
    }

    .layer-switch {
      padding: 5px;
    }
  }
  .slider-wrap {
    padding-top: 10px;
    font-size: 14px;
  }
}
</style>