import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../contexts/SettingsContext';
import type { Expense } from '../../types';
import styles from './Ledger.module.css';

const API = '/api/expenses';

type ExpenseCategory = Expense['category'];

const categoryEmoji: Record<ExpenseCategory, string> = {
  food: '🍽️',
  transport: '🚌',
  accommodation: '🏨',
  shopping: '🛍️',
  other: '📦',
};

const categoryColors: Record<ExpenseCategory, string> = {
  food: '#FFECD2',
  transport: '#D1ECF1',
  accommodation: '#E2D4F0',
  shopping: '#F8D7DA',
  other: '#FFF3CD',
};

type ExpenseErrors = {
  description?: { en?: string; zhHK?: string };
  amount?: string;
  date?: string;
};

const validateExpense = (expense: Omit<Expense, '_id'>): ExpenseErrors => {
  const errors: ExpenseErrors = {};
  if (!expense.description.en?.trim()) {
    errors.description = { en: 'Description is required' };
  }
  if (expense.amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }
  if (!expense.date) {
    errors.date = 'Date is required';
  }
  return errors;
};

const emptyExpense = (): Omit<Expense, '_id'> => ({
  description: { en: '', zhHK: '' },
  amount: 0,
  category: 'other',
  date: new Date().toISOString().split('T')[0],
});

