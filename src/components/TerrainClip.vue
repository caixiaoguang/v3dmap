<template>
  <div class="wrap">
    <el-button @click="init">挖方</el-button>
  </div>
</template>

<script>
import initDynamicDrawTool from "@/utils/drawTool.js";
// import initTerrainClipPlan from "@/utils/terrain_clip.js";

export default {
  mounted() {
    // console.log(initDynamicDrawTool());
  },
  methods: {
    init() {

      
    //   console.log(initDynamicDrawTool());
    //   const DynamicDrawTool = initDynamicDrawTool();

    
      drawPolygon()

      function drawPolygon() {
        var gonOption = {
          width: 15,
          geodesic: true,
        };

        const DynamicDrawTool = initDynamicDrawTool()
      
        DynamicDrawTool.startDrawingPolyshape(
          viewer,
          true,
          gonOption,
          function (cartesians) {
              console.log(cartesians);
            //下面对处理代码
            //....
          }
        );
      }
    },
  },
};
</script>

<style lang="less" scoped>
.wrap {
  position: absolute;
  top: 20px;
  z-index: 100;
}
</style>