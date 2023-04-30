/**
 * @param {Date} date
 */
export function formatDate(date) {
  return `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}