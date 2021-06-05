<template>
  <div>
    <transition name="fade">
      <div
        class="drawer-button"
        @click="showDrawer = true"
        v-show="!showDrawer"
      >
        <i class="el-icon-s-unfold"></i>
      </div>
    </transition>

    <el-drawer
      direction="ltr"
      :size="200"
      v-model="showDrawer"
      title="图层"
      :modal="false"
    >
      <div class="layer-panel">
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
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { createSnowStage, createRainStage } from "@/utils/weather_glsl.js";
export default {
  data() {
    return {
      rain: false,
      snow: false,
      showDrawer: false,
    };
  },
  mounted() {},

  methods: {
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
$bgColor: #5f6368;

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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
  width: 200px;
  height: 100vh;
  padding: 12px 8px;
  background-color: #fff;
  box-shadow: rgb(201, 197, 197);
  color: $bgColor;
  .layer-name {
    font-size: 15px;
    margin-bottom: 5px;
    background-color: $bgColor;
    border-radius: 5px;
    color: #fff;
    padding: 5px;
    i {
      margin-right: 5px;
      font-weight: 1000;
    }
  }
}
</style>