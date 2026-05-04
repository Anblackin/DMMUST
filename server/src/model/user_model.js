const db = require("../db/index")
const { DataTypes, Model } = require("sequelize")
const bcypt = require("../utils/bcypt")

class User extends Model {
  static createUser(account, password) {
    const user = User.build({ account, password: bcypt.hash(password) })
    return user.save()
  }
  static findByAccount(account) {
    return User.findOne({ where: { account } })
  }
  static findById(id) {
    return User.findOne({ where: { id } })
  }
}

User.init(
  {
    // User 表的 id 必须创建，否则 account 会被代替为用户 id
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    account: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100]
      }
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "student" // 可能值：student admin superAdmin
    },
    name: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    sex: {
      comment: "性别, 0：男, 1：女",
      type: DataTypes.INTEGER
    },
    roomId: {
      comment: "宿舍房间 id",
      type: DataTypes.INTEGER,
      allowNull: true
    },
    facultyId: {
      comment: "院系 id",
      type: DataTypes.INTEGER,
      allowNull: true
    },
    majorId: {
      comment: "专业 id",
      type: DataTypes.INTEGER,
      allowNull: true
    },
    checkTime: {
      comment: "入住宿舍时间",
      type: DataTypes.DATE
    },
    sleep_habit: {
      comment: "作息习惯 early/normal/late",
      type: DataTypes.STRING(20)
    },
    clean_level: {
      comment: "整洁程度 very_clean/normal/casual",
      type: DataTypes.STRING(20)
    },
    study_habit: {
      comment: "学习习惯 library/dorm/both",
      type: DataTypes.STRING(20)
    },
    noise_tolerance: {
      comment: "噪音接受度 high/medium/low",
      type: DataTypes.STRING(20)
    },
    social_preference: {
      comment: "社交偏好 introvert/normal/extrovert",
      type: DataTypes.STRING(20)
    },
    wake_up_time: {
      comment: "起床时间 6-7/7-8/8-9/9+",
      type: DataTypes.STRING(10)
    },
    sleep_time: {
      comment: "睡觉时间 22前/22-23/23-24/24后",
      type: DataTypes.STRING(10)
    },
    hobbies: {
      comment: "兴趣爱好，逗号分隔",
      type: DataTypes.TEXT
    },
    roommate_questionnaire_locked: {
      comment: "舍友问卷已锁定，不可再修改",
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize: db.sequelize,
    modelName: "user",
    paranoid: true
  }
)

module.exports = User
