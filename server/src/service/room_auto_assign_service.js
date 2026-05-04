const { Op } = require("sequelize")
const db = require("../db/index")
const { User, Room, Faculty, Major } = require("../model")

const QUESTIONNAIRE_KEYS = [
  "sleep_habit",
  "clean_level",
  "study_habit",
  "noise_tolerance",
  "social_preference",
  "wake_up_time",
  "sleep_time"
]

function hobbiesJaccard(ha, hb) {
  const A = new Set(
    String(ha || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
  )
  const B = new Set(
    String(hb || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
  )
  if (A.size === 0 && B.size === 0) return 0
  let inter = 0
  for (const x of A) {
    if (B.has(x)) inter++
  }
  const uni = new Set([...A, ...B]).size
  return uni ? inter / uni : 0
}

/**
 * 问卷相似度：逐字段相同计分 + 兴趣 Jaccard（权重 1）
 */
function questionnaireSimilarity(a, b) {
  let score = 0
  for (const k of QUESTIONNAIRE_KEYS) {
    const va = a[k]
    const vb = b[k]
    if (va != null && vb != null && String(va).trim() !== "" && String(va) === String(vb)) {
      score += 1
    }
  }
  score += hobbiesJaccard(a.hobbies, b.hobbies)
  return score
}

/** 优先选「同专业人数最多」的作为一包种子，便于同专业优先成团 */
function pickSeed(pool) {
  if (!pool.length) return null
  let best = pool[0]
  let bestM = -1
  let bestF = -1
  for (const s of pool) {
    const m = s.majorId == null ? 0 : pool.filter(u => u.majorId === s.majorId).length
    const f = s.facultyId == null ? 0 : pool.filter(u => u.facultyId === s.facultyId).length
    if (m > bestM || (m === bestM && f > bestF) || (m === bestM && f === bestF && s.id < best.id)) {
      bestM = m
      bestF = f
      best = s
    }
  }
  return best
}

/**
 * 同专业优先 → 同学院 → 与 seed 问卷相似度
 */
function pickRoommates(seed, pool, need) {
  if (need <= 0) return []
  const selected = [seed]
  const used = new Set([seed.id])
  const poolEx = pool.filter(u => !used.has(u.id))

  const take = (candidates, predicate) => {
    const arr = candidates
      .filter(u => predicate(u))
      .sort((a, b) => questionnaireSimilarity(seed, b) - questionnaireSimilarity(seed, a))
    for (const u of arr) {
      if (selected.length >= need) return
      if (!used.has(u.id)) {
        selected.push(u)
        used.add(u.id)
      }
    }
  }

  if (seed.majorId != null) {
    take(poolEx, u => u.majorId === seed.majorId)
  }
  if (seed.facultyId != null) {
    take(poolEx, u => u.facultyId === seed.facultyId)
  }
  take(poolEx, () => true)

  return selected.slice(0, need)
}

async function buildRoomStates(buildingIds, peoplePerRoom) {
  if (!buildingIds || !buildingIds.length) return []
  const rooms = await Room.findAll({
    where: {
      buildingId: { [Op.in]: buildingIds },
      status: 1
    },
    order: [
      ["buildingId", "ASC"],
      ["id", "ASC"]
    ]
  })
  const states = []
  for (const room of rooms) {
    const occupied = await User.count({ where: { roomId: room.id } })
    const cap = Math.min(Number(room.peopleNum) || 6, Number(peoplePerRoom) || 4)
    const free = Math.max(0, cap - occupied)
    if (free > 0) {
      states.push({ room, free, cap })
    }
  }
  return states
}

function assignPoolToRooms(students, roomsState, peoplePerRoom) {
  const assignments = []
  let pool = [...students]
  const pp = Math.max(1, Math.min(20, Number(peoplePerRoom) || 4))

  while (pool.length > 0) {
    const roomSlot = roomsState.find(r => r.free > 0)
    if (!roomSlot) break

    const batchSize = Math.min(pp, roomSlot.free, pool.length)
    const seed = pickSeed(pool)
    const batch = pickRoommates(seed, pool, batchSize)

    for (const u of batch) {
      assignments.push({
        userId: u.id,
        roomId: roomSlot.room.id,
        buildingId: roomSlot.room.buildingId,
        account: u.account,
        name: u.name
      })
    }
    roomSlot.free -= batch.length
    const batchIds = new Set(batch.map(b => b.id))
    pool = pool.filter(u => !batchIds.has(u.id))
  }

  return { assignments, unassigned: pool }
}

function normalizeBuildingIds(ids) {
  if (!Array.isArray(ids)) return []
  return [...new Set(ids.map(id => parseInt(String(id), 10)).filter(n => !Number.isNaN(n)))]
}

/**
 * @param {object} options
 * @param {number} options.peoplePerRoom 每间人数上限（与房间 peopleNum 取小）
 * @param {number[]} options.maleBuildingIds 男生可入住楼
 * @param {number[]} options.femaleBuildingIds 女生可入住楼
 * @param {boolean} [options.dryRun]
 */
async function runAutoAssignRooms(options) {
  const peoplePerRoom = options.peoplePerRoom != null ? Number(options.peoplePerRoom) : 4
  const maleBuildingIds = normalizeBuildingIds(options.maleBuildingIds)
  const femaleBuildingIds = normalizeBuildingIds(options.femaleBuildingIds)
  const dryRun = !!options.dryRun

  if (!maleBuildingIds.length || !femaleBuildingIds.length) {
    const e = new Error("400-请同时指定男生宿舍楼与女生宿舍楼")
    throw e
  }
  const overlap = maleBuildingIds.filter(id => femaleBuildingIds.includes(id))
  if (overlap.length) {
    const e = new Error("400-男生楼与女生楼不可重叠")
    throw e
  }

  const students = await User.findAll({
    where: {
      role: "student",
      roommate_questionnaire_locked: true,
      roomId: null,
      sex: { [Op.in]: [0, 1] }
    },
    include: [
      { model: Faculty, attributes: ["id", "name"], required: false },
      { model: Major, attributes: ["id", "name", "facultyId"], required: false }
    ]
  })

  const plain = students.map(s => {
    const j = s.toJSON()
    j.facultyName = j.faculty ? j.faculty.name : ""
    j.majorName = j.major ? j.major.name : ""
    delete j.faculty
    delete j.major
    delete j.password
    return j
  })

  const maleStudents = plain.filter(s => s.sex === 0)
  const femaleStudents = plain.filter(s => s.sex === 1)

  const maleRooms = await buildRoomStates(maleBuildingIds, peoplePerRoom)
  const femaleRooms = await buildRoomStates(femaleBuildingIds, peoplePerRoom)

  const maleSlots = maleRooms.reduce((a, r) => a + r.free, 0)
  const femaleSlots = femaleRooms.reduce((a, r) => a + r.free, 0)

  const maleResult = assignPoolToRooms(maleStudents, maleRooms, peoplePerRoom)
  const femaleResult = assignPoolToRooms(femaleStudents, femaleRooms, peoplePerRoom)

  const assignments = [...maleResult.assignments, ...femaleResult.assignments]
  const unassigned = [...maleResult.unassigned, ...femaleResult.unassigned].map(u => ({
    id: u.id,
    account: u.account,
    name: u.name,
    sex: u.sex,
    majorId: u.majorId,
    facultyId: u.facultyId,
    reason: "床位不足或无可分配房间"
  }))

  if (!dryRun && assignments.length) {
    await db.sequelize.transaction(async t => {
      const now = new Date()
      for (const row of assignments) {
        await User.update(
          { roomId: row.roomId, checkTime: now },
          { where: { id: row.userId }, transaction: t }
        )
      }
    })
  }

  return {
    dryRun,
    peoplePerRoom: Math.max(1, Math.min(20, peoplePerRoom || 4)),
    eligibleTotal: plain.length,
    assignedCount: assignments.length,
    unassignedCount: unassigned.length,
    maleSlots,
    femaleSlots,
    maleNeed: maleStudents.length,
    femaleNeed: femaleStudents.length,
    assignments,
    unassigned
  }
}

module.exports = {
  runAutoAssignRooms,
  questionnaireSimilarity
}
