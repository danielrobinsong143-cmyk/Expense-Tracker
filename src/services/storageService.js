export const STORAGE_VERSION = 1

export const STORAGE_KEYS = {
  transactions: 'spendwise:transactions',
  budgets: 'spendwise:budgets',
  categories: 'spendwise:categories',
  preferences: 'spendwise:preferences',
  settings: 'spendwise:settings',
  version: 'spendwise:version'
}

export const DEFAULT_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', type: 'expense', color: '#f97316', icon: 'Utensils', custom: false },
  { id: 'transport', name: 'Transportation', type: 'expense', color: '#0ea5e9', icon: 'Car', custom: false },
  { id: 'shopping', name: 'Shopping', type: 'expense', color: '#a855f7', icon: 'ShoppingBag', custom: false },
  { id: 'bills', name: 'Bills & Utilities', type: 'expense', color: '#eab308', icon: 'ReceiptIndianRupee', custom: false },
  { id: 'entertainment', name: 'Entertainment', type: 'expense', color: '#ec4899', icon: 'Sparkles', custom: false },
  { id: 'health', name: 'Health', type: 'expense', color: '#10b981', icon: 'HeartPulse', custom: false },
  { id: 'education', name: 'Education', type: 'expense', color: '#6366f1', icon: 'GraduationCap', custom: false },
  { id: 'travel', name: 'Travel', type: 'expense', color: '#14b8a6', icon: 'Plane', custom: false },
  { id: 'housing', name: 'Housing', type: 'expense', color: '#64748b', icon: 'House', custom: false },
  { id: 'personal', name: 'Personal Care', type: 'expense', color: '#f43f5e', icon: 'Sparkle', custom: false },
  { id: 'other-expense', name: 'Other Expenses', type: 'expense', color: '#94a3b8', icon: 'MoreHorizontal', custom: false },
  { id: 'salary', name: 'Salary', type: 'income', color: '#16a34a', icon: 'BriefcaseBusiness', custom: false },
  { id: 'freelance', name: 'Freelance', type: 'income', color: '#22c55e', icon: 'Laptop', custom: false },
  { id: 'business', name: 'Business', type: 'income', color: '#84cc16', icon: 'Building2', custom: false },
  { id: 'investments', name: 'Investments', type: 'income', color: '#059669', icon: 'ChartNoAxesCombined', custom: false },
  { id: 'gifts', name: 'Gifts', type: 'income', color: '#2dd4bf', icon: 'Gift', custom: false },
  { id: 'other-income', name: 'Other Income', type: 'income', color: '#38bdf8', icon: 'CircleDollarSign', custom: false }
]

export const DEFAULT_PREFERENCES = {
  theme: 'light',
  currency: 'INR',
  dateFormat: 'dd MMM yyyy',
  weekStartsOn: 1,
  dashboardRange: 6,
  demoData: true
}

export const DEFAULT_SETTINGS = {
  lastImportAt: null,
  resetNotice: null
}

const isBrowserStorageAvailable = () => {
  try {
    const probe = '__spendwise_probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

const readJson = (key, fallback) => {
  if (!isBrowserStorageAvailable()) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

const writeJson = (key, value) => {
  if (!isBrowserStorageAvailable()) return false
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

const isObject = value => value && typeof value === 'object' && !Array.isArray(value)

const validTransaction = value => isObject(value) && typeof value.id === 'string' && typeof value.description === 'string' && Number(value.amount) > 0 && ['income', 'expense'].includes(value.type) && typeof value.categoryId === 'string' && typeof value.date === 'string'
const validBudget = value => isObject(value) && typeof value.id === 'string' && typeof value.month === 'string' && Number(value.amount) > 0 && typeof value.categoryId === 'string'
const validCategory = value => isObject(value) && typeof value.id === 'string' && typeof value.name === 'string' && ['income', 'expense'].includes(value.type)

export const hasStoredData = () => {
  if (!isBrowserStorageAvailable()) return false
  return Object.values(STORAGE_KEYS).some(key => window.localStorage.getItem(key) !== null)
}

export const loadData = () => {
  const transactions = readJson(STORAGE_KEYS.transactions, [])
  const budgets = readJson(STORAGE_KEYS.budgets, [])
  const categories = readJson(STORAGE_KEYS.categories, DEFAULT_CATEGORIES)
  const preferences = readJson(STORAGE_KEYS.preferences, DEFAULT_PREFERENCES)
  const settings = readJson(STORAGE_KEYS.settings, DEFAULT_SETTINGS)
  return {
    version: Number(readJson(STORAGE_KEYS.version, STORAGE_VERSION)) || STORAGE_VERSION,
    transactions: Array.isArray(transactions) ? transactions.filter(validTransaction) : [],
    budgets: Array.isArray(budgets) ? budgets.filter(validBudget) : [],
    categories: Array.isArray(categories) && categories.length ? categories.filter(validCategory) : DEFAULT_CATEGORIES,
    preferences: { ...DEFAULT_PREFERENCES, ...(isObject(preferences) ? preferences : {}) },
    settings: { ...DEFAULT_SETTINGS, ...(isObject(settings) ? settings : {}) }
  }
}

export const saveSlice = (name, value) => {
  const key = STORAGE_KEYS[name]
  if (!key) return false
  return writeJson(key, value)
}

export const saveAll = data => {
  saveSlice('transactions', data.transactions)
  saveSlice('budgets', data.budgets)
  saveSlice('categories', data.categories)
  saveSlice('preferences', data.preferences)
  saveSlice('settings', data.settings)
  writeJson(STORAGE_KEYS.version, STORAGE_VERSION)
}

export const clearSpendWiseData = () => {
  if (!isBrowserStorageAvailable()) return
  Object.values(STORAGE_KEYS).forEach(key => window.localStorage.removeItem(key))
}
