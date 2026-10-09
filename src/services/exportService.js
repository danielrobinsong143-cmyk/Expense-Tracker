const download = (content, filename, type) => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

const escapeCsv = value => {
  const text = String(value ?? '')
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export const exportTransactionsCsv = (transactions, categories, currency = 'INR', filename = 'spendwise-transactions.csv') => {
  const categoryMap = Object.fromEntries(categories.map(category => [category.id, category.name]))
  const headers = ['Description', 'Type', 'Amount', 'Category', 'Date', 'Payment method', 'Notes']
  const rows = transactions.map(item => [item.description, item.type, `${currency} ${item.amount.toFixed(2)}`, categoryMap[item.categoryId] || 'Unknown', item.date, item.paymentMethod, item.notes])
  download([headers, ...rows].map(row => row.map(escapeCsv).join(',')).join('\n'), filename, 'text/csv;charset=utf-8')
}

export const exportBackupJson = data => {
  download(JSON.stringify({ app: 'SpendWise', version: 1, exportedAt: new Date().toISOString(), ...data }, null, 2), `spendwise-backup-${new Date().toISOString().slice(0, 10)}.json`, 'application/json')
}
