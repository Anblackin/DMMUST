<template>
  <div id="student-info">
    <h1 class="main-title">宿舍概览</h1>
    <div class="wrapper">
      <PanelGroup></PanelGroup>
    </div>
    <h1 class="main-title">当前入住</h1>
    <div class="wrapper">
      <StudentList :studentsData="studentsData"></StudentList>
    </div>
    <h1 class="main-title">宿舍评价</h1>
    <div class="wrapper">
      <Evaluates :evaluatesData="evaluatesData"></Evaluates>
    </div>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import StudentList from './components/StudentList'
import Evaluates from './components/Evaluates'
import { getStudents } from '@/api/user'
import { getEvaluates } from '@/api/evaluate'
export default {
  name: 'Info',
  components: {
    PanelGroup,
    StudentList,
    Evaluates
  },
  data() {
    return {
      studentsData: [],
      evaluatesData: []
    }
  },
  computed: {
    name() {
      return this.$store.getters.name
    }
  },
  mounted() {
    getStudents({ roomId: this.$store.getters.room.id }).then(res => {
      this.studentsData = res.data.users
    })
    getEvaluates({ roomId: this.$store.getters.room.id }).then(res => {
      this.evaluatesData = res.data.evaluates
    })
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  margin: 30px 0;
}

.main-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 40px 0 24px;
  padding-bottom: 12px;
  border-bottom: 3px solid linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
}
</style>
