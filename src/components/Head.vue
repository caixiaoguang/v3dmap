<template>
  <div class="head">
    <h2>旅游地理图谱信息系统</h2>
    <el-button class="btn1" @click="changeLayerType('threeD')">场景三维模拟</el-button>
    <el-button class="btn2" @click="changeLayerType('travel')">全省旅游概况</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    changeLayerType(type) {
      this.$emit("changeLayerType", type);
    },
  },
};
</script>

<style lang="scss">
.head {
  .el-button {
    background-color: #91dbef69;
    border: 1px solid #34c9ee;
    color: #34c9ee;
    transform: translateY(-30px);
    &.btn1 {
      margin-right: 500px;
    }
  }
}
</style>

<style lang="scss" scoped>
.head {
  position: absolute;
  left: 0;
  top: 0;
  height: 60px;
  width: 100%;
  z-index: 100;
  background: no-repeat center url("../assets/img/header.png");
  text-align: center;
  color: #34c9ee;
}
</style>