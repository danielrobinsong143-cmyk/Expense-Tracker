import { format, subMonths, subDays } from 'date-fns'
import { DEFAULT_CATEGORIES } from '../services/storageService'

const day = (date, amount, description, categoryId, paymentMethod, type = 'expense', notes = '') => ({
  id: `${type}-${date}-${description.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${amount}`,
  description,
  amount,
  type,
  categoryId,
  date: format(date, 'yyyy-MM-dd'),
  paymentMethod,
  notes,
  createdAt: date.toISOString()
})

export const createDemoData = () => {
  const now = new Date()
  const transactions = [
    day(subMonths(now, 2), 82000, 'Monthly salary', 'salary', 'Bank transfer', 'income', 'Sample income'),
    day(subMonths(now, 1), 82000, 'Monthly salary', 'salary', 'Bank transfer', 'income', 'Sample income'),
    day(now, 82000, 'Monthly salary', 'salary', 'Bank transfer', 'income', 'Sample income'),
    day(subMonths(now, 2), 1450, 'Weekly groceries', 'food', 'UPI'),
    day(subMonths(now, 2), 2200, 'Electricity bill', 'bills', 'Bank transfer'),
    day(subMonths(now, 2), 1350, 'Metro pass', 'transport', 'Card'),
    day(subMonths(now, 2), 3999, 'Weekend hotel', 'travel', 'Card'),
    day(subMonths(now, 1), 1980, 'Groceries and produce', 'food', 'UPI'),
    day(subMonths(now, 1), 2200, 'Rent contribution', 'housing', 'Bank transfer'),
    day(subMonths(now, 1), 799, 'Streaming bundle', 'entertainment', 'Card'),
    day(subMonths(now, 1), 1500, 'Pharmacy', 'health', 'UPI'),
    day(subDays(now, 12), 1800, 'Team dinner', 'food', 'Card'),
    day(subDays(now, 8), 2499, 'Running shoes', 'shopping', 'Card'),
    day(subDays(now, 5), 650, 'Cab rides', 'transport', 'UPI'),
    day(subDays(now, 3), 1100, 'Online course', 'education', 'Card'),
    day(subDays(now, 1), 450, 'Coffee catch-up', 'food', 'UPI'),
    day(subDays(now, 18), 12500, 'Freelance project', 'freelance', 'Bank transfer', 'income', 'Sample income')
  ]
  const month = format(now, 'yyyy-MM')
  const budgets = [
    { id: `budget-food-${month}`, categoryId: 'food', month, amount: 9000 },
    { id: `budget-transport-${month}`, categoryId: 'transport', month, amount: 5000 },
    { id: `budget-entertainment-${month}`, categoryId: 'entertainment', month, amount: 3000 },
    { id: `budget-total-${month}`, categoryId: 'total', month, amount: 45000 }
  ]
  return { transactions, budgets, categories: DEFAULT_CATEGORIES, preferences: { demoData: true }, settings: {} }
}
