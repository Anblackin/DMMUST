<template>
  <div id="room-compatibility" class="page-wrapper">
    <h1 class="main-title">宿舍匹配合适度</h1>
    <p class="hint">
      对已分配宿舍且至少有 2
      名在住学生的房间，根据舍友问卷相似度（45%）、专业一致性（35%）、院系一致性（20%）计算
      0～100 的综合得分；得分越低表示越需要关注调配。
    </p>

    <div class="wrapper main-card toolbar">
      <el-select
        v-model="buildingId"
        clearable
        filterable
        placeholder="全部宿舍楼"
        style="width: 280px; margin-right: 12px"
        @change="fetchReport"
        @clear="fetchReport"
      >
        <el-option
          v-for="b in buildings"
          :key="b.id"
          :label="b.name + ' (#' + b.id + ')'"
          :value="b.id"
        />
      </el-select>
      <el-button type="primary" :loading="loading" @click="fetchReport"
        >刷新</el-button
      >
      <router-link class="link-assign" to="/dormitoryAssign/index"
        >前往批量分宿</router-link
      >
    </div>

    <div class="wrapper">
      <el-table
        v-loading="loading"
        :data="rooms"
        border
        stripe
        size="small"
        :default-sort="{ prop: 'totalScore', order: 'ascending' }"
        max-height="640"
      >
        <el-table-column
          prop="buildingName"
          label="宿舍楼"
          min-width="120"
          sortable
        />
        <el-table-column prop="floorLayer" label="楼层" width="80" sortable />
        <el-table-column prop="roomNumber" label="房号" width="90" sortable />
        <el-table-column prop="studentCount" label="人数" width="72" sortable />
        <el-table-column prop="peopleNum" label="容量" width="72" />
        <el-table-column
          label="综合合适度"
          width="120"
          sortable
          :sort-method="sortTotal"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.totalScore != null">{{
              scope.row.totalScore
            }}</span>
            <el-tag v-else size="mini" type="info">{{
              scope.row.note || '—'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="问卷(%)"
          width="96"
          sortable
          :sort-method="sortNullable('questionnairePct')"
        >
          <template slot-scope="scope">
            {{
              scope.row.questionnairePct != null
                ? scope.row.questionnairePct
                : '—'
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="专业(%)"
          width="96"
          sortable
          :sort-method="sortNullable('majorPct')"
        >
          <template slot-scope="scope">
            {{ scope.row.majorPct != null ? scope.row.majorPct : '—' }}
          </template>
        </el-table-column>
        <el-table-column
          label="院系(%)"
          width="96"
          sortable
          :sort-method="sortNullable('facultyPct')"
        >
          <template slot-scope="scope">
            {{ scope.row.facultyPct != null ? scope.row.facultyPct : '—' }}
          </template>
        </el-table-column>
        <el-table-column type="expand" label="成员" width="60">
          <template slot-scope="scope">
            <ul class="member-list">
              <li v-for="m in scope.row.members" :key="m.id">
                {{ m.name }}（{{ m.account }}）·
                {{ m.sex === 0 ? '男' : '女' }} · {{ m.facultyName || '—' }} /
                {{ m.majorName || '—' }}
              </li>
            </ul>
          </template>
        </el-table-column>
      </el-table>
      <p v-if="!loading && !rooms.length" class="empty-tip">
        暂无已入住学生数据，请先完成分宿。
      </p>
    </div>
  </div>
</template>

<script>
import { getBuildings } from '@/api/building'
import { getRoomCompatibilityReport } from '@/api/user'

export default {
  name: 'RoomCompatibility',
  data() {
    return {
      buildings: [],
      buildingId: null,
      rooms: [],
      loading: false
    }
  },
  mounted() {
    getBuildings().then(res => {
      this.buildings = res.data.buildings || []
    })
    this.fetchReport()
  },
  methods: {
    sortNullable(key) {
      return (a, b) => {
        const va = a[key]
        const vb = b[key]
        if (va == null && vb == null) return 0
        if (va == null) return 1
        if (vb == null) return -1
        return va - vb
      }
    },
    sortTotal(a, b) {
      const va = a.totalScore
      const vb = b.totalScore
      if (va == null && vb == null) return 0
      if (va == null) return 1
      if (vb == null) return -1
      return va - vb
    },
    fetchReport() {
      this.loading = true
      const params = {}
      if (this.buildingId != null && this.buildingId !== '') {
        params.buildingId = this.buildingId
      }
      getRoomCompatibilityReport(params)
        .then(res => {
          this.rooms = res.data.rooms || []
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  padding: 0 8px 40px;
}
.main-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 24px 0 12px;
  padding-bottom: 12px;
  border-bottom: 2px solid #667eea;
}
.hint {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
}
.wrapper {
  margin-bottom: 20px;
}
.main-card {
  background: #fff;
  padding: 16px 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}
.toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.link-assign {
  margin-left: auto;
  font-size: 14px;
  color: #667eea;
}
.member-list {
  margin: 0;
  padding-left: 20px;
  line-height: 1.8;
  color: #555;
}
.empty-tip {
  color: #909399;
  text-align: center;
  padding: 24px;
}
</style>
