/**
 * valid Date？
 * @param {Date} date - date object
 * @returns {boolean} - true or false
 */
const isValidDate = (date) => {
  return date instanceof Date && !Number.isNaN(date.valueOf())
}
/**
 * Format Date
 * @param {Date} date - date object
 * @returns {string} - date in string format
 */
const formatDate = (date) => {
  if (!isValidDate(date)) return ''

  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
}

export default ({ store }, inject) => {
  inject('formatDate', formatDate)
}
