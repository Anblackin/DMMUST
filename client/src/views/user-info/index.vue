<template>
  <div id="UserInfo" class="page-wrapper">
    <!-- 选择器 -->
    <h1 class="main-title">选择学生</h1>
    <div class="wrapper">
      <el-tabs type="border-card">
        <el-tab-pane label="级联选择">
          <GroupSelector :selectorData="selectorData" />
          <el-button
            type="primary"
            @click="fetchUserInfo('id', selectorData.userId)"
            >搜索</el-button
          >
        </el-tab-pane>
        <el-tab-pane label="按学号搜索">
          <StudentSearcher v-model="searchContent" />
          <el-button
            type="primary"
            @click="fetchUserInfo('account', searchContent)"
            >搜索</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 选择器 -->

    <h1 class="main-title">详细信息</h1>
    <div class="wrapper userInfo-wrapper" v-if="studentInfo.id">
      <el-row :gutter="20" class="top">
        <el-col :md="12">
          <div class="userInfo-card">
            <div class="title">
              <span>用户信息</span>
              <el-button icon="el-icon-guide" @click="editModalVisible = true">
                调剂宿舍
              </el-button>
            </div>
            <hr />
            <div class="info-item">
              <label>姓名:</label>
              <span>{{ studentInfo.name }}</span>
            </div>
            <div class="info-item">
              <label>学号:</label>
              <span>{{ studentInfo.account }}</span>
            </div>
            <div class="info-item">
              <label>手机号:</label>
              <span>{{ studentInfo.phone }}</span>
            </div>
            <div class="info-item">
              <label>注册日期:</label>
              <span>{{
                $moment(studentInfo.createdAt).format('YYYY-MM-DD')
              }}</span>
            </div>
          </div>
        </el-col>
        <el-col :md="12">
          <div class="roomInfo-card">
            <PanelGroup :userInfo="studentInfo" />
          </div>
        </el-col>
      </el-row>
      <div class="bottom main-card" style="margin-top: 20px">
        <div class="process-item">
          <span>早起概率：</span>
          <el-progress
            :text-inside="true"
            :stroke-width="26"
            :percentage="Number((studentInfo.getupProb * 100).toFixed(2))"
          ></el-progress>
        </div>
        <div class="process-item">
          <span>早归概率：</span>
          <el-progress
            :text-inside="true"
            :stroke-width="26"
            :percentage="Number((studentInfo.backProb * 100).toFixed(2))"
            status="success"
          ></el-progress>
        </div>
        <div class="process-item">
          <span>打扫概率：</span>
          <el-progress
            :text-inside="true"
            :stroke-width="26"
            :percentage="Number((studentInfo.cleanProb * 100).toFixed(2))"
            status="warning"
          ></el-progress>
        </div>
      </div>
    </div>
    <div class="no-data-tips main-card wrapper" v-else>请选择用户</div>

    <!-- 调剂宿舍模态框 -->
    <UserInfoEditModal
      :visible.sync="editModalVisible"
      :userInfo="studentInfo"
      @update-success="() => fetchUserInfo('id', this.studentInfo.id)"
    />
  </div>
</template>

<script>
import GroupSelector from '@/components/GroupSelector'
import StudentSearcher from './components/StudentSearcher'
import PanelGroup from './components/PanelGroup'
import UserInfoEditModal from './components/UserInfoEditModal.vue'

import { getStudentInfoByIdOrAccount } from '@/api/user'
export default {
  name: 'UserInfo',
  components: {
    GroupSelector,
    StudentSearcher,
    PanelGroup,
    UserInfoEditModal
  },
  data() {
    return {
      selectorData: {
        buildingId: null,
        floorId: null,
        roomId: null,
        userId: null
      },
      searchContent: '',
      studentInfo: {},
      editModalVisible: false
    }
  },
  methods: {
    fetchUserInfo(type, value) {
      getStudentInfoByIdOrAccount({ type, value }).then(res => {
        this.studentInfo = res.data
      })
    }
  },
  mounted() {
    if (this.$route.query.userId) {
      this.fetchUserInfo('id', this.$route.query.userId)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  margin: 30px 0;
}

.el-tab-pane {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

:deep(.el-tabs__content) {
  padding: 40px 20px;
  width: 100%;
}

.main-title {
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
}

.userInfo-wrapper {
  .top {
    .roomInfo-card {
      background-color: #fff;
      padding: 24px;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    }

    .userInfo-card {
      background-color: #fff;
      padding: 24px;
      height: 223px;
      box-sizing: content-box;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);

      .title {
        font-weight: bold;
        color: #667eea;
        font-size: 22px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .info-item {
        margin: 20px 0;
      }

      :nth-child(3) {
        margin-top: 40px;
      }
    }
  }

  .bottom {
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);

    .process-item {
      span {
        display: block;
        margin: 10px 0;
        font-weight: 500;
        color: #555;
      }
    }

    :first-child span {
      margin-top: 0px;
    }
  }
}

.no-data-tips {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 60px;
  text-align: center;
  color: #999;
  font-size: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}
</style>
