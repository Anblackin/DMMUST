<template>
  <div id="dormitory-assign" class="page-wrapper">
    <h1 class="main-title">批量自动分宿</h1>
    <p class="hint">
      仅对「已锁定舍友问卷」且「当前未分宿舍」的学生分宿；按性别分别分配到所选男生楼
      / 女生楼，同一房间内优先同专业、其次同学院，并在组内按问卷相似度搭配。
      <router-link class="hint-link" to="/roomCompatibility/index"
        >查看各宿舍匹配合适度</router-link
      >
    </p>

    <div class="wrapper main-card">
      <el-form ref="form" :model="form" label-width="140px" class="assign-form">
        <el-form-item label="每间人数" required>
          <el-input-number
            v-model="form.peoplePerRoom"
            :min="1"
            :max="20"
            :step="1"
          />
          <span class="form-tip">与房间「最大人数」取较小值作为实际上限</span>
        </el-form-item>
        <el-form-item label="男生宿舍楼" required>
          <el-select
            v-model="form.maleBuildingIds"
            multiple
            filterable
            placeholder="选择可安排男生的楼（可多选）"
            style="width: 100%"
          >
            <el-option
              v-for="b in buildings"
              :key="'m-' + b.id"
              :label="b.name + ' (#' + b.id + ')'"
              :value="b.id"
              :disabled="form.femaleBuildingIds.includes(b.id)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="女生宿舍楼" required>
          <el-select
            v-model="form.femaleBuildingIds"
            multiple
            filterable
            placeholder="选择可安排女生的楼（可多选）"
            style="width: 100%"
          >
            <el-option
              v-for="b in buildings"
              :key="'f-' + b.id"
              :label="b.name + ' (#' + b.id + ')'"
              :value="b.id"
              :disabled="form.maleBuildingIds.includes(b.id)"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="default" :loading="loading" @click="runPreview">
            预览分配
          </el-button>
          <el-button type="primary" :loading="loading" @click="runCommit">
            执行分宿
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="lastResult" class="wrapper">
      <el-card shadow="never" class="result-card">
        <div slot="header" class="result-header">
          <span>结果摘要</span>
          <el-tag v-if="lastResult.dryRun" type="info">仅预览，未写入</el-tag>
          <el-tag v-else type="success">已写入数据库</el-tag>
        </div>
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="符合条件学生">
            {{ lastResult.eligibleTotal }}
          </el-descriptions-item>
          <el-descriptions-item label="本次分配人数">
            {{ lastResult.assignedCount }}
          </el-descriptions-item>
          <el-descriptions-item label="未分配人数">
            {{ lastResult.unassignedCount }}
          </el-descriptions-item>
          <el-descriptions-item label="每间上限">
            {{ lastResult.peoplePerRoom }}
          </el-descriptions-item>
          <el-descriptions-item label="男生空床位（所选楼）">
            {{ lastResult.maleSlots }} / 待分 {{ lastResult.maleNeed }}
          </el-descriptions-item>
          <el-descriptions-item label="女生空床位（所选楼）">
            {{ lastResult.femaleSlots }} / 待分 {{ lastResult.femaleNeed }}
          </el-descriptions-item>
        </el-descriptions>

        <h3 class="sub-title">分配明细（前 200 条）</h3>
        <el-table
          :data="lastResult.assignments.slice(0, 200)"
          size="small"
          border
          max-height="360"
        >
          <el-table-column prop="userId" label="用户ID" width="90" />
          <el-table-column prop="account" label="学号" width="120" />
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="buildingId" label="楼ID" width="80" />
          <el-table-column prop="roomId" label="房间ID" width="90" />
        </el-table>

        <template v-if="lastResult.unassigned && lastResult.unassigned.length">
          <h3 class="sub-title warn">未分配学生</h3>
          <el-table
            :data="lastResult.unassigned"
            size="small"
            border
            max-height="240"
          >
            <el-table-column prop="id" label="用户ID" width="90" />
            <el-table-column prop="account" label="学号" width="120" />
            <el-table-column prop="name" label="姓名" width="100" />
            <el-table-column prop="sex" label="性别" width="70">
              <template slot-scope="scope">
                {{ scope.row.sex === 0 ? '男' : '女' }}
              </template>
            </el-table-column>
            <el-table-column prop="reason" label="原因" min-width="160" />
          </el-table>
        </template>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getBuildings } from '@/api/building'
import { autoAssignRooms } from '@/api/user'

export default {
  name: 'DormitoryAssign',
  data() {
    return {
      buildings: [],
      loading: false,
      form: {
        peoplePerRoom: 4,
        maleBuildingIds: [],
        femaleBuildingIds: []
      },
      lastResult: null
    }
  },
  mounted() {
    this.loadBuildings()
  },
  methods: {
    loadBuildings() {
      getBuildings()
        .then(res => {
          this.buildings = res.data.buildings || []
        })
        .catch(() => {})
    },
    validate() {
      if (
        !this.form.maleBuildingIds.length ||
        !this.form.femaleBuildingIds.length
      ) {
        this.$message.warning('请选择男生楼与女生楼')
        return false
      }
      const overlap = this.form.maleBuildingIds.filter(id =>
        this.form.femaleBuildingIds.includes(id)
      )
      if (overlap.length) {
        this.$message.error('男生楼与女生楼不能重叠')
        return false
      }
      return true
    },
    runPreview() {
      if (!this.validate()) return
      this.loading = true
      autoAssignRooms({
        peoplePerRoom: this.form.peoplePerRoom,
        maleBuildingIds: this.form.maleBuildingIds,
        femaleBuildingIds: this.form.femaleBuildingIds,
        dryRun: true
      })
        .then(res => {
          this.lastResult = res.data
          this.$message.success('预览完成')
        })
        .finally(() => {
          this.loading = false
        })
    },
    runCommit() {
      if (!this.validate()) return
      this.$confirm(
        '将按当前规则为符合条件的学生写入房间，是否继续？',
        '确认执行',
        { type: 'warning' }
      )
        .then(() => {
          this.loading = true
          return autoAssignRooms({
            peoplePerRoom: this.form.peoplePerRoom,
            maleBuildingIds: this.form.maleBuildingIds,
            femaleBuildingIds: this.form.femaleBuildingIds,
            dryRun: false
          })
        })
        .then(res => {
          this.lastResult = res.data
          this.$message.success(
            `已分配 ${res.data.assignedCount} 人，未分配 ${res.data.unassignedCount} 人`
          )
        })
        .catch(() => {})
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
.hint-link {
  margin-left: 10px;
  color: #667eea;
  white-space: nowrap;
}
.wrapper {
  margin-bottom: 24px;
}
.main-card {
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}
.assign-form {
  max-width: 720px;
}
.form-tip {
  margin-left: 12px;
  color: #909399;
  font-size: 13px;
}
.result-card {
  border-radius: 12px;
}
.result-header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.sub-title {
  margin: 20px 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
.sub-title.warn {
  color: #e6a23c;
}
</style>
