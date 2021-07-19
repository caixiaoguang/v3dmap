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
    // this.addGeojsonLayer();
    this.addLayer();
  },
  watch: {
    active(newVal) {
      this.graphicLayer && (this.graphicLayer.show = newVal);
    },
  },
  methods: {
    addLayer() {
      this.graphicLayer = new mars3d.layer.GraphicLayer();
      $map.addLayer(this.graphicLayer);
      Cesium.GeoJsonDataSource.load(
        `${baseUrl}static/${this.layerName}.json`
      ).then((dataSource) => {
        this.addGraphics(dataSource);
      });
    },
    addGraphics(dataSource) {
      let positions = [];
      dataSource.entities.values.forEach((feature) => {
        const primitive = new mars3d.graphic.PolylinePrimitive({
          positions: feature.polyline.positions._value,
          style: {
            width: 6,
            material: mars3d.MaterialUtil.createMaterial(
              mars3d.MaterialType.LineFlow,
              {
                image: require("../assets/img/LinkPulse.png"),
                color: Cesium.Color.CORAL,
                repeat: new Cesium.Cartesian2(10.0, 1.0),
                speed: 1,
              }
            ),
          },
        });
        this.graphicLayer.show = this.active;
        this.graphicLayer.addGraphic(primitive);
      });
    },
    addGeojsonLayer() {
      this.graphicLayer = new mars3d.layer.GraphicLayer();
      $map.addLayer(this.graphicLayer);

      const layer = new mars3d.layer.GeoJsonLayer({
        name: this.layerName,
        url: `${baseUrl}static/${this.layerName}.json`,
        onCreateGraphic: (data) => {
          console.log(data);
        },
      });
      $map.addLayer(layer);
      layer.show = false;
      this.graphicLayer.show = this.active;
    },
  },
  beforeUnmount() {
    this.graphicLayer && $map.removeLayer(this.graphicLayer);
  },
};
</script>

<style>
</style>