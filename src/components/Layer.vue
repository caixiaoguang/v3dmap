<template>
  <div class="layer-panel">
    <div class="layer-item">
      <span class="layer-name">天气</span>
      <div class="layer-switch">
          <el-checkbox>雨</el-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.layer-panel {
  position: absolute;
  z-index: 1000;
  width: 200px;
  height: 500px;
  background-color: #3f4854e8;
  color: #fff;
  top: 20px;
  left: 20px;
}
</style>