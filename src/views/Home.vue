<template>
  <div class="home">
    <head-title />
    <layer />

    <vc-viewer
      :showCredit="false"
      :shouldAnimate="true"
      :fullscreenButton="true"
      @ready="viewerReady"
    >
      <vc-layer-imagery>
        <vc-provider-imagery-tianditu
          mapStyle="img_w"
          :maximumLevel="18"
          :token="token"
        />
      </vc-layer-imagery>

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

      <vc-primitive-tileset
        url="http://159.75.121.194/xingyi/tileset.json"
        @readyPromise="onTilesetReady"
      ></vc-primitive-tileset>
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
      // token: "3cb95943baef24c1642b58bbebce332c",
      token: "0de59a2dff2555e94a670e2511996e6e",
      measureOptions: { color: "#3f4854" },
    };
  },
  methods: {
    viewerReady(e) {
      const { Cesium, viewer, vm } = e;
      window.Cesium = Cesium;
      window.viewer = viewer;

      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(114.25682, 22.58522, 5000),
      });

      viewer.scene.globe.depthTestAgainstTerrain = true;
    },
    onTilesetReady(tileset, viewer) {
      const cartographic = Cesium.Cartographic.fromCartesian(
        tileset.boundingSphere.center
      );

      const surface = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        // cartographic.height
        0
      );
      const offset = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        -1135
      );
      const translation = Cesium.Cartesian3.subtract(
        offset,
        surface,
        new Cesium.Cartesian3()
      );
      tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
      viewer.zoomTo(tileset);
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
