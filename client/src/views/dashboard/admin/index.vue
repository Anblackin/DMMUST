<template>
  <div class="dashboard-admin-container">
    <!-- 基本信息 -->
    <h1 class="main-title">
      <span style="margin-right: 20px">基本信息</span>
      <el-select v-model="buildingId" placeholder="请选择管理的宿舍">
        <el-option
          v-for="item in manageBuildings"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </h1>
    <div class="wrapper">
      <PanelGroup :building-id="buildingId"></PanelGroup>
    </div>
    <!-- 管理概览 -->

    <h1 class="main-title">记录</h1>
    <!-- 最新学生早起情况 -->
    <div class="wrapper">
      <RecordTable
        type="getup"
        title="作息"
        :table-data="getupTableData"
        :show-pagination="false"
      ></RecordTable>
    </div>
    <div class="wrapper">
      <RecordTable
        type="back"
        title="签到情况"
        :table-data="backTableData"
        :show-pagination="false"
      ></RecordTable>
    </div>
    <div class="wrapper">
      <RecordTable
        type="clean"
        title="清洁记录"
        :table-data="cleanTableData"
        :show-pagination="false"
      ></RecordTable>
    </div>
    <!-- 最新学生早起情况 -->
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import RecordTable from '@/components/RecordTable'
import { getRecordTableData } from '@/api/record'
export default {
  name: 'AdminDashboard',
  components: {
    PanelGroup,
    RecordTable
  },
  data() {
    return {
      buildingId: 0,
      getupTableData: [],
      backTableData: [],
      cleanTableData: []
    }
  },
  computed: {
    manageBuildings() {
      const buildings = this.$store.getters.manageBuildings
      return buildings
    }
  },
  watch: {
    manageBuildings: {
      immediate: true,
      handler(val) {
        if (val && val.length > 0) {
          this.buildingId = val[0].id
        }
      }
    },
    buildingId(val) {
      if (val && val !== 0) {
        this.getGetupTableData(val)
        this.getBackTableData(val)
        this.getCleanTableData(val)
      }
    }
  },
  methods: {
    async getGetupTableData(buildingId) {
      const { rows } = (await getRecordTableData('getup', { buildingId })).data
      this.getupTableData = rows
    },
    async getBackTableData(buildingId) {
      const { rows } = (await getRecordTableData('back', { buildingId })).data
      this.backTableData = rows
    },
    async getCleanTableData(buildingId) {
      const { rows } = (await getRecordTableData('clean', { buildingId })).data
      this.cleanTableData = rows
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-admin-container {
  padding: 50px 60px 0px;

  .main-title {
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin: 40px 0 24px;
    padding-bottom: 12px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 3px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 2px;
    }

    .el-select {
      margin-left: 20px;
    }
  }

  .wrapper {
    border-radius: 16px;
    overflow: hidden;
    margin: 30px 0;
    background: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }
}
</style>