export default function Ledger() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editing, setEditing] = useState<(Partial<Expense> & Omit<Expense, '_id'>) | null>(null);
  const [errors, setErrors] = useState<ExpenseErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isNew, setIsNew] = useState(false);
  const lang = settings.language as 'en' | 'zhHK';

  useEffect(() => {
    fetch(API).then((r) => r.json()).then(setExpenses).catch(console.error);
  }, []);

  const total = useMemo(() =>
    expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const openNew = () => {
    setEditing(emptyExpense());
    setIsNew(true);
  };

  const openEdit = (expense: Expense) => {
    setEditing({ ...expense });
    setIsNew(false);
  };

  const close = () => {
    setEditing(null);
    setIsNew(false);
  };

  const save = async () => {
    if (!editing) return;
    const validationErrors = validateExpense(editing);
    setErrors(validationErrors);
    setTouched({ description_en: true, amount: true, date: true });
    if (Object.keys(validationErrors).length > 0) return;

    try {
      if (isNew) {
        const res = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editing),
        });
        if (!res.ok) {
          const errorText = await res.text();
          alert(`Failed to save: ${errorText || res.statusText}`);
          return;
        }
        const created = await res.json();
        setExpenses((prev) => [...prev, created]);
      } else {
        const { _id, ...body } = editing as Expense;
        const res = await fetch(`${API}/${_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const errorText = await res.text();
          alert(`Failed to save: ${errorText || res.statusText}`);
          return;
        }
        const updated = await res.json();
        setExpenses((prev) => prev.map((e) => (e._id === updated._id ? updated : e)));
      }
      close();
    } catch (err) {
      console.error('Save failed:', err);
      alert(`Failed to save: ${err instanceof Error ? err.message : 'Network error'}`);
    }
  };

  const remove = async (id: string) => {
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' });
      setExpenses((prev) => prev.filter((e) => e._id !== id));
      close();
    } catch (err) {
      console.error(err);
    }
  };

  const updateField = (path: string, value: string | number) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj: Record<string, unknown> = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]] as Record<string, unknown>;
      }
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (editing) {
      setErrors(validateExpense(editing));
    }
  };

  const getFieldError = (field: string): string | undefined => {
    if (!touched[field]) return undefined;
    if (field === 'description_en') return errors.description?.en;
    if (field === 'amount') return errors.amount;
    if (field === 'date') return errors.date;
    return undefined;
  };

  const isValid = Object.keys(validateExpense(editing || emptyExpense())).length === 0;

  const categories: ExpenseCategory[] = ['food', 'transport', 'accommodation', 'shopping', 'other'];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('ledger.title')}</h2>
        <p className={styles.subtitle}>{t('ledger.subtitle')}</p>
      </div>

      <div className={styles.totalCard}>
        <span className={styles.totalLabel}>{t('ledger.total')}</span>
        <span className={styles.totalAmount}>${total.toFixed(2)}</span>
      </div>

      <button className={styles.addBtn} onClick={openNew}>
        + {t('ledger.addExpense')}
      </button>

      {editing && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>
              {isNew ? t('ledger.addExpense') : t('ledger.editExpense')}
            </h3>
            <div className={styles.formGrid}>
              <label className={styles.formLabel}>
                {t('ledger.description')} (EN)
                <input className={`${styles.formInput} ${getFieldError('description_en') ? styles.error : ''}`} 
                  value={editing.description.en}
                  onChange={(e) => { updateField('description.en', e.target.value); if (editing) setErrors(validateExpense(editing)); }}
                  onBlur={() => handleBlur('description_en')} />
                {getFieldError('description_en') && <span className={styles.errorMsg}>{getFieldError('description_en')}</span>}
              </label>
              <label className={styles.formLabel}>
                {t('ledger.description')} (粵)
                <input className={styles.formInput} value={editing.description.zhHK}
                  onChange={(e) => updateField('description.zhHK', e.target.value)} />
              </label>
              <label className={styles.formLabel}>
                {t('ledger.amount')}
                <input className={`${styles.formInput} ${getFieldError('amount') ? styles.error : ''}`} type="number" step="0.01" min="0"
                  value={editing.amount}
                  onChange={(e) => { updateField('amount', parseFloat(e.target.value) || 0); if (editing) setErrors(validateExpense(editing)); }}
                  onBlur={() => handleBlur('amount')} />
                {getFieldError('amount') && <span className={styles.errorMsg}>{getFieldError('amount')}</span>}
              </label>
              <label className={styles.formLabel}>
                {t('ledger.category')}
                <select className={styles.formInput} value={editing.category}
                  onChange={(e) => updateField('category', e.target.value)}>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {categoryEmoji[c]} {t(`ledger.categories.${c}`)}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.formLabel}>
                {t('ledger.date')}
                <input className={`${styles.formInput} ${getFieldError('date') ? styles.error : ''}`} type="date" value={editing.date}
                  onChange={(e) => { updateField('date', e.target.value); if (editing) setErrors(validateExpense(editing)); }}
                  onBlur={() => handleBlur('date')} />
                {getFieldError('date') && <span className={styles.errorMsg}>{getFieldError('date')}</span>}
              </label>
            </div>
            <div className={styles.modalActions}>
              {!isNew && (
                <button className={styles.deleteBtn} onClick={() => remove((editing as Expense)._id)}>
                  {t('ledger.delete')}
                </button>
              )}
              <button className={styles.cancelBtn} onClick={close}>{t('ledger.cancel')}</button>
              <button className={styles.saveBtn} onClick={save} disabled={!isValid}>{t('ledger.save')}</button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.list}>
        {expenses.length === 0 && (
          <p className={styles.empty}>{t('ledger.empty')}</p>
        )}
        {expenses.map((expense) => (
          <div key={expense._id} className={styles.expenseItem} onClick={() => openEdit(expense)}>
            <div className={styles.expenseIcon}
              style={{ background: categoryColors[expense.category] }}>
              {categoryEmoji[expense.category]}
            </div>
            <div className={styles.expenseInfo}>
              <p className={styles.expenseName}>{expense.description[lang]}</p>
              <div className={styles.expenseMeta}>
                <span className={styles.expenseCategory}
                  style={{ background: categoryColors[expense.category] }}>
                  {t(`ledger.categories.${expense.category}`)}
                </span>
                <span className={styles.expenseDate}>{expense.date}</span>
              </div>
            </div>
            <span className={styles.expenseAmount}>${expense.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
