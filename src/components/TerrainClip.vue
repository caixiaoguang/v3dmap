<template>
  <div class="terrain-clip-wrap">
    <el-button size="mini" @click="draw">click</el-button>
    <el-button size="mini" @click="drawTool.clear()">clear</el-button>

    <div class="clip-planel">
      <el-input size="mini" v-model="height" @change="clip"></el-input>
    </div>
  </div>
</template>

<script>
import initTerrainClipPlan from "@/utils/terrain_clip.js";
import DrawTool from "@/utils/draw.js";

export default {
  data() {
    return {
      height: 100,
      cartesians: "",
    };
  },
  mounted() {
    // console.log(initDynamicDrawTool());
  },
  methods: {
    clip() {
      if (!this.height || !this.cartesians) return;

      if (this.clipInctance) {
        // this.clipInctance.clear();
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
    draw() {
      if (!this.drawTool) {
        this.drawTool = new DrawTool();
      }
      this.drawTool.startDraw("polygon", this.drawComleted);
    },
    drawComleted(e) {
      this.cartesians = e;
      this.drawTool.clear();
      this.clip();
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