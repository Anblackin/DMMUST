const { Op } = require("sequelize")
const { User, Room, Floor, Building, Major, Faculty } = require("../model")
const { questionnaireSimilarity } = require("./room_auto_assign_service")

const Q_FIELDS = [
  "sleep_habit",
  "clean_level",
  "study_habit",
  "noise_tolerance",
  "social_preference",
  "wake_up_time",
  "sleep_time",
  "hobbies"
]

const MAX_PAIR_QUESTIONNAIRE = 8 + 1

function toPlainForSimilarity(u) {
  const o = {}
  for (const k of Q_FIELDS) {
    o[k] = u[k]
  }
  return o
}

function homogeneityRatio(students, key) {
  if (!students.length) return 0
  const counts = {}
  let withVal = 0
  for (const s of students) {
    const v = s[key]
    if (v == null) continue
    withVal++
    const id = String(v)
    counts[id] = (counts[id] || 0) + 1
  }
  if (withVal === 0) return 0.5
  const maxSame = Math.max(...Object.values(counts))
  return maxSame / students.length
}

function scoreRoom(studentsPlain) {
  const n = studentsPlain.length
  if (n < 2) {
    return {
      totalScore: null,
      questionnairePct: null,
      majorPct: null,
      facultyPct: null,
      pairCount: 0,
      note: n === 1 ? "仅一名学生，无舍友可比" : "无学生"
    }
  }
  let qSum = 0
  let pairs = 0
  for (let i = 0; i < n; i++) {
    const a = toPlainForSimilarity(studentsPlain[i])
    for (let j = i + 1; j < n; j++) {
      const b = toPlainForSimilarity(studentsPlain[j])
      qSum += questionnaireSimilarity(a, b)
      pairs++
    }
  }
  const qNorm = pairs ? qSum / (pairs * MAX_PAIR_QUESTIONNAIRE) : 0
  const majorH = homogeneityRatio(studentsPlain, "majorId")
  const facultyH = homogeneityRatio(studentsPlain, "facultyId")
  const total = Math.round(100 * (0.45 * qNorm + 0.35 * majorH + 0.2 * facultyH))
  return {
    totalScore: total,
    questionnairePct: Math.round(100 * qNorm),
    majorPct: Math.round(100 * majorH),
    facultyPct: Math.round(100 * facultyH),
    pairCount: pairs,
    note: ""
  }
}

/**
 * @param {{ buildingId?: string|number }} options
 */
async function getRoomCompatibilityReport(options = {}) {
  const buildingIdRaw = options.buildingId
  const buildingId =
    buildingIdRaw !== undefined && buildingIdRaw !== null && String(buildingIdRaw).trim() !== ""
      ? parseInt(String(buildingIdRaw), 10)
      : null

  const roomInclude = {
    model: Room,
    required: true,
    attributes: ["id", "number", "buildingId", "peopleNum"],
    include: [
      {
        model: Floor,
        attributes: ["id", "layer"],
        required: true,
        include: [{ model: Building, attributes: ["id", "name"], required: true }]
      }
    ]
  }
  if (buildingId != null && !Number.isNaN(buildingId)) {
    roomInclude.where = { buildingId }
  }

  const students = await User.findAll({
    where: {
      role: "student",
      roomId: { [Op.ne]: null }
    },
    attributes: [
      "id",
      "account",
      "name",
      "sex",
      "roomId",
      "majorId",
      "facultyId",
      ...Q_FIELDS
    ],
    include: [
      roomInclude,
      { model: Major, attributes: ["id", "name"], required: false },
      { model: Faculty, attributes: ["id", "name"], required: false }
    ]
  })

  const byRoom = new Map()
  for (const u of students) {
    const rid = u.roomId
    if (!byRoom.has(rid)) byRoom.set(rid, [])
    byRoom.get(rid).push(u)
  }

  const rows = []
  for (const [roomId, list] of byRoom.entries()) {
    const room = list[0].room
    if (!room) continue
    const building = room.floor && room.floor.building
    const floorLayer = room.floor ? room.floor.layer : null
    const plainList = list.map(u => u.toJSON())
    const scores = scoreRoom(plainList)
    const members = plainList.map(p => ({
      id: p.id,
      account: p.account,
      name: p.name,
      sex: p.sex,
      majorName: p.major ? p.major.name : "",
      facultyName: p.faculty ? p.faculty.name : ""
    }))
    rows.push({
      roomId,
      roomNumber: room.number,
      peopleNum: room.peopleNum,
      buildingId: building ? building.id : room.buildingId,
      buildingName: building ? building.name : "",
      floorLayer,
      studentCount: list.length,
      ...scores,
      members
    })
  }

  rows.sort((a, b) => {
    if (a.buildingName !== b.buildingName) return String(a.buildingName).localeCompare(String(b.buildingName))
    if (a.floorLayer !== b.floorLayer) return (a.floorLayer || 0) - (b.floorLayer || 0)
    return (a.roomNumber || 0) - (b.roomNumber || 0)
  })

  return { rooms: rows, totalRooms: rows.length }
}

module.exports = {
  getRoomCompatibilityReport
}
