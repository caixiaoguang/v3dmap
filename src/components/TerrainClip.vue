<template>
  <div class="terrain-clip-wrap">
    <el-button size="mini" @click="init">挖方</el-button>
    <div class="clip-planel">
      <el-input size="mini" v-model="height" @change="clip"></el-input>
    </div>
  </div>
</template>

<script>
import initDynamicDrawTool from "@/utils/drawTool.js";
import initTerrainClipPlan from "@/utils/terrain_clip.js";

export default {
  data() {
    return {
      height: "",
      cartesians: "",
    };
  },
  mounted() {
    // console.log(initDynamicDrawTool());
  },
  methods: {
    init() {
      //   console.log(initDynamicDrawTool());
      //   const DynamicDrawTool = initDynamicDrawTool();

      drawPolygon();

      let that = this;

      function drawPolygon() {
        var gonOption = {
          width: 15,
          geodesic: true,
        };

        const DynamicDrawTool = initDynamicDrawTool();

        DynamicDrawTool.startDrawingPolyshape(
          viewer,
          true,
          gonOption,
          (cartesians) => {
            console.log(cartesians);
            //下面对处理代码
            //....
            that.cartesians = cartesians;
            that.clip();
          }
        );
      }
    },
    clip() {
      if (!this.height || !this.cartesians) return;

      if (this.clipInctance) {
        this.clipInctance.clear();
      }

      if (!Cesium.TerrainClipPlan) {
        initTerrainClipPlan();
      }

      this.clipInctance = new Cesium.TerrainClipPlan(viewer, {
        height: this.height,
        splitNum: 50,
        wallImg: require("@/assets/img/excavate_side_min.jpg"),
        bottomImg: require("@/assets/img/excavate_bottom_min.jpg"),
      });
      this.clipInctance.updateData(this.cartesians);
    },
  },
};
</script>



<style lang="less" scoped>
.terrain-clip-wrap {
  position: absolute;
  top: 20px;
  z-index: 100;
}
</style>