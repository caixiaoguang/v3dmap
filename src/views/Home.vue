<template>
  <div class="home">
    <!-- <head-title /> -->
    <div class="baselayer-control"></div>

    <vc-viewer
      :showCredit="false"
      :shouldAnimate="true"
      :fullscreenButton="true"
      @ready="viewerReady"
    >
      <layer :ready="ready" />

      <!-- <vc-provider-terrain-tianditu :token="token" /> -->

      <vc-navigation
        :printOpts="false"
        :locationOpts="false"
        :otherOpts="{ position: 'bottom' }"
      />

      <vc-measurements
        ref="measurementsRef"
        position="top-right"
        :measurements="['polyline', 'area', 'vertical']"
        :offset="[130, 30]"
        @measureEvt="measureEvt"
      />

      <!-- <terrain-clip /> -->

      <!-- <vc-drawings></vc-drawings> -->

    </vc-viewer>
  </div>
</template>

<script>
import HeadTitle from "@/components/Head";
import Layer from "@/components/Layer";
import TerrainClip from "@/components/TerrainClip";

export default {
  name: "Home",
  components: {
    HeadTitle,
    Layer,
    TerrainClip,
  },
  data() {
    return {
      token: "164d40b29ad7c5c159c3b51a20c584d8",
      measureOptions: { color: "#3f4854" },
      ready: false,
    };
  },
  methods: {
    viewerReady(e) {
      const { Cesium, viewer, map } = e;
      window.Cesium = Cesium;
      window.viewer = viewer;
      window.$map = map;
      this.ready = true;
      viewer.selectedEntity = undefined;

      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(106.69, 26.336, 5000),
      });

      // viewer.scene.globe.depthTestAgainstTerrain = true;
    },
  
    measureEvt(e) {
      console.log(e);
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  // height: calc(100% + 25px);
  height: 100%;
}
</style>
