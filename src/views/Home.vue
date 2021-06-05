<template>
  <div class="home">
    <vc-viewer
      :showCredit="false"
      :shouldAnimate="true"
      :fullscreenButton="true"
      :imageryProvider="imageryProvider"
      @ready="viewerReady"
    >
      <vc-layer-imagery>
        <vc-provider-imagery-tianditu
          mapStyle="img_w"
          :maximumLevel="18"
          :token="token"
        />
      </vc-layer-imagery>

      <vc-provider-terrain-tianditu :token="token" />

      <vc-navigation
        :printOpts="false"
        :locationOpts="false"
        :otherOpts="{ position: 'bottom' }"
      />

      <vc-measurements
        ref="measurementsRef"
        position="top-right"
        :measurements="['polyline', 'area', 'height']"
        :offset="[130, 30]"
      />

      <!-- <rain /> -->
      <layer />

      <!-- <vc-primitive-tileset
        url="https://zouyaoji.top/vue-cesium/SampleData/Cesium3DTiles/Tilesets/dayanta/tileset.json"
        @readyPromise="onTilesetReady"
      ></vc-primitive-tileset> -->
    </vc-viewer>
  </div>
</template>

<script>
import Rain from "@/components/Rain";
import Layer from "@/components/Layer";
export default {
  name: "Home",
  components: {
    Rain,
    Layer,
  },
  data() {
    return {
      imageryProvider: null,
      token: "3cb95943baef24c1642b58bbebce332c",
      measureOptions: { color: "#3f4854" },
    };
  },
  methods: {
    viewerReady(e) {
      const { Cesium, viewer, vm } = e;
      window.viewer = viewer;
      setTimeout(() => {
        flyInACity();
      }, 2000);
      function flyInACity() {
        var camera = viewer.scene.camera;
        camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            104.98580932617188,
            30.74843406689482,
            1363.34038727246224
          ),
          complete: function () {
            setTimeout(function () {
              camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(
                  104.98585975679403,
                  30.75759944127251,
                  1186.50838555841779
                ),
                orientation: {
                  heading: Cesium.Math.toRadians(200.0),
                  pitch: Cesium.Math.toRadians(-50.0),
                },
                easingFunction: Cesium.EasingFunction.LINEAR_NONE,
              });
            }, 1000);
          },
        });
      }
    },
    onTilesetReady(tileset, viewer) {
      const cartographic = Cesium.Cartographic.fromCartesian(
        tileset.boundingSphere.center
      );
      const surface = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        cartographic.height
      );
      const offset = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        5
      );
      const translation = Cesium.Cartesian3.subtract(
        offset,
        surface,
        new Cesium.Cartesian3()
      );
      tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
      viewer.zoomTo(tileset);
      viewer.scene.globe.depthTestAgainstTerrain = true;
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
}
</style>
