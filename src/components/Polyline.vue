<template ></template>
<script>
const baseUrl = process.env.BASE_URL;

const defaultLineStyle = {
  outline: true,
  outlineWidth: 2,
  color: "#34c9ee83",
};

const defaultMaterialStyle = {
  materialType: "PolylineGlow",
  glowPower: 0.06, //发光强度
  width: 30, //线宽
  color: "#34c9ee",
  opacity: 0.9,
};

export default {
  props: {
    active: false,
    layerName: "",
    hasMaterial: false,
    materialStyle: {},
    lineStyle: {},
  },
  created() {
    this.addGeojsonLayer();
  },
  watch: {
    active(newVal) {
      this.layer && (this.layer.show = newVal);
    },
  },
  methods: {
    addGeojsonLayer() {
      let style;
      if (this.hasMaterial) {
        style = Object.assign(defaultMaterialStyle, this.materialStyle);
      } else {
        style = Object.assign(defaultLineStyle, this.lineStyle);
      }

      this.layer = new mars3d.layer.GeoJsonLayer({
        name: this.layerName,
        url: `${baseUrl}static/${this.layerName}.json`,
        symbol: {
          styleOptions: {
            ...style,
            clampToGround: true,
          },
        },
        // popup: "{NAME}",
      });
      this.layer.show = this.active;
      $map.addLayer(this.layer);
    },
  },
  beforeUnmount() {
    this.layer && $map.removeLayer(this.layer);
  },
};
</script>

<style>
</style>