import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { createDemoData } from '../utils/demoData'
import { clearSpendWiseData, DEFAULT_CATEGORIES, DEFAULT_PREFERENCES, DEFAULT_SETTINGS, hasStoredData, loadData, saveAll, saveSlice } from '../services/storageService'

const ExpenseContext = createContext(null)

const makeId = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const emptyData = () => ({ transactions: [], budgets: [], categories: DEFAULT_CATEGORIES, preferences: { ...DEFAULT_PREFERENCES, demoData: false }, settings: DEFAULT_SETTINGS })

export function ExpenseProvider({ children }) {
  const [state, setState] = useState(() => {
    if (hasStoredData()) return loadData()
    const demo = createDemoData()
    return { ...emptyData(), ...demo, preferences: { ...DEFAULT_PREFERENCES, ...demo.preferences, demoData: true } }
  })

  useEffect(() => {
    saveAll(state)
  }, [state])

  const update = useCallback((key, value) => setState(previous => ({ ...previous, [key]: value })), [])

  const addTransaction = useCallback(transaction => {
    const item = { ...transaction, id: makeId('txn'), amount: Number(transaction.amount), createdAt: new Date().toISOString() }
    setState(previous => ({ ...previous, transactions: [item, ...previous.transactions], preferences: { ...previous.preferences, demoData: false } }))
    return item
  }, [])

  const updateTransaction = useCallback((id, changes) => {
    setState(previous => ({ ...previous, transactions: previous.transactions.map(item => item.id === id ? { ...item, ...changes, amount: Number(changes.amount) } : item), preferences: { ...previous.preferences, demoData: false } }))
  }, [])

  const deleteTransaction = useCallback(id => {
    setState(previous => ({ ...previous, transactions: previous.transactions.filter(item => item.id !== id), preferences: { ...previous.preferences, demoData: false } }))
  }, [])

  const addBudget = useCallback(budget => {
    const item = { ...budget, id: makeId('budget'), amount: Number(budget.amount) }
    setState(previous => ({ ...previous, budgets: [...previous.budgets, item] }))
    return item
  }, [])

  const updateBudget = useCallback((id, changes) => setState(previous => ({ ...previous, budgets: previous.budgets.map(item => item.id === id ? { ...item, ...changes, amount: Number(changes.amount) } : item) })), [])
  const deleteBudget = useCallback(id => setState(previous => ({ ...previous, budgets: previous.budgets.filter(item => item.id !== id) })), [])

  const addCategory = useCallback(category => {
    const item = { ...category, id: makeId('category'), custom: true }
    setState(previous => ({ ...previous, categories: [...previous.categories, item] }))
    return item
  }, [])
  const updateCategory = useCallback((id, changes) => setState(previous => ({ ...previous, categories: previous.categories.map(item => item.id === id ? { ...item, ...changes } : item) })), [])
  const deleteCategory = useCallback(id => setState(previous => ({ ...previous, categories: previous.categories.filter(item => item.id !== id) })), [])

  const setPreference = useCallback((key, value) => setState(previous => ({ ...previous, preferences: { ...previous.preferences, [key]: value } })), [])
  const setSetting = useCallback((key, value) => setState(previous => ({ ...previous, settings: { ...previous.settings, [key]: value } })), [])

  const loadDemo = useCallback(() => {
    const demo = createDemoData()
    setState(previous => ({ ...previous, ...demo, preferences: { ...previous.preferences, ...demo.preferences, demoData: true } }))
  }, [])

  const clearSample = useCallback(() => setState(previous => ({ ...previous, transactions: [], budgets: [], preferences: { ...previous.preferences, demoData: false } })), [])

  const reset = useCallback(() => {
    clearSpendWiseData()
    setState(emptyData())
  }, [])

  const importData = useCallback(payload => {
    if (!payload || payload.app !== 'SpendWise' || !Array.isArray(payload.transactions) || !Array.isArray(payload.budgets) || !Array.isArray(payload.categories)) throw new Error('This file is not a valid SpendWise backup.')
    if (payload.transactions.some(item => !item.id || !item.description || Number(item.amount) <= 0) || payload.budgets.some(item => !item.id || Number(item.amount) <= 0) || payload.categories.some(item => !item.id || !item.name)) throw new Error('The backup contains invalid records.')
    setState(previous => ({ ...previous, transactions: payload.transactions, budgets: payload.budgets, categories: payload.categories, preferences: { ...previous.preferences, ...(payload.preferences || {}), demoData: false }, settings: { ...previous.settings, ...(payload.settings || {}), lastImportAt: new Date().toISOString() } }))
  }, [])

  const value = useMemo(() => ({ ...state, update, addTransaction, updateTransaction, deleteTransaction, addBudget, updateBudget, deleteBudget, addCategory, updateCategory, deleteCategory, setPreference, setSetting, loadDemo, clearSample, reset, importData }), [state, update, addTransaction, updateTransaction, deleteTransaction, addBudget, updateBudget, deleteBudget, addCategory, updateCategory, deleteCategory, setPreference, setSetting, loadDemo, clearSample, reset, importData])
  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
}

export const useExpense = () => {
  const context = useContext(ExpenseContext)
  if (!context) throw new Error('useExpense must be used inside ExpenseProvider')
  return context
}
