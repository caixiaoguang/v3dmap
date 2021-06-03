<template>
  <div class="home">
    <vc-viewer
      :homeButton="true"
      :showCredit="false"
      :fullscreenButton="true"
      :imageryProvider="imageryProvider"
      @ready="viewerReady"
    ></vc-viewer>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {},
  data() {
    return { imageryProvider: null };
  },
  methods: {
    viewerReady(e) {
      const { Cesium, viewer, vm } = e;
      const token = "3cb95943baef24c1642b58bbebce332c";
      const tdtUrl = "https://t{s}.tianditu.gov.cn/";
      const subdomains = ["0", "1", "2", "3", "4", "5", "6", "7"];
      this.imageryProvider = new Cesium.UrlTemplateImageryProvider({
        url: tdtUrl + "DataServer?T=img_w&x={x}&y={y}&l={z}&tk=" + token,
        subdomains: subdomains,
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        maximumLevel: 18,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
}
</style>
