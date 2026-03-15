<template>
  <div class="room-evaluation">
    <el-row :gutter="24">
      <el-col v-for="evaluate in evaluatesData" :md="8" :key="evaluate.id">
        <div class="evaluate-item" :class="getScoreClass(evaluate.score)">
          <div class="score-header">
            <div class="score-display">
              <span class="score-label">评价</span>
              <span class="score-value">{{ evaluate.score }}</span>
            </div>
            <div
              class="level-badge"
              :style="{ background: getScoreBadgeBg(evaluate.score) }"
            >
              {{ getLevel(evaluate.score) }}
            </div>
          </div>
          <div class="note-content">
            <p>{{ evaluate.note }}</p>
          </div>
          <div class="card-footer">
            <div class="creator-info">
              <span class="creator-name">👤 {{ evaluate.userName }}</span>
            </div>
            <div class="time-info">
              <i class="el-icon-time" />
              <span>{{
                evaluate.createdAt | formatDate('YYYY年MM月DD日 HH:mm')
              }}</span>
              <el-button
                v-if="evaluate.userId === userId"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(evaluate.id)"
                >删除</el-button
              >
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="tips" v-if="evaluatesData.length === 0">= 暂无评价 =</div>
  </div>
</template>

<script>
import { removeEvaluate } from '@/api/evaluate'
export default {
  data() {
    return {}
  },
  props: {
    evaluatesData: {
      type: Array,
      required: true
    }
  },
  computed: {
    userId() {
      return this.$store.getters.allUserInfo.id
    }
  },
  methods: {
    getLevel(score) {
      if (score >= 80) {
        return '优秀'
      } else if (score >= 60) {
        return '良好'
      } else {
        return '需改进'
      }
    },
    getScoreClass(score) {
      if (score >= 80) {
        return 'score-excellent'
      } else if (score >= 60) {
        return 'score-good'
      } else {
        return 'score-poor'
      }
    },
    getScoreBadgeBg(score) {
      if (score >= 80) {
        return 'linear-gradient(135deg, #A8E6CF 0%, #88D4AB 100%)'
      } else if (score >= 60) {
        return 'linear-gradient(135deg, #FFD3B5 0%, #FFB088 100%)'
      } else {
        return 'linear-gradient(135deg, #FFB3B3 0%, #FF9999 100%)'
      }
    },
    handleDelete(evaluateId) {
      this.$confirm('确认要删除该条评论', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeEvaluate(evaluateId).then(() => {
          this.$message.success('删除成功')
          this.$emit('afterDel')
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.room-evaluation {
  .evaluate-item {
    background: #fff;
    border-radius: 16px;
    margin-bottom: 24px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
    }

    &.score-excellent {
      border-left: 4px solid #88d4ab;
    }

    &.score-good {
      border-left: 4px solid #ffb088;
    }

    &.score-poor {
      border-left: 4px solid #ff9999;
    }

    .score-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);

      .score-display {
        display: flex;
        align-items: baseline;
        gap: 8px;

        .score-label {
          font-size: 16px;
          color: #666;
          font-weight: 500;
        }

        .score-value {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      }

      .level-badge {
        padding: 8px 20px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 700;
        color: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }

    .note-content {
      padding: 24px;
      min-height: 100px;

      p {
        font-size: 15px;
        line-height: 1.8;
        color: #555;
        margin: 0;
      }
    }

    .card-footer {
      padding: 16px 24px;
      border-top: 1px solid #f0f0f0;

      .creator-info {
        margin-bottom: 12px;

        .creator-name {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }
      }

      .time-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: #999;

        i {
          margin-right: 6px;
        }

        span {
          flex: 1;
        }

        .el-button {
          color: #999;
          padding: 0;

          &:hover {
            color: #f56c6c;
          }
        }
      }
    }
  }

  .tips {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 60px;
    text-align: center;
    color: #999;
    font-size: 16px;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }
}
</style>
