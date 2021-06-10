<template>
  <div class="terrain-clip-wrap">
    <el-button size="mini" @click="draw">click</el-button>
    <el-button size="mini" @click="clip">clip</el-button>

    <div class="clip-planel">
      <el-input size="mini" v-model="height" @change="clip"></el-input>
    </div>
  </div>
</template>

<script>
import initTerrainClipPlan from "@/utils/terrain_clip.js";
import TerrainClip from "@/utils/clip.js";
import DrawTool from "@/utils/draw.js";

export default {
  data() {
    return {
      height: 100,
      cartesians: [
        {
          x: -2419500.8446898544,
          y: 5372080.730034703,
          z: 2434635.0584244565,
        },
        {
          x: -2420269.4292256795,
          y: 5372081.440158087,
          z: 2433874.569094792,
        },
        {
          x: -2420983.436843025,
          y: 5371402.764097388,
          z: 2434656.9371409677,
        },
        {
          x: -2420025.3788017174,
          y: 5371584.560585075,
          z: 2435204.5823066984,
        },
      ],
    };
  },
  mounted() {
    // console.log(initDynamicDrawTool());
  },
  methods: {
    clip() {
      if (!this.height || !this.cartesians) return;

      if (!Cesium.TerrainClipPlan) {
        initTerrainClipPlan();
      }

      if (!this.clipInctance) {
        // this.clipInctance = new TerrainClip(viewer, {
        //   height: this.height,
        //   splitNum: 50,
        //   wallImg: require("@/assets/img/excavate_side_min.jpg"),
        //   bottomImg: require("@/assets/img/excavate_bottom_min.jpg"),
        // });

        this.clipInctance = new Cesium.TerrainClipPlan(viewer, {
          height: this.height,
          splitNum: 50,
          wallImg: require("@/assets/img/excavate_side_min.jpg"),
          bottomImg: require("@/assets/img/excavate_bottom_min.jpg"),
        });
      }

      this.clipInctance.updateData(this.cartesians);
    },
    draw() {
      if (!this.drawTool) {
        this.drawTool = new DrawTool();
      }
      this.drawTool.startDraw("polygon", this.drawComleted);
    },
    drawComleted(e, polygon) {
      this.cartesians = e;
    // console.log(polygon);

    //   var polyPositions = polygon.polygon.hierarchy.getValue(
    //     Cesium.JulianDate.now()
    //   ).positions;
    //   var polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;

    //   console.log(polyCenter);
    //   this.drawTool.clear();
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