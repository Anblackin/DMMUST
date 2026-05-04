-- 舍友匹配问卷字段（本项目中名学生对应 Sequelize User 模型，物理表名为 users）
-- 若你的库中确有独立的 students 表，请将表名由 users 改为 students 后执行。

ALTER TABLE `users`
  ADD COLUMN `sleep_habit` VARCHAR(20) NULL COMMENT '作息习惯 early/normal/late' AFTER `checkTime`,
  ADD COLUMN `clean_level` VARCHAR(20) NULL COMMENT '整洁程度 very_clean/normal/casual' AFTER `sleep_habit`,
  ADD COLUMN `study_habit` VARCHAR(20) NULL COMMENT '学习习惯 library/dorm/both' AFTER `clean_level`,
  ADD COLUMN `noise_tolerance` VARCHAR(20) NULL COMMENT '噪音接受度 high/medium/low' AFTER `study_habit`,
  ADD COLUMN `social_preference` VARCHAR(20) NULL COMMENT '社交偏好 introvert/normal/extrovert' AFTER `noise_tolerance`,
  ADD COLUMN `wake_up_time` VARCHAR(10) NULL COMMENT '起床时间 6-7/7-8/8-9/9+' AFTER `social_preference`,
  ADD COLUMN `sleep_time` VARCHAR(10) NULL COMMENT '睡觉时间 22前/22-23/23-24/24后' AFTER `wake_up_time`,
  ADD COLUMN `hobbies` TEXT NULL COMMENT '兴趣爱好，逗号分隔' AFTER `sleep_time`;
