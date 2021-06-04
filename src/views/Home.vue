<template>
  <div class="home">
    <vc-viewer
      :showCredit="false"
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
      <layer/>

      <!-- <vc-primitive-tileset
        url="https://zouyaoji.top/vue-cesium/SampleData/Cesium3DTiles/Tilesets/dayanta/tileset.json"
        @readyPromise="onTilesetReady"
      ></vc-primitive-tileset> -->
    </vc-viewer>
  </div>
</template>

<script>
import Rain from "@/components/Rain";
import Layer from "@/components/Layer"
export default {
  name: "Home",
  components: {
    Rain,
    Layer
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
