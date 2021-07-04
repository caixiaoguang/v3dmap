<template ></template>
<script>
const baseUrl = process.env.BASE_URL;

export default {
  created() {
    this.addGeojsonLayer();
  },
  methods: {
    addGeojsonLayer() {
      this.gzs = new mars3d.layer.GeoJsonLayer({
        name: "gzs",
        url: `${baseUrl}static/高速.json`,
        symbol: {
          styleOptions: {
            // outline: true,
            // outlineWidth: 2,
            // color: "#34c9ee83",
            materialType: "PolylineGlow",
            glowPower: 0.06, //发光强度
            width: 30, //线宽
            color: "#34c9ee",
            opacity: 0.9,
            clampToGround: true,
          },
        },
        // popup: "{NAME}",
      });
      $map.addLayer(this.gzs);
    },
  },
  beforeUnmount() {
    this.gzs && $map.removeLayer(this.gzs);
  },
};
</script>

<style>
</style>