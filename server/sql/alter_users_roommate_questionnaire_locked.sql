-- 舍友问卷一次性提交：锁定后忽略问卷字段的后续修改（users 表）

ALTER TABLE `users`
  ADD COLUMN `roommate_questionnaire_locked` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '舍友问卷是否已锁定（1=不可再改）' AFTER `hobbies`;
