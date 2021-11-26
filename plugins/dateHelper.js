/**
 * valid Date？
 * @param {Date} date - date object
 * @returns {boolean} - true or false
 */
const isValidDate = (date) => {
  return date instanceof Date && !Number.isNaN(date.valueOf())
}
/**
 * format date
 * @param {Date} date - date object
 * @returns {string} - date in string format, ex: Jan 01, 2021
 */
const formatDate = (date) => {
  if (!isValidDate(date)) return ''

  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
}
/**
 * format date and time
 * @param {Date} date - date object
 * @returns {string} - date in string format, ex: Jan 01, 2021, 1:30:45 PM
 */
const formatDateTime = (date) => {
  if (!isValidDate(date)) return ''

  const dateString = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
  const timeString = date.toLocaleTimeString('en-US')
  return `${dateString}, ${timeString}`
}
/**
 * format time ago
 * @param {Date} date - date object
 * @returns {string} - date in string format, ex: just now, 59 minutes ago, 23 hours ago, 30 days ago, 11 months ago, 10 years ago
 */
const formatTimeAgo = (date) => {
  if (!isValidDate(date)) return ''

  const currentDate = new Date()
  const diffMinutes = (currentDate.getTime() - date.getTime()) / (1000 * 60)
  const diffHours = diffMinutes / 60
  const diffDays = diffHours / 24
  const diffMonths = diffDays / 30
  const diffYears = diffMonths / 30

  if (diffMinutes < 1) return 'just now'
  else if (diffHours < 1) {
    if (diffMinutes < 2) return `${Math.floor(diffMinutes)} minute ago`
    return `${Math.floor(diffMinutes)} minutes ago`
  } else if (diffDays < 1) {
    if (diffHours < 2) return `${Math.floor(diffHours)} hour ago`
    return `${Math.floor(diffHours)} hours ago`
  } else if (diffMonths < 1) {
    if (diffDays < 2) return `${Math.floor(diffDays)} day ago`
    return `${Math.floor(diffDays)} days ago`
  } else if (diffYears < 1) {
    if (diffMonths < 2) return `${Math.floor(diffMonths)} month ago`
    return `${Math.floor(diffMonths)} months ago`
  } else {
    if (diffYears < 2) return `${Math.floor(diffYears)} year ago`
    return `${Math.floor(diffYears)} years ago`
  }
}

export default ({ store }, inject) => {
  inject('formatDate', formatDate)
  inject('formatDateTime', formatDateTime)
  inject('formatTimeAgo', formatTimeAgo)
}
