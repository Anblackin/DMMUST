<template>
  <div class="roommate-questionnaire">
    <h2 class="section-title">舍友匹配问卷</h2>
    <el-alert
      v-if="questionnaireLocked"
      title="问卷已提交，不可修改。"
      type="info"
      :closable="false"
      show-icon
      class="lock-tip"
    />
    <el-form :model="form" label-position="top" class="rq-form">
      <el-form-item label="作息习惯">
        <el-radio-group v-model="form.sleep_habit" :disabled="questionnaireLocked">
          <el-radio label="early">早睡早起</el-radio>
          <el-radio label="normal">正常作息</el-radio>
          <el-radio label="late">晚睡晚起</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="整洁程度">
        <el-radio-group v-model="form.clean_level" :disabled="questionnaireLocked">
          <el-radio label="very_clean">洁癖</el-radio>
          <el-radio label="normal">正常</el-radio>
          <el-radio label="casual">随意</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="学习习惯">
        <el-radio-group v-model="form.study_habit" :disabled="questionnaireLocked">
          <el-radio label="library">喜欢去图书馆</el-radio>
          <el-radio label="dorm">喜欢在宿舍学习</el-radio>
          <el-radio label="both">都可以</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="噪音接受度">
        <el-radio-group v-model="form.noise_tolerance" :disabled="questionnaireLocked">
          <el-radio label="high">可以接受较吵</el-radio>
          <el-radio label="medium">适中</el-radio>
          <el-radio label="low">需要安静</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="社交偏好">
        <el-radio-group v-model="form.social_preference" :disabled="questionnaireLocked">
          <el-radio label="introvert">喜欢安静</el-radio>
          <el-radio label="normal">一般</el-radio>
          <el-radio label="extrovert">喜欢热闹</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="起床时间">
        <el-select
          v-model="form.wake_up_time"
          placeholder="请选择"
          clearable
          style="width: 100%"
          :disabled="questionnaireLocked"
        >
          <el-option label="6-7点" value="6-7" />
          <el-option label="7-8点" value="7-8" />
          <el-option label="8-9点" value="8-9" />
          <el-option label="9点后" value="9+" />
        </el-select>
      </el-form-item>
      <el-form-item label="睡觉时间">
        <el-select
          v-model="form.sleep_time"
          placeholder="请选择"
          clearable
          style="width: 100%"
          :disabled="questionnaireLocked"
        >
          <el-option label="22点前" value="22前" />
          <el-option label="22-23点" value="22-23" />
          <el-option label="23-24点" value="23-24" />
          <el-option label="24点后" value="24后" />
        </el-select>
      </el-form-item>
      <el-form-item label="兴趣爱好">
        <el-checkbox-group v-model="hobbiesList" :disabled="questionnaireLocked">
          <el-checkbox label="运动" />
          <el-checkbox label="游戏" />
          <el-checkbox label="音乐" />
          <el-checkbox label="读书" />
          <el-checkbox label="影视" />
          <el-checkbox label="美食" />
          <el-checkbox label="旅行" />
          <el-checkbox label="摄影" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item v-if="showSubmitButton && !questionnaireLocked">
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          保存问卷
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateUserInfo } from '@/api/user'

const EMPTY_FORM = () => ({
  sleep_habit: '',
  clean_level: '',
  study_habit: '',
  noise_tolerance: '',
  social_preference: '',
  wake_up_time: '',
  sleep_time: '',
  hobbies: ''
})

export default {
  name: 'StudentRoommateInfo',
  props: {
    showSubmitButton: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      form: EMPTY_FORM(),
      hobbiesList: [],
      submitting: false
    }
  },
  computed: {
    ...mapGetters(['allUserInfo']),
    questionnaireLocked() {
      const v = this.allUserInfo && this.allUserInfo.roommate_questionnaire_locked
      return v === true || v === 1 || v === '1'
    }
  },
  watch: {
    hobbiesList(val) {
      if (this.questionnaireLocked) return
      this.form.hobbies = Array.isArray(val) && val.length ? val.join(',') : ''
    },
    allUserInfo: {
      handler(u) {
        if (u && u.id) this.applyStudentFields(u)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    applyStudentFields(user) {
      const f = EMPTY_FORM()
      const keys = Object.keys(f)
      keys.forEach(k => {
        if (user[k] !== undefined && user[k] !== null) {
          f[k] = user[k]
        }
      })
      this.form = f
      this.syncHobbiesFromForm()
    },
    syncHobbiesFromForm() {
      const raw = this.form.hobbies
      this.hobbiesList =
        typeof raw === 'string' && raw.trim()
          ? raw.split(',').map(s => s.trim()).filter(Boolean)
          : []
    },
    /** 供父组件（如新用户引导）在统一提交时合并进 updateUserInfo */
    getPayload() {
      if (this.questionnaireLocked) return {}
      return { ...this.form }
    },
    handleSubmit() {
      if (this.questionnaireLocked) return
      this.submitting = true
      updateUserInfo(this.getPayload())
        .then(() => {
          this.$message.success('已保存')
          return this.$store.dispatch('user/getInfo')
        })
        .catch(() => {
          this.$message.error('保存失败')
        })
        .finally(() => {
          this.submitting = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.roommate-questionnaire {
  margin-top: 8px;
}
.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #667eea;
}
.rq-form {
  max-width: 640px;
}
.lock-tip {
  margin-bottom: 16px;
}
</style>
