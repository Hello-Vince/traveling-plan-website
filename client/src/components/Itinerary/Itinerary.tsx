import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../contexts/SettingsContext';
import type { ItineraryDay, ItineraryLocation } from '../../types';
import styles from './Itinerary.module.css';

const API = '/api/itinerary';

const emptyLocation = (): ItineraryLocation => ({
  time: '',
  name: { en: '', zhHK: '' },
  category: 'landmark',
  emoji: '📍',
  notes: { en: '', zhHK: '' },
});

const emptyDay = (nextNum: number): Omit<ItineraryDay, '_id'> => ({
  dayNumber: nextNum,
  date: '',
  title: { en: '', zhHK: '' },
  weather: { icon: '☀️', temp: '', description: { en: '', zhHK: '' } },
  locations: [],
});

export default function Itinerary() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [days, setDays] = useState<ItineraryDay[]>([]);
  const [activeDay, setActiveDay] = useState(1);
  const lang = settings.language as 'en' | 'zhHK';

  const [editingDay, setEditingDay] = useState<(Partial<ItineraryDay> & Omit<ItineraryDay, '_id'>) | null>(null);
  const [isNewDay, setIsNewDay] = useState(false);

  const [editingLoc, setEditingLoc] = useState<ItineraryLocation | null>(null);
  const [editingLocIdx, setEditingLocIdx] = useState<number>(-1);
  const [isNewLoc, setIsNewLoc] = useState(false);

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((data: ItineraryDay[]) => {
        setDays(data);
        if (data.length > 0) setActiveDay(data[0].dayNumber);
      })
      .catch(console.error);
  }, []);

  const countdown = useMemo(() => {
    if (days.length === 0) return null;
    const tripDate = new Date(days[0].date);
    const now = new Date();
    const diff = Math.ceil((tripDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  }, [days]);

  const currentDay = days.find((d) => d.dayNumber === activeDay);

  const openNewDay = () => {
    const nextNum = days.length > 0 ? Math.max(...days.map((d) => d.dayNumber)) + 1 : 1;
    setEditingDay(emptyDay(nextNum));
    setIsNewDay(true);
  };

  const openEditDay = () => {
    if (!currentDay) return;
    setEditingDay({ ...currentDay });
    setIsNewDay(false);
  };

  const closeDay = () => {
    setEditingDay(null);
    setIsNewDay(false);
  };

  const saveDay = async () => {
    if (!editingDay) return;
    try {
      if (isNewDay) {
        const res = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingDay),
        });
        const created = await res.json();
        setDays((prev) => [...prev, created].sort((a, b) => a.dayNumber - b.dayNumber));
        setActiveDay(created.dayNumber);
      } else {
        const { _id, ...body } = editingDay as ItineraryDay;
        const res = await fetch(`${API}/${_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const updated = await res.json();
        setDays((prev) => prev.map((d) => (d._id === updated._id ? updated : d)));
      }
      closeDay();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteDay = async () => {
    if (!currentDay) return;
    try {
      await fetch(`${API}/${currentDay._id}`, { method: 'DELETE' });
      setDays((prev) => {
        const next = prev.filter((d) => d._id !== currentDay._id);
        if (next.length > 0) setActiveDay(next[0].dayNumber);
        return next;
      });
      closeDay();
    } catch (err) {
      console.error(err);
    }
  };

  const openNewLoc = () => {
    setEditingLoc(emptyLocation());
    setEditingLocIdx(-1);
    setIsNewLoc(true);
  };

  const openEditLoc = (loc: ItineraryLocation, idx: number) => {
    setEditingLoc({ ...loc, name: { ...loc.name }, notes: { ...loc.notes } });
    setEditingLocIdx(idx);
    setIsNewLoc(false);
  };

  const closeLoc = () => {
    setEditingLoc(null);
    setEditingLocIdx(-1);
    setIsNewLoc(false);
  };

  const saveLoc = async () => {
    if (!editingLoc || !currentDay) return;
    const updatedLocations = [...currentDay.locations];
    if (isNewLoc) {
      updatedLocations.push(editingLoc);
    } else {
      updatedLocations[editingLocIdx] = editingLoc;
    }
    try {
      const res = await fetch(`${API}/${currentDay._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentDay, locations: updatedLocations }),
      });
      const updated = await res.json();
      setDays((prev) => prev.map((d) => (d._id === updated._id ? updated : d)));
      closeLoc();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteLoc = async () => {
    if (!currentDay || editingLocIdx < 0) return;
    const updatedLocations = currentDay.locations.filter((_, i) => i !== editingLocIdx);
    try {
      const res = await fetch(`${API}/${currentDay._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentDay, locations: updatedLocations }),
      });
      const updated = await res.json();
      setDays((prev) => prev.map((d) => (d._id === updated._id ? updated : d)));
      closeLoc();
    } catch (err) {
      console.error(err);
    }
  };

  const updateLocField = (field: string, value: string) => {
    setEditingLoc((prev) => {
      if (!prev) return prev;
      const copy = { ...prev, name: { ...prev.name }, notes: { ...prev.notes } };
      if (field === 'time') copy.time = value;
      else if (field === 'emoji') copy.emoji = value;
      else if (field === 'category') copy.category = value;
      else if (field === 'name.en') copy.name.en = value;
      else if (field === 'name.zhHK') copy.name.zhHK = value;
      else if (field === 'notes.en') copy.notes.en = value;
      else if (field === 'notes.zhHK') copy.notes.zhHK = value;
      return copy;
    });
  };

  const updateDayField = (path: string, value: string | number) => {
    setEditingDay((prev) => {
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

  const categories = ['food', 'landmark', 'shopping', 'transport', 'hotel', 'activity', 'nature', 'culture'];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('itinerary.title')}</h2>
        <p className={styles.subtitle}>{t('itinerary.subtitle')}</p>
      </div>

      {countdown !== null && (
        <div className={styles.countdown}>
          <div className={styles.countdownNum}>
            {countdown > 0 ? countdown : '🎉'}
          </div>
          <div className={styles.countdownLabel}>
            {countdown > 0 ? t('itinerary.countdown') : t('itinerary.countdownPast')}
          </div>
        </div>
      )}

      <div className={styles.dayTabs}>
        {days.map((day) => (
          <button
            key={day.dayNumber}
            className={`${styles.dayTab} ${activeDay === day.dayNumber ? styles.active : ''}`}
            onClick={() => setActiveDay(day.dayNumber)}
          >
            {lang === 'zhHK'
              ? `${t('itinerary.day')}${day.dayNumber}日`
              : `${t('itinerary.day')} ${day.dayNumber}`}
          </button>
        ))}
        <button className={styles.dayTabAdd} onClick={openNewDay}>+</button>
      </div>

      {currentDay && (
        <div className={styles.dayCard}>
          <div className={styles.dayHeader}>
            <div>
              <h3 className={styles.dayTitle}>{currentDay.title[lang]}</h3>
              <span className={styles.dayDate}>{currentDay.date}</span>
            </div>
            <div className={styles.dayHeaderRight}>
              <div className={styles.weather}>
                <span className={styles.weatherIcon}>{currentDay.weather.icon}</span>
                <span>{currentDay.weather.temp}</span>
              </div>
              <button className={styles.editDayBtn} onClick={openEditDay}>✏️</button>
            </div>
          </div>

          <div className={styles.timeline}>
            {currentDay.locations.map((loc, idx) => (
              <div key={idx} className={styles.timelineItem} onClick={() => openEditLoc(loc, idx)}>
                <div className={styles.timeCol}>
                  <span className={styles.time}>{loc.time}</span>
                </div>
                <div className={styles.dot}>{loc.emoji}</div>
                <div className={styles.locationInfo}>
                  <p className={styles.locationName}>
                    {loc.name[lang]}
                    <span className={`${styles.categoryBadge} ${styles[loc.category] || ''}`}>
                      {loc.category}
                    </span>
                  </p>
                  <p className={styles.locationNotes}>{loc.notes[lang]}</p>
                </div>
              </div>
            ))}
          </div>

          <button className={styles.addLocBtn} onClick={openNewLoc}>
            + {t('itinerary.addLocation')}
          </button>
        </div>
      )}

      {/* Day Edit Modal */}
      {editingDay && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>
              {isNewDay ? t('itinerary.addDay') : t('itinerary.editDay')}
            </h3>
            <div className={styles.formGrid}>
              <label className={styles.formLabel}>
                {t('itinerary.day')} #
                <input className={styles.formInput} type="number" value={editingDay.dayNumber}
                  onChange={(e) => updateDayField('dayNumber', parseInt(e.target.value) || 0)} />
              </label>
              <label className={styles.formLabel}>
                {t('itinerary.dayDate')}
                <input className={styles.formInput} type="date" value={editingDay.date}
                  onChange={(e) => updateDayField('date', e.target.value)} />
              </label>
              <label className={styles.formLabel}>
                {t('itinerary.dayTitle')} (EN)
                <input className={styles.formInput} value={editingDay.title.en}
                  onChange={(e) => updateDayField('title.en', e.target.value)} />
              </label>
              <label className={styles.formLabel}>
                {t('itinerary.dayTitle')} (粵)
                <input className={styles.formInput} value={editingDay.title.zhHK}
                  onChange={(e) => updateDayField('title.zhHK', e.target.value)} />
              </label>
              <label className={styles.formLabel}>
                {t('itinerary.weatherIcon')}
                <input className={styles.formInput} value={editingDay.weather.icon}
                  onChange={(e) => updateDayField('weather.icon', e.target.value)} />
              </label>
              <label className={styles.formLabel}>
                {t('itinerary.weatherTemp')}
                <input className={styles.formInput} value={editingDay.weather.temp}
                  onChange={(e) => updateDayField('weather.temp', e.target.value)} />
              </label>
            </div>
            <div className={styles.modalActions}>
              {!isNewDay && (
                <button className={styles.deleteBtn} onClick={deleteDay}>
                  {t('itinerary.deleteDay')}
                </button>
              )}
              <button className={styles.cancelBtn} onClick={closeDay}>{t('itinerary.cancel')}</button>
              <button className={styles.saveBtn} onClick={saveDay}>{t('itinerary.save')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Location Edit Modal */}
      {editingLoc && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>
              {isNewLoc ? t('itinerary.addLocation') : t('itinerary.editLocation')}
            </h3>
            <div className={styles.formGrid}>
              <label className={styles.formLabel}>
                {t('itinerary.locationTime')}
                <input className={styles.formInput} type="time" value={editingLoc.time}
                  onChange={(e) => updateLocField('time', e.target.value)} />
              </label>
              <label className={styles.formLabel}>
                {t('itinerary.locationEmoji')}
                <input className={styles.formInput} value={editingLoc.emoji}
                  onChange={(e) => updateLocField('emoji', e.target.value)} />
              </label>
              <label className={styles.formLabel}>
                {t('itinerary.locationName')} (EN)
                <input className={styles.formInput} value={editingLoc.name.en}
                  onChange={(e) => updateLocField('name.en', e.target.value)} />
              </label>
              <label className={styles.formLabel}>
                {t('itinerary.locationName')} (粵)
                <input className={styles.formInput} value={editingLoc.name.zhHK}
                  onChange={(e) => updateLocField('name.zhHK', e.target.value)} />
              </label>
              <label className={styles.formLabel}>
                {t('itinerary.locationCategory')}
                <select className={styles.formInput} value={editingLoc.category}
                  onChange={(e) => updateLocField('category', e.target.value)}>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className={styles.formLabel}>
                {t('itinerary.locationNotes')} (EN)
                <input className={styles.formInput} value={editingLoc.notes.en}
                  onChange={(e) => updateLocField('notes.en', e.target.value)} />
              </label>
              <label className={styles.formLabel}>
                {t('itinerary.locationNotes')} (粵)
                <input className={styles.formInput} value={editingLoc.notes.zhHK}
                  onChange={(e) => updateLocField('notes.zhHK', e.target.value)} />
              </label>
            </div>
            <div className={styles.modalActions}>
              {!isNewLoc && (
                <button className={styles.deleteBtn} onClick={deleteLoc}>
                  {t('itinerary.delete')}
                </button>
              )}
              <button className={styles.cancelBtn} onClick={closeLoc}>{t('itinerary.cancel')}</button>
              <button className={styles.saveBtn} onClick={saveLoc}>{t('itinerary.save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
