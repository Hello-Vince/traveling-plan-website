import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../contexts/SettingsContext';
import type { Flight } from '../../types';
import styles from './BoardingPass.module.css';

const API = '/api/flights';

type FlightErrors = {
  airline?: string;
  flightNo?: string;
  departure?: { code?: string; date?: string };
  arrival?: { code?: string; date?: string };
};

const validateFlight = (flight: Omit<Flight, '_id'>): FlightErrors => {
  const errors: FlightErrors = {};
  if (!flight.airline?.trim()) errors.airline = 'Airline is required';
  if (!flight.flightNo?.trim()) errors.flightNo = 'Flight number is required';
  if (!flight.departure.code?.trim()) errors.departure = { code: 'Departure airport is required' };
  if (!flight.departure.date) errors.departure = { ...errors.departure, date: 'Departure date is required' };
  if (!flight.arrival.code?.trim()) errors.arrival = { code: 'Arrival airport is required' };
  if (!flight.arrival.date) errors.arrival = { ...errors.arrival, date: 'Arrival date is required' };
  return errors;
};

const emptyEndpoint = () => ({ code: '', city: { en: '', zhHK: '' }, time: '', date: '' });

const emptyFlight = (): Omit<Flight, '_id'> => ({
  airline: '',
  flightNo: '',
  departure: emptyEndpoint(),
  arrival: emptyEndpoint(),
  gate: '',
  seat: '',
  status: 'scheduled',
});

