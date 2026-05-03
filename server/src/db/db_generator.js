const db = require("./index")
const { FACULTY_MAJOR_DATA } = require("./constance")
const User = require("../model/user_model")
const Token = require("../model/token_model")
const CleanRecord = require("../model/cleanRecord_model")
const BackRecord = require("../model/backRecord_model")
const GetupRecord = require("../model/getupRecord_model")
const Room = require("../model/room_model")
const Floor = require("../model/floor_model")
const Building = require("../model/building_model")
const Cleaner = require("../model/cleaner_model")
const Evaluate = require("../model/evaluate_model")
const Faculty = require("../model/faculty_model")
const Major = require("../model/major_model")
const Visitor = require("../model/visitor_model")

// 创建表关系
User.hasMany(Token)
User.hasMany(CleanRecord)
User.hasMany(BackRecord)
User.hasMany(GetupRecord)
User.hasMany(Evaluate)
User.belongsTo(Room)

Room.hasMany(User)
Room.hasMany(CleanRecord)
Room.hasMany(BackRecord)
Room.hasMany(GetupRecord)
Room.hasMany(Evaluate)
Room.belongsTo(Floor)
Room.belongsTo(Building)

Evaluate.belongsTo(User)
Evaluate.belongsTo(Room)

CleanRecord.belongsTo(User)
CleanRecord.belongsTo(Room)

GetupRecord.belongsTo(User)
GetupRecord.belongsTo(Room)

BackRecord.belongsTo(User)
BackRecord.belongsTo(Room)

Floor.hasMany(Room)
Floor.belongsTo(Building)
Floor.belongsTo(Cleaner)

Cleaner.hasMany(Floor)
Cleaner.belongsTo(Building)

Building.hasMany(Floor)
Building.hasMany(Room)
Building.hasMany(Cleaner)

Building.belongsToMany(User, { as: "Admins", through: "admins" })
User.belongsToMany(Building, { as: "", through: "admins" })

Faculty.hasMany(Major)
User.belongsTo(Faculty)
User.belongsTo(Major)

Visitor.belongsTo(Building)

