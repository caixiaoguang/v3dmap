<template>
  <div class="analysis-panel">
    <div class="">
      <table>
        <thead>
          <tr>
            <th :colspan="columns.length">统计情况</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(dataItem, index) in data" :key="index">
            <td v-for="(key, index) in columns" :key="index">
              {{ dataItem[key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: { type: Array },
    columns: { type: Array },
  },
};
</script>

<style lang="scss" scoped>
.analysis-panel {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 100;
  background: rgba(63, 72, 84, 0.6);
  color: #fff;
  padding: 10px;
  font-size: 14px;
  border-radius: 3px;
}
</style>