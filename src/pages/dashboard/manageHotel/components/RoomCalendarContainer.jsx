import React, { useState, useEffect } from 'react';

// Inline rate calendar container for the redesigned second tab
const RoomCalendarContainer = ({ room, onSaveSettings }) => {
  const basePrice = room.price || room.pricePerNight || room.basePrice || '0';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState(new Set());
  const [calendarSettings, setCalendarSettings] = useState(room.calendarSettings || {});
  const [inputPrice, setInputPrice] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');

  useEffect(() => {
    setCalendarSettings(room.calendarSettings || {});
    setSelectedDates(new Set());
    setInputPrice('');
    setIsBlocked(false);
    setRangeStart('');
    setRangeEnd('');
  }, [room]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const formatDateString = (y, m, d) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDateClick = (dateStr) => {
    const nextSelected = new Set(selectedDates);
    if (nextSelected.has(dateStr)) {
      nextSelected.delete(dateStr);
    } else {
      nextSelected.add(dateStr);
    }
    setSelectedDates(nextSelected);
  };

  const handleSelectAllWeekends = () => {
    const nextSelected = new Set(selectedDates);
    for (let d = 1; d <= daysInMonth; d++) {
      const dayOfWeek = new Date(year, month, d).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        nextSelected.add(formatDateString(year, month, d));
      }
    }
    setSelectedDates(nextSelected);
  };

  const handleSelectAllWeekdays = () => {
    const nextSelected = new Set(selectedDates);
    for (let d = 1; d <= daysInMonth; d++) {
      const dayOfWeek = new Date(year, month, d).getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        nextSelected.add(formatDateString(year, month, d));
      }
    }
    setSelectedDates(nextSelected);
  };

  const handleApplyRangeSelection = () => {
    if (!rangeStart || !rangeEnd) return;
    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);
    if (start > end) return;

    const nextSelected = new Set(selectedDates);
    let current = new Date(start);
    while (current <= end) {
      const y = current.getFullYear();
      const m = current.getMonth();
      const d = current.getDate();
      nextSelected.add(formatDateString(y, m, d));
      current.setDate(current.getDate() + 1);
    }
    setSelectedDates(nextSelected);
  };

  const handleApplySettings = () => {
    if (selectedDates.size === 0) return;

    const updatedSettings = { ...calendarSettings };
    selectedDates.forEach(dateStr => {
      if (isBlocked) {
        updatedSettings[dateStr] = { price: '', isBlocked: true };
      } else {
        updatedSettings[dateStr] = { price: inputPrice || basePrice, isBlocked: false };
      }
    });

    setCalendarSettings(updatedSettings);
    onSaveSettings(room.id || room._id, updatedSettings);
    setSelectedDates(new Set());
    setInputPrice('');
    setIsBlocked(false);
  };

  const handleResetDateRule = (dateStr) => {
    const updatedSettings = { ...calendarSettings };
    delete updatedSettings[dateStr];
    setCalendarSettings(updatedSettings);
    onSaveSettings(room.id || room._id, updatedSettings);
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
      {/* Header & Legend */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-5 gap-4">
        <div>
          <h4 className="text-lg font-bold text-slate-900 tracking-tight">Rates Calendar for {room.name}</h4>
          <p className="text-xs text-slate-550 mt-0.5">Configure daily room rates & availability blocks.</p>
          
          {/* Visual Legend */}
          <div className="flex flex-wrap gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
              <span className="w-3.5 h-3.5 bg-white border border-slate-200 rounded"></span>
              Default Price
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700">
              <span className="w-3.5 h-3.5 bg-emerald-50 border border-emerald-250 rounded"></span>
              Custom Rate
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-650">
              <span className="w-3.5 h-3.5 bg-red-50 border border-red-200 rounded"></span>
              Blocked / Sold Out
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-900">
              <span className="w-3.5 h-3.5 bg-slate-900/10 border-2 border-slate-900/50 rounded"></span>
              Selected
            </div>
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-right shadow-xs min-w-[120px]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Default Price</span>
          <p className="text-xl font-extrabold text-slate-900">${basePrice}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-slate-950 p-3 rounded-2xl text-white shadow-sm">
            <button
              type="button"
              onClick={prevMonth}
              className="px-3 py-1.5 hover:bg-slate-800 rounded-lg transition text-slate-200 text-xs font-bold cursor-pointer"
            >
              &larr; Prev
            </button>
            <span className="text-sm font-bold tracking-wide">{monthNames[month]} {year}</span>
            <button
              type="button"
              onClick={nextMonth}
              className="px-3 py-1.5 hover:bg-slate-800 rounded-lg transition text-slate-200 text-xs font-bold cursor-pointer"
            >
              Next &rarr;
            </button>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            <div className="grid grid-cols-7 bg-slate-50 text-center font-bold text-[10px] text-slate-500 py-3 border-b border-slate-150 uppercase tracking-wider">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 border-b border-slate-100">
              {Array.from({ length: firstDay }).map((_, idx) => (
                <div key={`empty-${idx}`} className="bg-slate-50/30 min-h-[85px]"></div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const d = idx + 1;
                const dateStr = formatDateString(year, month, d);
                const isSelected = selectedDates.has(dateStr);
                const rule = calendarSettings[dateStr];
                const hasCustomRule = !!rule;
                const dayOfWeek = new Date(year, month, d).getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                let cellBg = isWeekend ? "bg-slate-50/40 hover:bg-slate-100/50" : "bg-white hover:bg-slate-50/70";
                if (isSelected) {
                  cellBg = "bg-slate-900/10 border-2 border-slate-900/80 ring-2 ring-slate-900/10 z-10 scale-95";
                } else if (rule?.isBlocked) {
                  cellBg = "bg-red-50/70 hover:bg-red-100/70 border-red-100";
                } else if (hasCustomRule) {
                  cellBg = "bg-emerald-50/70 hover:bg-emerald-100/70 border-emerald-100";
                }

                return (
                  <div
                    key={dateStr}
                    onClick={() => handleDateClick(dateStr)}
                    className={`min-h-[85px] p-2.5 flex flex-col justify-between cursor-pointer transition-all duration-200 relative group select-none ${cellBg}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold ${isSelected ? 'text-slate-950 font-extrabold scale-110' : 'text-slate-800'}`}>{d}</span>
                      {hasCustomRule && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResetDateRule(dateStr);
                          }}
                          className="text-[9px] text-red-500 font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <div className="text-right mt-2">
                      {rule?.isBlocked ? (
                        <span className="inline-block px-1.5 py-0.5 bg-red-100 text-red-800 text-[8px] font-extrabold rounded-sm uppercase tracking-wider">Blocked</span>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span className={`text-xs font-extrabold ${hasCustomRule ? 'text-emerald-700' : 'text-slate-450'}`}>
                            ${rule ? rule.price : basePrice}
                          </span>
                          {hasCustomRule && (
                            <span className="text-[8px] uppercase tracking-wider text-emerald-600 font-bold">Custom</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={handleSelectAllWeekends}
              className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Select All Weekends
            </button>
            <button
              type="button"
              onClick={handleSelectAllWeekdays}
              className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Select All Weekdays
            </button>
            <button
              type="button"
              onClick={() => setSelectedDates(new Set())}
              className="px-3.5 py-2 border border-red-200 hover:bg-red-50 text-red-650 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Clear Selected ({selectedDates.size})
            </button>
          </div>
        </div>

        {/* Configurations Side Panel */}
        <div className="bg-slate-50/80 border border-slate-200 rounded-3xl p-5 space-y-5 shadow-xs">
          <div>
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Bulk Selection Helper</h5>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Start Date</span>
                <input
                  type="date"
                  value={rangeStart}
                  onChange={(e) => setRangeStart(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-250 rounded-xl bg-white shadow-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">End Date</span>
                <input
                  type="date"
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-250 rounded-xl bg-white shadow-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleApplyRangeSelection}
              className="w-full mt-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
            >
              Select Range
            </button>
          </div>

          <div className="border-t border-slate-200 pt-4 space-y-4">
            <div className="p-3 bg-slate-950 text-white rounded-2xl flex justify-between items-center shadow-xs">
              <span className="text-xs font-bold">Selected Days:</span>
              <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 font-extrabold rounded-lg text-xs">{selectedDates.size}</span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Set Availability Status</span>
              
              {/* Premium Pill Toggle Selector */}
              <div className="flex bg-slate-200 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIsBlocked(false)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    !isBlocked
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Available
                </button>
                <button
                  type="button"
                  onClick={() => setIsBlocked(true)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    isBlocked
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Blocked
                </button>
              </div>
            </div>

            {!isBlocked && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 block">Custom Price ($ per night)</span>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">$</span>
                  <input
                    type="number"
                    placeholder={basePrice}
                    value={inputPrice}
                    onChange={(e) => setInputPrice(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 text-xs border border-slate-250 rounded-xl bg-white shadow-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={selectedDates.size === 0}
              onClick={handleApplySettings}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md shadow-emerald-600/10"
            >
              Apply to Selected ({selectedDates.size})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCalendarContainer;
