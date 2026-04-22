export interface AgeResult {
  years: number
  months: number
  days: number
  totalDays: number
  totalWeeks: number
  nextBirthdayDate: string
  daysUntilNextBirthday: number
  isBirthdayToday: boolean
}

export function calculateAge(birthdayStr: string, referenceStr?: string): AgeResult {
  const birthday = new Date(birthdayStr)
  const reference = referenceStr ? new Date(referenceStr) : new Date()
  reference.setHours(0, 0, 0, 0)
  birthday.setHours(0, 0, 0, 0)

  if (isNaN(birthday.getTime())) throw new Error('无效生日')
  if (birthday > reference) throw new Error('生日不能晚于参考日期')

  let years = reference.getFullYear() - birthday.getFullYear()
  let months = reference.getMonth() - birthday.getMonth()
  let days = reference.getDate() - birthday.getDate()

  if (days < 0) {
    months--
    days += new Date(reference.getFullYear(), reference.getMonth(), 0).getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }

  const totalDays = Math.floor((reference.getTime() - birthday.getTime()) / 86_400_000)
  const totalWeeks = Math.floor(totalDays / 7)

  const isBirthdayToday =
    birthday.getMonth() === reference.getMonth() &&
    birthday.getDate() === reference.getDate()

  let nextBirthday = new Date(reference.getFullYear(), birthday.getMonth(), birthday.getDate())
  if (nextBirthday <= reference && !isBirthdayToday) {
    nextBirthday = new Date(reference.getFullYear() + 1, birthday.getMonth(), birthday.getDate())
  }
  const daysUntilNextBirthday = isBirthdayToday
    ? 0
    : Math.round((nextBirthday.getTime() - reference.getTime()) / 86_400_000)

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    nextBirthdayDate: nextBirthday.toISOString().slice(0, 10),
    daysUntilNextBirthday,
    isBirthdayToday,
  }
}

export function today(): string {
  return new Date().toISOString().slice(0, 10)
}
