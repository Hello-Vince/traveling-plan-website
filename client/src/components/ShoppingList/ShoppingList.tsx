import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../contexts/SettingsContext';
import type { ShoppingItem } from '../../types';
import styles from './ShoppingList.module.css';

const API = '/api/shopping';

const emptyItem = (): Omit<ShoppingItem, '_id'> => ({
  name: { en: '', zhHK: '' },
  image: '🛒',
  tags: [],
  checked: false,
  quantity: 1,
});

export default function ShoppingList() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [editing, setEditing] = useState<(Partial<ShoppingItem> & Omit<ShoppingItem, '_id'>) | null>(null);
  const [isNew, setIsNew] = useState(false);
  const lang = settings.language as 'en' | 'zhHK';

  useEffect(() => {
    fetch(API).then((r) => r.json()).then(setItems).catch(console.error);
  }, []);

  const toggleCheck = async (item: ShoppingItem) => {
    try {
      const res = await fetch(`${API}/${item._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checked: !item.checked }),
      });
      const updated = await res.json();
      setItems((prev) => prev.map((i) => (i._id === updated._id ? updated : i)));
    } catch (err) {
      console.error(err);
    }
  };

  const updateQty = async (item: ShoppingItem, delta: number) => {
    const newQty = Math.max(1, item.quantity + delta);
    try {
      const res = await fetch(`${API}/${item._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty }),
      });
      const updated = await res.json();
      setItems((prev) => prev.map((i) => (i._id === updated._id ? updated : i)));
    } catch (err) {
      console.error(err);
    }
  };

  const openNew = () => {
    setEditing(emptyItem());
    setIsNew(true);
  };

  const openEdit = (item: ShoppingItem) => {
    setEditing({ ...item });
    setIsNew(false);
  };

  const close = () => {
    setEditing(null);
    setIsNew(false);
  };

  const save = async () => {
    if (!editing) return;
    try {
      if (isNew) {
        const res = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editing),
        });
        const created = await res.json();
        setItems((prev) => [...prev, created]);
      } else {
        const { _id, ...body } = editing as ShoppingItem;
        const res = await fetch(`${API}/${_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const updated = await res.json();
        setItems((prev) => prev.map((i) => (i._id === updated._id ? updated : i)));
      }
      close();
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (id: string) => {
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((i) => i._id !== id));
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('shopping.title')}</h2>
        <p className={styles.subtitle}>{t('shopping.subtitle')}</p>
      </div>

      <button className={styles.addBtn} onClick={openNew}>
        + {t('shopping.addItem')}
      </button>

      {editing && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>
              {isNew ? t('shopping.addItem') : t('shopping.editItem')}
            </h3>
            <div className={styles.formGrid}>
              <label className={styles.formLabel}>
                {t('shopping.emoji')}
                <input className={styles.formInput} value={editing.image}
                  onChange={(e) => updateField('image', e.target.value)} />
              </label>
              <label className={styles.formLabel}>
                {t('shopping.name')} (EN)
                <input className={styles.formInput} value={editing.name.en}
                  onChange={(e) => updateField('name.en', e.target.value)} />
              </label>
              <label className={styles.formLabel}>
                {t('shopping.name')} (粵)
                <input className={styles.formInput} value={editing.name.zhHK}
                  onChange={(e) => updateField('name.zhHK', e.target.value)} />
              </label>
              <label className={styles.formLabel}>
                {t('shopping.qty')}
                <input className={styles.formInput} type="number" min="1"
                  value={editing.quantity}
                  onChange={(e) => updateField('quantity', parseInt(e.target.value) || 1)} />
              </label>
            </div>
            <div className={styles.modalActions}>
              {!isNew && (
                <button className={styles.deleteBtn} onClick={() => remove((editing as ShoppingItem)._id)}>
                  {t('shopping.delete')}
                </button>
              )}
              <button className={styles.cancelBtn} onClick={close}>{t('shopping.cancel')}</button>
              <button className={styles.saveBtn} onClick={save}>{t('shopping.save')}</button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.list}>
        {items.map((item) => (
          <div key={item._id} className={`${styles.item} ${item.checked ? styles.checked : ''}`}>
            <button
              className={`${styles.checkbox} ${item.checked ? styles.checked : ''}`}
              onClick={() => toggleCheck(item)}
            >
              {item.checked ? '✓' : ''}
            </button>
            <span className={styles.itemImage}>{item.image}</span>
            <div className={styles.itemInfo} onClick={() => openEdit(item)}>
              <p className={styles.itemName}>{item.name[lang]}</p>
              <div className={styles.tags}>
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={styles.tag}
                    style={{ background: tag.color }}
                  >
                    {tag.label[lang]}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.quantity}>
              <button className={styles.qtyBtn} onClick={() => updateQty(item, -1)}>−</button>
              <span className={styles.qtyNum}>{item.quantity}</span>
              <button className={styles.qtyBtn} onClick={() => updateQty(item, 1)}>+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
