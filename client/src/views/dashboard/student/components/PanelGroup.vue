<template>
  <div id="student-panel-group">
    <el-row :gutter="24">
      <el-col
        v-for="(item, index) in panelData"
        :key="index"
        :xs="24"
        :sm="12"
        :md="12"
      >
        <div class="group-item-wrapper" :style="{ background: item.bgColor }">
          <div class="card-content">
            <div class="left-icon">
              <i :class="item.icon" />
            </div>
            <div class="right-number">{{ item.content }}</div>
          </div>
          <div class="card-title">{{ item.title }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'StudentPanelGroup',
  data() {
    return {}
  },
  computed: {
    panelData() {
      return [
        {
          icon: 'el-icon-s-home',
          bgColor: 'linear-gradient(135deg, #A8E6CF 0%, #88D4AB 100%)',
          title: '房间号',
          content: this.$store.getters.room.number
        },
        {
          icon: 'el-icon-location',
          bgColor: 'linear-gradient(135deg, #FFD3B5 0%, #FFB088 100%)',
          title: '所在楼层',
          content: this.$store.getters.floor.layer + '层'
        },
        {
          icon: 'el-icon-office-building',
          bgColor: 'linear-gradient(135deg, #B8E0F7 0%, #8FC5E8 100%)',
          title: '宿舍楼',
          content: this.$store.getters.building.name
        },
        {
          icon: 'el-icon-date',
          bgColor: 'linear-gradient(135deg, #E8C4F4 0%, #D4A5E8 100%)',
          title: '入住日期',
          content: this.$moment(
            this.$store.getters.allUserInfo.checkTime
          ).format('YYYY-MM-DD')
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
#student-panel-group {
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
        i {
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
