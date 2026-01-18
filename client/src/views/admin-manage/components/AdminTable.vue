<template>
  <div class="AdminTable">
    <el-table :data="tableData" style="width: 100%" :row-style="getRowStyle">
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="account" label="工号"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column label="身份">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.role === 'superAdmin' ? 'warning' : 'primary'"
            effect="plain"
            size="medium"
          >
            {{ scope.row.role === 'superAdmin' ? '超级管理员' : '管理员' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="管理宿舍楼">
        <template slot-scope="scope">
          <div class="room-wrap" v-if="scope.row.role === 'admin'">
            <el-tag
              v-for="building in scope.row.buildings"
              :key="building.id"
              type="success"
              effect="plain"
              size="small"
              style="margin-right: 5px; margin-bottom: 5px;"
            >
              {{ building.name }}
            </el-tag>
          </div>
          <div class="all-room" v-else>
            <el-tag type="info" effect="plain" size="small">所有宿舍</el-tag>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'AdminTable',
  data() {
    return {}
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    getRowStyle() {
      return {
        fontSize: '14px'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.AdminTable {
  ::v-deep .el-table {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    .el-table__header-wrapper {
      th {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        color: #333;
        font-weight: 600;
      }
    }

    .el-table__body-wrapper {
      tr {
        transition: all 0.3s ease;

        &:hover {
          background-color: #f5f7fa !important;
        }
      }
    }
  }
}

.room-wrap {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -5px;
}

.all-room {
  .el-tag {
    background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
    border-color: #ced4da;
  }
}
</style>
