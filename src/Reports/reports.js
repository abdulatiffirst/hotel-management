import React, { useEffect, useMemo, useState } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../firebaseConfig';
import { Link } from 'react-router-dom';

function ReportsPage() {
  const [reportDate, setReportDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [guests, setGuests] = useState([]);
  const [edits, setEdits] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onValue(ref(db), (snapshot) => {
      const data = snapshot.val() || {};
      setGuests(Object.values(data));
      setLoading(false);
    });
    return () => typeof unsubscribe === 'function' && unsubscribe();
  }, []);

  // Helpers for date handling (robust parser for common locales)
  const parseTimestamp = (value) => {
    if (!value) return null;
    if (typeof value === 'number') {
      const d = new Date(value);
      return isNaN(d) ? null : d;
    }
    const str = String(value).trim();
    let d = new Date(str);
    if (!isNaN(d)) return d;
    // try dd.MM.yyyy HH:mm[:ss]
    const dot = str.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})(?:\s*,?\s*(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
    if (dot) {
      const [, dd, mm, yyyy, hh = '0', mi = '0', ss = '0'] = dot;
      d = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(mi), Number(ss));
      return isNaN(d) ? null : d;
    }
    // try dd/MM/yyyy HH:mm[:ss]
    const slashDMY = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s*,?\s*(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
    if (slashDMY) {
      const [, dd, mm, yyyy, hh = '0', mi = '0', ss = '0'] = slashDMY;
      d = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(mi), Number(ss));
      return isNaN(d) ? null : d;
    }
    return null;
  };

  const toDateOnly = (value) => {
    const d = parseTimestamp(value);
    if (!d) return null;
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Daily report is always 8:00 → next day 8:00, no modes
  const dayRange = useMemo(() => {
    if (!reportDate) return { startOfDay: null, endOfDay: null };
    const parts = String(reportDate).split('-').map((p) => Number(p));
    const [yyyy, mm, dd] = parts.length === 3 ? parts : [NaN, NaN, NaN];
    if (Number.isNaN(yyyy) || Number.isNaN(mm) || Number.isNaN(dd)) {
      return { startOfDay: null, endOfDay: null };
    }
    // Construct in local time to avoid UTC offset issues with 'YYYY-MM-DD'
    const startOfDay = new Date(yyyy, mm - 1, dd, 8, 0, 0, 0);
    const endOfDay = new Date(yyyy, mm - 1, dd + 1, 8, 0, 0, 0);
    return { startOfDay, endOfDay };
  }, [reportDate]);

  // Format as Day/Month/Year and HH:mm
  const formatDateTimeDMY = (value) => {
    const d = parseTimestamp(value);
    if (!d) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
  };

  const guestsForDay = useMemo(() => {
    if (!reportDate) return [];
    const { startOfDay, endOfDay } = dayRange;
    return guests
      .filter((g) => {
        const registered = parseTimestamp(g.registrationTime);
        const leftAt = parseTimestamp(g.leaveHotelTime);
        if (!registered) return false;
        const stayStart = registered; // require valid registration time
        const stayEnd = leftAt || new Date(8640000000000000); // max date
        // Overlap between [stayStart, stayEnd] and [startOfDay, endOfDay)
        return stayStart < endOfDay && stayEnd >= startOfDay;
      })
      .sort((a, b) => Number(a.roomNumber) - Number(b.roomNumber));
  }, [guests, reportDate, dayRange]);

  const getRowValue = (g, key) => {
    const e = edits[g.uuid];
    if (e && e[key] !== undefined && e[key] !== null && e[key] !== '') return e[key];
    return g[key];
  };

  const income = useMemo(() => {
    const agg = { contract: 0, cash: 0, debitCard: 0, total: 0 };
    guestsForDay.forEach((g) => {
      const days = Number(getRowValue(g, 'days')) || 0;
      const price = Number(getRowValue(g, 'dailyPrice')) || 0;
      const method = String(getRowValue(g, 'paymentMethod') || '').toLowerCase();
      const whole = days * price;
      if (method === 'contract') agg.contract += whole;
      else if (method === 'cash') agg.cash += whole;
      else if (method === 'debit card') agg.debitCard += whole;
      agg.total += whole;
    });
    return agg;
  }, [guestsForDay, edits]);

  const onChangeEdit = (uuid, field, value) => {
    setEdits((prev) => ({ ...prev, [uuid]: { ...prev[uuid], [field]: value } }));
  };

  const saveRow = (g) => {
    const e = edits[g.uuid];
    if (!e) return;
    const payload = { ...e };
    if (payload.days !== undefined) payload.days = Number(payload.days) || 0;
    if (payload.dailyPrice !== undefined) payload.dailyPrice = Number(payload.dailyPrice) || 0;
    update(ref(db, `/${g.uuid}`), payload);
  };

  if (loading) {
    return (
      <div style={{ padding: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 18, marginBottom: 16 }}>Loading reports...</div>
        <div style={{ width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link className="link2" to="/">Home</Link>
          <Link className="link2" to="/multiControll">Dashboard</Link>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <label htmlFor="report-date">Date:</label>
          <input id="report-date" type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)} />
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>No</th>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Name</th>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Room</th>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Registration Time</th>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Leave Hotel Time</th>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Counted In</th>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Days</th>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Daily Price</th>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Payment</th>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Whole Price</th>
            <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}></th>
          </tr>
        </thead>
        <tbody>
          {guestsForDay.map((g, idx) => {
            const { startOfDay, endOfDay } = dayRange;
            const days = Number(getRowValue(g, 'days')) || 0;
            const price = Number(getRowValue(g, 'dailyPrice')) || 0;
            const method = getRowValue(g, 'paymentMethod') || '';
            const whole = days * price;
            const leftAt = parseTimestamp(g.leaveHotelTime);
            const showLeaveTime = !!leftAt && leftAt >= startOfDay && leftAt < endOfDay;
            const registered = parseTimestamp(g.registrationTime);
            const countedIn = registered && registered < endOfDay && (leftAt ? leftAt >= startOfDay : true);
            return (
              <tr key={g.uuid}>
                <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{idx + 1}</td>
                <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{g.name}</td>
                <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{g.roomNumber}</td>
                <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{formatDateTimeDMY(g.registrationTime)}</td>
                <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{showLeaveTime ? formatDateTimeDMY(g.leaveHotelTime) : ''}</td>
                <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{countedIn ? 'Yes' : 'No'}</td>
                <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>
                  <input
                    type="number"
                    value={days}
                    onChange={(e) => onChangeEdit(g.uuid, 'days', e.target.value)}
                    style={{ width: 80 }}
                  />
                </td>
                <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => onChangeEdit(g.uuid, 'dailyPrice', e.target.value)}
                    style={{ width: 100 }}
                  />
                </td>
                <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>
                  <select
                    value={method}
                    onChange={(e) => onChangeEdit(g.uuid, 'paymentMethod', e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Cash">Cash</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Contract">Contract</option>
                  </select>
                </td>
                <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>{whole}</td>
                <td style={{ borderBottom: '1px solid #f0f0f0', padding: 8 }}>
                  <button onClick={() => saveRow(g)}>Save</button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5} style={{ padding: 8, textAlign: 'right', fontWeight: 600 }}>Totals:</td>
            <td colSpan={2} style={{ padding: 8 }}>Contract: {income.contract}</td>
            <td style={{ padding: 8 }}>Cash: {income.cash}</td>
            <td style={{ padding: 8 }}>Debit Card: {income.debitCard}</td>
            <td style={{ padding: 8, fontWeight: 700 }}>Total: {income.total}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default ReportsPage;