// 生成默认数据
const { hash } = require("../utils/bcypt")
async function createDefaultData() {
  // 添加院系与专业
  for (const item of FACULTY_MAJOR_DATA) {
    const faculty = await Faculty.create({
      name: item.faculty
    })
    for (const m of item.majors) {
      await Major.create({
        name: m,
        facultyId: faculty.id
      })
    }
  }

  // 创建一个新用户
  const user = await User.create({
    account: "test",
    password: hash("123456"),
    role: "student"
  })

  // 创建一个管理员用户
  const admin = await User.create({
    account: "admin",
    password: hash("123456"),
    role: "admin",
    name: "manager"
  })
  // 创建一个超级管理员用户
  const superAdmin = await User.create({
    account: "superAdmin",
    password: hash("123456"),
    role: "superAdmin",
    name: "superAdmin"
  })

  // 创建宿舍楼（Block 1 建议作男生楼、Block 2 作女生楼，便于批量分宿测试）
  const building = await Building.createBuilding({
    name: "Block 1"
  })
  const building2 = await Building.createBuilding({
    name: "Block 2"
  })
  await Building.addAdmin(building.id, admin.id)
  await Building.addAdmin(building2.id, admin.id)

  await Visitor.create({
    name: "Visitor",
    phone: "66666667",
    idNumber: "1270000000",
    sex: 1,
    buildingId: building.id
  })

  // 创建保洁员
  const cleaner = await Cleaner.createCleaner({
    name: "Cleaner",
    phone: "66666666"
  })
  // 为宿舍楼添加保洁员
  await Building.addCleaner(building.id, cleaner.id)

  const FLOOR_COUNT = 6
  const ROOMS_PER_FLOOR = 10
  const ROOM_PEOPLE_NUM = 4

  for (let i = 0; i < FLOOR_COUNT; i++) {
    const layer = i + 1
    const floor = await Floor.createFloor({
      layer,
      buildingId: null
    })
    await Building.addFloor(building.id, floor)
  }
  for (let i = 0; i < FLOOR_COUNT; i++) {
    const layer = i + 1
    const floor = await Floor.createFloor({
      layer,
      buildingId: null
    })
    await Building.addFloor(building2.id, floor)
  }

  const seedRoomsForBuilding = async buildingId => {
    const list = []
    for (let layer = 1; layer <= FLOOR_COUNT; layer++) {
      const floor = await Floor.findOne({ where: { buildingId, layer } })
      if (!floor) {
        throw new Error(`初始化失败：楼 ${buildingId} 缺少第 ${layer} 层`)
      }
      for (let r = 1; r <= ROOMS_PER_FLOOR; r++) {
        const room = await Room.createRoom({
          number: layer * 100 + r,
          floorId: floor.id,
          buildingId,
          peopleNum: ROOM_PEOPLE_NUM
        })
        list.push(room)
      }
    }
    return list
  }

  const roomsBlock1 = await seedRoomsForBuilding(building.id)
  await seedRoomsForBuilding(building2.id)
  const room = roomsBlock1[0]

  // 创建评价（房间内暂无学生，仅作演示数据）
  await Evaluate.createEvaluate({
    score: 98,
    note: "宿舍不错，干净又卫生",
    userId: admin.id,
    roomId: room.id
  })

  // 测试学生：男生 100 + 女生 100，仅「计算机科学与技术学院」专业；学号 1270000001～1270000200；未分宿舍；问卷已锁定
  const csFaculty = await Faculty.findOne({
    where: { name: "计算机科学与技术学院" }
  })
  if (!csFaculty) {
    throw new Error("初始化失败：未找到计算机科学与技术学院")
  }
  const majorRows = await Major.findAll({
    where: { facultyId: csFaculty.id },
    attributes: ["id", "facultyId"]
  })
  if (!majorRows.length) {
    throw new Error("初始化失败：计算机学院下无专业数据")
  }
  const pwdStudent = hash("123456")
  const sleepHabits = ["early", "normal", "late"]
  const cleanLevels = ["very_clean", "normal", "casual"]
  const studyHabits = ["library", "dorm", "both"]
  const wakeTimes = ["6-7", "7-8", "8-9", "9+"]
  const sleepTimes = ["22前", "22-23", "23-24", "24后"]
  const hobbyTags = ["运动", "游戏", "音乐", "读书", "影视", "美食", "旅行", "摄影"]
  const noiseOpts = ["high", "medium", "low", "medium", "medium"]
  const socialOpts = ["introvert", "normal", "extrovert", "normal", "normal"]

  const buildTestStudent = (index, sex, accountNum) => {
    const mj = majorRows[(index + (sex === 1 ? 17 : 0)) % majorRows.length]
    const h1 = hobbyTags[index % hobbyTags.length]
    const h2 = hobbyTags[(index + 3) % hobbyTags.length]
    return {
      account: String(accountNum),
      password: pwdStudent,
      name: sex === 0 ? `测试男生${index + 1}` : `测试女生${index + 1}`,
      role: "student",
      phone: "66666666",
      sex,
      roomId: null,
      facultyId: mj.facultyId,
      majorId: mj.id,
      sleep_habit: sleepHabits[index % sleepHabits.length],
      clean_level: cleanLevels[index % cleanLevels.length],
      study_habit: studyHabits[index % studyHabits.length],
      noise_tolerance: noiseOpts[index % noiseOpts.length],
      social_preference: socialOpts[index % socialOpts.length],
      wake_up_time: wakeTimes[index % wakeTimes.length],
      sleep_time: sleepTimes[index % sleepTimes.length],
      hobbies: [h1, h2].join(","),
      roommate_questionnaire_locked: true
    }
  }

  const bulkStudents = []
  let acc = 1270000001
  for (let i = 0; i < 100; i++) {
    bulkStudents.push(buildTestStudent(i, 0, acc))
    acc += 1
  }
  for (let i = 0; i < 100; i++) {
    bulkStudents.push(buildTestStudent(i, 1, acc))
    acc += 1
  }
  await User.bulkCreate(bulkStudents)
}

module.exports = async function (force = false) {
  // 同步表数据
  console.log("DataBase Syncing ... ...")
  await db.sequelize.sync({ force })
  console.log("DataBase Sync done")
  if (force) {
    console.log("DataBase Init ... ...");
    await createDefaultData()
  }
}
