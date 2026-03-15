<template>
  <el-row :gutter="24" class="panel-group">
    <el-col :xs="24" :sm="12" :md="12" class="card-panel-col">
      <div
        class="group-item-wrapper"
        :style="{ background: getBgColor(0) }"
        @click="handleSetLineChartData('newVisitis')"
      >
        <div class="card-content">
          <div class="left-icon">
            <svg-icon icon-class="tree" class-name="card-panel-icon" />
          </div>
          <div class="right-number">{{ buildingName }}</div>
        </div>
        <div class="card-title">宿舍楼名</div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" class="card-panel-col">
      <div
        class="group-item-wrapper"
        :style="{ background: getBgColor(1) }"
        @click="handleSetLineChartData('messages')"
      >
        <div class="card-content">
          <div class="left-icon">
            <svg-icon icon-class="nested" class-name="card-panel-icon" />
          </div>
          <div class="right-number">
            <count-to :start-val="0" :end-val="layerCount" :duration="3000" />
          </div>
        </div>
        <div class="card-title">楼层数</div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" class="card-panel-col">
      <div
        class="group-item-wrapper"
        :style="{ background: getBgColor(2) }"
        @click="handleSetLineChartData('purchases')"
      >
        <div class="card-content">
          <div class="left-icon">
            <svg-icon icon-class="component" class-name="card-panel-icon" />
          </div>
          <div class="right-number">
            <count-to :start-val="0" :end-val="roomCount" :duration="3200" />
          </div>
        </div>
        <div class="card-title">房间数</div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" class="card-panel-col">
      <div
        class="group-item-wrapper"
        :style="{ background: getBgColor(3) }"
        @click="handleSetLineChartData('shoppings')"
      >
        <div class="card-content">
          <div class="left-icon">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="right-number">
            <count-to :start-val="0" :end-val="studentCount" :duration="3600" />
          </div>
        </div>
        <div class="card-title">学生数</div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { getBuildingInfo } from '@/api/building'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      buildingName: 'NAN',
      layerCount: 0,
      roomCount: 0,
      studentCount: 0
    }
  },
  props: {
    buildingId: {
      type: Number,
      required: true
    }
  },
  methods: {
    getBgColor(index) {
      const colors = [
        'linear-gradient(135deg, #A8E6CF 0%, #88D4AB 100%)',
        'linear-gradient(135deg, #FFD3B5 0%, #FFB088 100%)',
        'linear-gradient(135deg, #B8E0F7 0%, #8FC5E8 100%)',
        'linear-gradient(135deg, #E8C4F4 0%, #D4A5E8 100%)'
      ]
      return colors[index]
    },
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  },
  watch: {
    buildingId: {
      immediate: true,
      handler(val) {
        if (!val || val === 0) return
        getBuildingInfo(val).then(res => {
          this.buildingName = res.data.name
          this.layerCount = res.data.floorCount
          this.roomCount = res.data.roomCount
          this.studentCount = res.data.studentCount
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-bottom: 24px;

  .group-item-wrapper {
    height: 160px;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
    }

    .card-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 90px;

      .left-icon {
        .card-panel-icon {
          font-size: 56px;
          opacity: 0.85;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }
      }

      .right-number {
        font-size: 42px;
        font-weight: 700;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }

    .card-title {
      font-size: 15px;
      margin-top: 16px;
      opacity: 0.9;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
  }
}
</style>
