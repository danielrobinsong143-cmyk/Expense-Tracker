import { addMonths, eachMonthOfInterval, endOfMonth, endOfWeek, endOfYear, format, startOfMonth, startOfWeek, startOfYear, subMonths, subWeeks, subYears } from 'date-fns'

export const sumBy = (items, selector) => items.reduce((sum, item) => sum + Number(selector(item) || 0), 0)
export const expensesOnly = transactions => transactions.filter(item => item.type === 'expense')
export const incomeOnly = transactions => transactions.filter(item => item.type === 'income')
export const totalIncome = transactions => sumBy(incomeOnly(transactions), item => item.amount)
export const totalExpenses = transactions => sumBy(expensesOnly(transactions), item => item.amount)
export const balance = transactions => totalIncome(transactions) - totalExpenses(transactions)
export const savingsRate = transactions => {
  const income = totalIncome(transactions)
  return income ? ((income - totalExpenses(transactions)) / income) * 100 : null
}

export const isInMonth = (dateString, month) => dateString.startsWith(month)

export const monthTotals = (transactions, count = 6, endDate = new Date()) => {
  const end = startOfMonth(endDate)
  const start = subMonths(end, count - 1)
  return eachMonthOfInterval({ start, end }).map(month => {
    const key = format(month, 'yyyy-MM')
    const set = transactions.filter(item => isInMonth(item.date, key))
    return { key, label: format(month, 'MMM'), income: totalIncome(set), expenses: totalExpenses(set), net: balance(set) }
  })
}

export const categoryTotals = (transactions, categories, type = 'expense') => categories.filter(category => category.type === type).map(category => ({ ...category, total: sumBy(transactions.filter(item => item.categoryId === category.id && item.type === type), item => item.amount) })).filter(item => item.total > 0).sort((a, b) => b.total - a.total)

export const budgetProgress = (budget, transactions) => {
  const monthExpenses = expensesOnly(transactions).filter(item => isInMonth(item.date, budget.month))
  const spent = budget.categoryId === 'total' ? totalExpenses(monthExpenses) : sumBy(monthExpenses.filter(item => item.categoryId === budget.categoryId), item => item.amount)
  const percentage = budget.amount ? (spent / budget.amount) * 100 : 0
  return { ...budget, spent, remaining: budget.amount - spent, percentage, state: percentage >= 100 ? 'exceeded' : percentage >= 75 ? 'warning' : 'normal' }
}

export const spendingTrend = (transactions, mode = 'monthly', endDate = new Date(), startDate) => {
  const end = endDate
  const start = startDate || (mode === 'daily' ? new Date(end.getTime() - 13 * 86400000) : mode === 'weekly' ? subWeeks(end, 7) : mode === 'yearly' ? subYears(end, 4) : subMonths(end, 7))
  const buckets = []
  let cursor = mode === 'daily' ? new Date(start.getFullYear(), start.getMonth(), start.getDate()) : mode === 'weekly' ? startOfWeek(start, { weekStartsOn: 1 }) : mode === 'yearly' ? startOfYear(start) : startOfMonth(start)
  const last = mode === 'daily' ? new Date(end.getFullYear(), end.getMonth(), end.getDate()) : mode === 'weekly' ? startOfWeek(end, { weekStartsOn: 1 }) : mode === 'yearly' ? startOfYear(end) : startOfMonth(end)
  while (cursor <= last && buckets.length < 60) {
    const bucketStart = cursor
    const bucketEnd = mode === 'daily' ? cursor : mode === 'weekly' ? endOfWeek(cursor, { weekStartsOn: 1 }) : mode === 'yearly' ? endOfYear(cursor) : endOfMonth(cursor)
    const key = mode === 'daily' ? format(bucketStart, 'yyyy-MM-dd') : mode === 'weekly' ? format(bucketStart, 'yyyy-MM-dd') : mode === 'yearly' ? format(bucketStart, 'yyyy') : format(bucketStart, 'yyyy-MM')
    const items = expensesOnly(transactions).filter(item => item.date >= format(bucketStart, 'yyyy-MM-dd') && item.date <= format(bucketEnd, 'yyyy-MM-dd'))
    buckets.push({ key, label: mode === 'daily' ? format(bucketStart, 'dd MMM') : mode === 'weekly' ? format(bucketStart, 'dd MMM') : mode === 'yearly' ? format(bucketStart, 'yyyy') : format(bucketStart, 'MMM yy'), amount: totalExpenses(items) })
    cursor = mode === 'weekly' ? addMonths(cursor, 0) : cursor
    if (mode === 'daily') cursor = new Date(cursor.getTime() + 86400000)
    else if (mode === 'weekly') cursor = new Date(cursor.getTime() + 7 * 86400000)
    else if (mode === 'yearly') cursor = addMonths(cursor, 12)
    else cursor = addMonths(cursor, 1)
  }
  return buckets
}

export const periodMetrics = (transactions, start, end) => {
  const items = transactions.filter(item => item.date >= format(start, 'yyyy-MM-dd') && item.date <= format(end, 'yyyy-MM-dd'))
  const income = totalIncome(items)
  const expenses = totalExpenses(items)
  const highestExpense = expensesOnly(items).sort((a, b) => b.amount - a.amount)[0] || null
  return { items, income, expenses, net: income - expenses, rate: income ? ((income - expenses) / income) * 100 : null, highestExpense, average: items.length ? sumBy(items, item => item.amount) / items.length : 0 }
}

export const previousPeriod = (start, end) => {
  const length = end.getTime() - start.getTime()
  return { start: new Date(start.getTime() - length - 86400000), end: new Date(start.getTime() - 86400000) }
}
