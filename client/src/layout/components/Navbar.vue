<template>
  <div class="navbar" :class="headerThemeClass">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img :src="adminAvatar" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>基本情况</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device', 'roles']),
    // 根据用户角色返回不同的头部主题类
    headerThemeClass() {
      if (this.roles && this.roles.includes('student')) {
        return 'theme-user-student'
      }
      return 'theme-user-teacher'
    },
    // 管理员使用固定头像 lisaa.png，学生使用动态头像
    adminAvatar() {
      if (this.roles && this.roles.includes('student')) {
        return this.avatar
      }
      return require('@/assets/lisa.png')
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
// 教师主题色
$teacher-blue: #2f509a;
$teacher-blue-hover: #3b64c1;
// 学生主题色
$student-green: #27975b;
$student-green-hover: #2eb36b;

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: $teacher-blue; // 默认教师蓝色
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  transition: background-color 0.3s;

  // 教师主题
  &.theme-user-teacher {
    background: $teacher-blue;

    .right-menu-item.hover-effect:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  // 学生主题
  &.theme-user-student {
    background: $student-green;

    .right-menu-item.hover-effect:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  .hamburger-container {
    line-height: 50px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    padding-left: 16px;

    &:hover {
      background: rgba(255, 255, 255, 0.1); // 悬停效果
    }
  }

  .breadcrumb-container {
    float: left;
    line-height: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 22px; // 使用学校系统的间距
      height: 100%;
      font-size: 14px;
      color: #fff; // 白色文字
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(255, 255, 255, 0.1); // 悬停效果
        }
      }
    }

    .avatar-container {
      margin-right: 0;
      padding: 0 32px; // 使用学校系统的间距

      .avatar-wrapper {
        display: flex;
        align-items: center;
        height: 50px;

        .user-avatar {
          cursor: pointer;
          width: 32px; // 使用学校系统的尺寸
          height: 32px;
          border-radius: 50%; // 圆形头像
          margin-right: 7px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          color: #fff;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
