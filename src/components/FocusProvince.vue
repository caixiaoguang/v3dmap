<template>
  <div class="analysis-panel" v-show="active">
    <div class="title">统计情况</div>
    <el-tabs v-model="currentProvince" @tab-click="tabClick">
      <el-tab-pane
        v-for="tab in tabList"
        :key="tab.name"
        :name="tab.name"
        :label="tab.label"
      >
        <div class="content">
          <div class="cell" v-for="item in tab.data" :key="item">
            <div class="name">
              <i class="el-icon-pie-chart"></i>
              {{ item["评价等"] }}
            </div>
            <div class="count">
              未开发：<span>{{ item["未开发"] }}</span> 个
            </div>
            <div class="count">
              已开发：<span class="green">{{ item["已开发"] }}</span> 个
            </div>
            <div class="count">
              等级开发比例：<span class="normal">{{
                formatNumber(item["等级开发比例"])
              }}</span>
            </div>
            <div class="count">
              开发资源占比：<span class="normal">{{
                formatNumber(item["开发资源占比"])
              }}</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { degree2decimal, loadRemoteFile } from "@/utils/utils.js";
const baseUrl = process.env.BASE_URL;
const excelUrl = `${baseUrl}static/旅游数据/重点县`;
const excelNameList = ["520628", "522326", "522327"];
const provinveDic = {
  520628: { name: "松桃县", center: [105.79, 24.91] },
  522326: { name: "望谟县", center: [106.14, 25.22] },
  522327: { name: "册亨县", center: [109.07, 28.05] },
};
export default {
  props: {
    active: false,
  },
  data() {
    return {
      currentProvince: "520628",
      tabList: [],
      columns: ["评价等", "未开发", "已开发", "等级开发比例", "开发资源占比"],
    };
  },
  created() {
    this.getData();
  },
  watch: {
    active(newVal) {
      this.graphicLayer && (this.graphicLayer.show = newVal);
    },
  },
  methods: {
    getData() {
      excelNameList.forEach((el) => {
        loadRemoteFile(`${excelUrl}/${el}.xls`).then(
          (res) => {
            this.initData(res, el);
          },
          (reason) => {
            loadRemoteFile(`${excelUrl}/${el}.xlsx`).then((res) => {
              this.initData(res);
            });
          }
        );
      });
    },
    initData(list, provinceCode) {
      this.tabList.push({
        label: provinveDic[provinceCode].name,
        name: provinceCode,
        data: list[1],
      });
      this.addFeature(list[0]);
    },
    formatNumber(value) {
      if (isNaN(value)) {
        return value;
      } else {
        let isInt = value.toString().split(".").length === 1;
        return isInt ? value : value.toFixed(4);
      }
    },
    tabClick(tab) {
      const name = tab.props.name;
      const position = provinveDic[name].center;
      $map.flyToPoint(position, { radius: 45000, pitch: -20 });
    },
    addFeature(arr) {
      if (!this.graphicLayer) {
        this.graphicLayer = new mars3d.layer.GraphicLayer({
          //点的聚合配置
          clustering: {
            enabled: true,
            // pixelRange: 20,
          },
        });
        $map.addLayer(this.graphicLayer);
      }

      this.graphicLayer.bindPopup(function (event) {
        if (!event.graphic) {
          return false;
        }
        let item = event.graphic.attr;
        const inthtml =
          '<table style="width: auto;"><tr>' +
          '<th scope="col" colspan="4"  style="text-align:center;font-size:15px;">' +
          "基本情况" +
          "</th></tr><tr>" +
          "<td >区县：</td><td >" +
          item["县（市"] +
          "</td></tr><tr>" +
          "<td >乡镇：</td><td >" +
          item["乡（镇"] +
          "</td></tr><tr>" +
          "<td >村：</td><td >" +
          item["村"] +
          "</td></tr><tr>" +
          "<td >组：</td><td >" +
          item["组"] +
          "</td></tr><tr>" +
          "<td >类型：</td><td >" +
          item["旅游资源分类"] +
          "</td></tr><tr>" +
          "<td >开发情况：</td><td >" +
          item["开发现"] +
          '<td colspan="4" style="text-align:right;"></td></tr></table>';
        return inthtml;
      });

      //单击事件
      this.graphicLayer.on(mars3d.EventType.click, (event) => {
        // console.log("你单击了", event);

        if ($map.camera.positionCartographic.height > 90000) {
          this.graphicLayer.closePopup();

          var graphic = event.graphic;
          if (graphic) {
            //单击了具体的点对象
            var position = graphic.positionShow;
            $map.flyToPoint(position, {
              radius: 5000, //距离目标点的距离
              duration: 4,
              complete: (e) => {
                //飞行完成回调方法
                this.graphicLayer.openPopup(graphic);
              },
            });
          } else {
            //单击了聚合的点
            var arrEntity = event.pickedObject.id;
            $map.flyTo(arrEntity);
          }
        }
      });

      for (let i = 0, len = arr.length; i < len; i++) {
        var item = arr[i];
        var graphic = new mars3d.graphic.BillboardEntity({
          position: new mars3d.LatLngPoint(
            degree2decimal(item["东经"]),
            degree2decimal(item["北纬"]),
            0
            // item["高程"] || 0
          ),
          style: {
            image: require("../assets/img/mark.png"),
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scaleByDistance: new Cesium.NearFarScalar(1000, 0.7, 5000000, 0.3),
            label: {
              text: item["名称"],
              font_size: 14,
              color: Cesium.Color.AZURE,
              outline: true,
              outlineColor: Cesium.Color.BLACK,
              outlineWidth: 2,
              horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              pixelOffset: new Cesium.Cartesian2(20, -5), //偏移量
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                0.0,
                80000
              ),
            },
          },
          attr: item,
        });
        this.graphicLayer.addGraphic(graphic);
        this.graphicLayer.show = this.active;
      }
    },
  },
};
</script>

<style lang="scss">
.analysis-panel {
  .el-tabs__item {
    color: #1799b99c;
  }
}
</style>

<style lang="scss" scoped>
.analysis-panel {
  padding-left: 20px;
  .content {
    width: 320px;
    .cell {
      width: 50%;
      &:last-child{
        padding-bottom: 20px;
      }
      .count {
        padding: 4px;
        font-size: 12px;
      }
    }
  }
}
</style>