export default function BoardingPass() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [errors, setErrors] = useState<FlightErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<Partial<Flight> & Omit<Flight, '_id'> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const lang = settings.language as 'en' | 'zhHK';

  useEffect(() => {
    fetch(API).then((r) => r.json()).then(setFlights).catch(console.error);
  }, []);

  const openNew = () => {
    setEditing(emptyFlight());
    setIsNew(true);
  };

  const openEdit = (flight: Flight) => {
    setEditing({ ...flight });
    setIsNew(false);
  };

  const close = () => {
    setEditing(null);
    setIsNew(false);
  };

  const save = async () => {
    if (!editing) return;
    const validationErrors = validateFlight(editing);
    setErrors(validationErrors);
    setTouched({ airline: true, flightNo: true, depCode: true, depDate: true, arrCode: true, arrDate: true });
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
        setFlights((prev) => [...prev, created]);
      } else {
        const { _id, ...body } = editing as Flight;
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
        setFlights((prev) => prev.map((f) => (f._id === updated._id ? updated : f)));
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
      setFlights((prev) => prev.filter((f) => f._id !== id));
      close();
    } catch (err) {
      console.error(err);
    }
  };

  const updateField = (path: string, value: string) => {
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
    if (editing) setErrors(validateFlight(editing));
  };

  const getFieldError = (field: string): string | undefined => {
    if (!touched[field]) return undefined;
    if (field === 'airline') return errors.airline;
    if (field === 'flightNo') return errors.flightNo;
    if (field === 'depCode') return errors.departure?.code;
    if (field === 'depDate') return errors.departure?.date;
    if (field === 'arrCode') return errors.arrival?.code;
    if (field === 'arrDate') return errors.arrival?.date;
    return undefined;
  };

  const isValid = Object.keys(validateFlight(editing || emptyFlight())).length === 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('flights.title')}</h2>
        <p className={styles.subtitle}>{t('flights.subtitle')}</p>
      </div>

      <button className={styles.addBtn} onClick={openNew}>
        + {t('flights.addFlight')}
      </button>

      {editing && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>
              {isNew ? t('flights.addFlight') : t('flights.editFlight')}
            </h3>
            <div className={styles.formGrid}>
              <label className={styles.formLabel}>
                {t('flights.airline')}
                <input className={`${styles.formInput} ${getFieldError('airline') ? styles.error : ''}`} 
                  value={editing.airline} 
                  onChange={(e) => { updateField('airline', e.target.value); if (editing) setErrors(validateFlight(editing)); }}
                  onBlur={() => handleBlur('airline')} />
                {getFieldError('airline') && <span className={styles.errorMsg}>{getFieldError('airline')}</span>}
              </label>
              <label className={styles.formLabel}>
                {t('flights.flightNo')}
                <input className={`${styles.formInput} ${getFieldError('flightNo') ? styles.error : ''}`} 
                  value={editing.flightNo} 
                  onChange={(e) => { updateField('flightNo', e.target.value); if (editing) setErrors(validateFlight(editing)); }}
                  onBlur={() => handleBlur('flightNo')} />
                {getFieldError('flightNo') && <span className={styles.errorMsg}>{getFieldError('flightNo')}</span>}
              </label>

              <div className={styles.formSection}>{t('flights.departure')}</div>
              <label className={styles.formLabel}>
                {t('flights.airportCode')}
                <input className={`${styles.formInput} ${getFieldError('depCode') ? styles.error : ''}`} 
                  value={editing.departure.code} 
                  onChange={(e) => { updateField('departure.code', e.target.value); if (editing) setErrors(validateFlight(editing)); }}
                  onBlur={() => handleBlur('depCode')} />
                {getFieldError('depCode') && <span className={styles.errorMsg}>{getFieldError('depCode')}</span>}
              </label>
              <label className={styles.formLabel}>
                {t('flights.city')} (EN)
                <input className={styles.formInput} value={editing.departure.city.en} onChange={(e) => updateField('departure.city.en', e.target.value)} />
              </label>
              <label className={styles.formLabel}>
                {t('flights.city')} (粵)
                <input className={styles.formInput} value={editing.departure.city.zhHK} onChange={(e) => updateField('departure.city.zhHK', e.target.value)} />
              </label>
              <label className={styles.formLabel}>
                {t('flights.time')}
                <input className={styles.formInput} type="time" value={editing.departure.time} onChange={(e) => updateField('departure.time', e.target.value)} />
              </label>
              <label className={styles.formLabel}>
                {t('flights.date')}
                <input className={`${styles.formInput} ${getFieldError('depDate') ? styles.error : ''}`} 
                  type="date" value={editing.departure.date} 
                  onChange={(e) => { updateField('departure.date', e.target.value); if (editing) setErrors(validateFlight(editing)); }}
                  onBlur={() => handleBlur('depDate')} />
                {getFieldError('depDate') && <span className={styles.errorMsg}>{getFieldError('depDate')}</span>}
              </label>

              <div className={styles.formSection}>{t('flights.arrival')}</div>
              <label className={styles.formLabel}>
                {t('flights.airportCode')}
                <input className={`${styles.formInput} ${getFieldError('arrCode') ? styles.error : ''}`} 
                  value={editing.arrival.code} 
                  onChange={(e) => { updateField('arrival.code', e.target.value); if (editing) setErrors(validateFlight(editing)); }}
                  onBlur={() => handleBlur('arrCode')} />
                {getFieldError('arrCode') && <span className={styles.errorMsg}>{getFieldError('arrCode')}</span>}
              </label>
              <label className={styles.formLabel}>
                {t('flights.city')} (EN)
                <input className={styles.formInput} value={editing.arrival.city.en} onChange={(e) => updateField('arrival.city.en', e.target.value)} />
              </label>
              <label className={styles.formLabel}>
                {t('flights.city')} (粵)
                <input className={styles.formInput} value={editing.arrival.city.zhHK} onChange={(e) => updateField('arrival.city.zhHK', e.target.value)} />
              </label>
              <label className={styles.formLabel}>
                {t('flights.time')}
                <input className={styles.formInput} type="time" value={editing.arrival.time} onChange={(e) => updateField('arrival.time', e.target.value)} />
              </label>
              <label className={styles.formLabel}>
                {t('flights.date')}
                <input className={`${styles.formInput} ${getFieldError('arrDate') ? styles.error : ''}`} 
                  type="date" value={editing.arrival.date} 
                  onChange={(e) => { updateField('arrival.date', e.target.value); if (editing) setErrors(validateFlight(editing)); }}
                  onBlur={() => handleBlur('arrDate')} />
                {getFieldError('arrDate') && <span className={styles.errorMsg}>{getFieldError('arrDate')}</span>}
              </label>

              <label className={styles.formLabel}>
                {t('flights.gate')}
                <input className={styles.formInput} value={editing.gate} onChange={(e) => updateField('gate', e.target.value)} />
              </label>
              <label className={styles.formLabel}>
                {t('flights.seat')}
                <input className={styles.formInput} value={editing.seat} onChange={(e) => updateField('seat', e.target.value)} />
              </label>
            </div>
            <div className={styles.modalActions}>
              {!isNew && (
                <button className={styles.deleteBtn} onClick={() => remove((editing as Flight)._id)}>
                  {t('flights.delete')}
                </button>
              )}
              <button className={styles.cancelBtn} onClick={close}>{t('flights.cancel')}</button>
              <button className={styles.saveBtn} onClick={save} disabled={!isValid}>{t('flights.save')}</button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.cards}>
        {flights.map((flight) => (
          <div key={flight._id} className={styles.pass} onClick={() => openEdit(flight)}>
            <div className={styles.passHeader}>
              <span className={styles.airline}>✈️ {flight.airline}</span>
              <span className={styles.flightNo}>{flight.flightNo}</span>
            </div>

            <div className={styles.passBody}>
              <div className={styles.route}>
                <div className={styles.airport}>
                  <div className={styles.airportCode}>{flight.departure.code}</div>
                  <div className={styles.cityName}>{flight.departure.city[lang]}</div>
                </div>

                <div className={styles.routeLine}>
                  <div className={styles.routeLineInner}>
                    <div className={styles.dashedLine} />
                    <span className={styles.planeIcon}>✈️</span>
                    <div className={styles.dashedLine} />
                  </div>
                </div>

                <div className={styles.airport}>
                  <div className={styles.airportCode}>{flight.arrival.code}</div>
                  <div className={styles.cityName}>{flight.arrival.city[lang]}</div>
                </div>
              </div>

              <div className={styles.details}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>{t('flights.departure')}</span>
                  <span className={styles.detailValue}>{flight.departure.time}</span>
                  <span className={styles.cityName}>{flight.departure.date}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>{t('flights.arrival')}</span>
                  <span className={styles.detailValue}>{flight.arrival.time}</span>
                  <span className={styles.cityName}>{flight.arrival.date}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>{t('flights.gate')}</span>
                  <span className={styles.detailValue}>{flight.gate}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>{t('flights.seat')}</span>
                  <span className={styles.detailValue}>{flight.seat}</span>
                </div>
              </div>
            </div>

            <div className={styles.passFooter}>
              <span className={`${styles.statusBadge} ${styles[flight.status]}`}>
                {t(`flights.status.${flight.status}`)}
              </span>
              <span className={styles.barcode}>||||| |||| ||||| ||||</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
