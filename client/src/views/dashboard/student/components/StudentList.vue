<template>
  <div class="roommate-cards">
    <el-row :gutter="24">
      <el-col
        v-for="(student, index) in studentsData"
        :key="student.id"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
      >
        <div class="roommate-card" :style="{ background: getCardColor(index) }">
          <div class="card-header">
            <div class="avatar">
              <i class="el-icon-user" />
            </div>
            <div class="name">{{ student.name }}</div>
          </div>
          <div class="card-body">
            <div class="info-item">
              <span class="label">📚 学号</span>
              <span class="value">{{ student.account }}</span>
            </div>
            <div class="info-item">
              <span class="label">📞 电话</span>
              <span class="value">{{ student.phone }}</span>
            </div>
            <div class="info-item">
              <span class="label">🏢 楼栋</span>
              <span class="value">{{ student.buildingName }}</span>
            </div>
            <div class="info-item">
              <span class="label">📍 房间</span>
              <span class="value"
                >{{ student.floorLayer }}层{{ student.roomNumber }}</span
              >
            </div>
          </div>
          <div class="card-footer">
            <i class="el-icon-time" />
            <span class="check-time"
              >入住: {{ student.checkTime | formatDate('YYYY-MM-DD') }}</span
            >
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="tips" v-if="studentsData.length === 0">= 暂无室友信息 =</div>
  </div>
</template>

<script>
export default {
  name: 'StudentList',
  data() {
    return {}
  },
  props: {
    studentsData: {
      type: Array,
      require: true
    }
  },
  methods: {
    getCardColor(index) {
      const colors = [
        'linear-gradient(135deg, #FFF9E6 0%, #FFF0C4 100%)',
        'linear-gradient(135deg, #E8F8F5 0%, #C8F0E8 100%)',
        'linear-gradient(135deg, #F0E6FF 0%, #E0D0F8 100%)',
        'linear-gradient(135deg, #FFF0F8 0%, #FFD8E8 100%)'
      ]
      return colors[index % colors.length]
    }
  }
}
</script>

<style lang="scss" scoped>
.roommate-cards {
  .roommate-card {
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;

    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
    }

    .card-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .avatar {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.9),
          rgba(255, 255, 255, 0.7)
        );
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        i {
          font-size: 28px;
          color: #666;
        }
      }

      .name {
        font-size: 20px;
        font-weight: 700;
        color: #333;
      }
    }

    .card-body {
      margin-bottom: 16px;

      .info-item {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);

        &:last-child {
          border-bottom: none;
        }

        .label {
          font-size: 13px;
          color: #999;
          font-weight: 500;
        }

        .value {
          font-size: 14px;
          color: #555;
          font-weight: 600;
        }
      }
    }

    .card-footer {
      display: flex;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid rgba(0, 0, 0, 0.08);

      i {
        font-size: 14px;
        color: #999;
        margin-right: 8px;
      }

      .check-time {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .tips {
    background-color: #fff;
    padding: 40px;
    text-align: center;
    color: #999;
    font-size: 16px;
    border-radius: 8px;
  }
}
</style>
