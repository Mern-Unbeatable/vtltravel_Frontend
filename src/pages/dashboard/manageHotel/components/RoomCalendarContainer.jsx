import React, { useState, useEffect } from "react";
import { hotelService } from "../../../../api/services/hotelService";

// Inline rate calendar container for the redesigned second tab
const RoomCalendarContainer = ({ room, onSaveSettings }) => {
  const basePrice = room.price || room.pricePerNight || room.basePrice || "0";

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState(new Set());
  const [calendarSettings, setCalendarSettings] = useState(
    room.calendarSettings || {},
  );
  const [inputPrice, setInputPrice] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCalendar = async () => {
      const roomId = room.id || room._id;
      
      if (!roomId || String(roomId).startsWith("mock-")) {
        setCalendarSettings(room.calendarSettings || {});
        return;
      }

      setIsLoading(true);
      try {
        const reqYear = currentDate.getFullYear();
        const reqMonth = currentDate.getMonth() + 1; // API expects 1-12
        const response = await hotelService.getRoomCalendar(roomId, reqYear, reqMonth);
        
        if (response && response.success && response.data) {
          const apiDays = response.data.days || [];
          const defaultPrice = response.data.defaultPrice || basePrice;
          
          const newSettings = {};
          apiDays.forEach((day) => {
            if (day.status === "BLOCKED") {
              newSettings[day.date] = { price: "", isBlocked: true };
            } else if (day.source !== "default" || day.price !== defaultPrice) {
              newSettings[day.date] = { price: String(day.price), isBlocked: false };
            }
          });
          setCalendarSettings(newSettings);
        } else {
          setCalendarSettings(room.calendarSettings || {});
        }
      } catch (err) {
        console.error("Error fetching room calendar:", err);
        setCalendarSettings(room.calendarSettings || {});
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendar();
    setSelectedDates(new Set());
    setInputPrice("");
    setIsBlocked(false);
    setRangeStart("");
    setRangeEnd("");
  }, [room, currentDate]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const formatDateString = (y, m, d) => {
    const mm = String(m + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
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

  const getContiguousRanges = (dateStrings) => {
    if (dateStrings.length === 0) return [];
    
    // Sort dates chronologically
    const sorted = [...dateStrings].sort((a, b) => new Date(a) - new Date(b));
    
    const ranges = [];
    let start = sorted[0];
    let prev = sorted[0];
    
    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const prevDate = new Date(prev);
      const currDate = new Date(current);
      
      const diffTime = Math.abs(currDate - prevDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        prev = current;
      } else {
        ranges.push({ startDate: start, endDate: prev });
        start = current;
        prev = current;
      }
    }
    ranges.push({ startDate: start, endDate: prev });
    return ranges;
  };

  const handleApplySettings = async () => {
    if (selectedDates.size === 0) return;
    const roomId = room.id || room._id;

    if (!roomId || String(roomId).startsWith("mock-")) {
      const updatedSettings = { ...calendarSettings };
      selectedDates.forEach((dateStr) => {
        if (isBlocked) {
          updatedSettings[dateStr] = { price: "", isBlocked: true };
        } else {
          updatedSettings[dateStr] = {
            price: inputPrice || basePrice,
            isBlocked: false,
          };
        }
      });
      setCalendarSettings(updatedSettings);
      onSaveSettings(roomId, updatedSettings);
      setSelectedDates(new Set());
      setInputPrice("");
      setIsBlocked(false);
      return;
    }

    setIsLoading(true);
    try {
      const ranges = getContiguousRanges(Array.from(selectedDates));
      
      for (const range of ranges) {
        const payload = {
          startDate: range.startDate,
          endDate: range.endDate,
          status: isBlocked ? "BLOCKED" : "AVAILABLE",
          customPrice: isBlocked ? 0 : Number(inputPrice || basePrice),
        };
        await hotelService.updateRoomCalendar(roomId, payload);
      }

      // Re-fetch to get updated calendar data
      const reqYear = currentDate.getFullYear();
      const reqMonth = currentDate.getMonth() + 1;
      const response = await hotelService.getRoomCalendar(roomId, reqYear, reqMonth);
      
      if (response && response.success && response.data) {
        const apiDays = response.data.days || [];
        const defaultPrice = response.data.defaultPrice || basePrice;
        
        const newSettings = {};
        apiDays.forEach((day) => {
          if (day.status === "BLOCKED") {
            newSettings[day.date] = { price: "", isBlocked: true };
          } else if (day.source !== "default" || day.price !== defaultPrice) {
            newSettings[day.date] = { price: String(day.price), isBlocked: false };
          }
        });
        setCalendarSettings(newSettings);
      }

      setSelectedDates(new Set());
      setInputPrice("");
      setIsBlocked(false);
    } catch (err) {
      console.error("Error updating room calendar in API call:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetDateRule = async (dateStr) => {
    const roomId = room.id || room._id;
    if (!roomId || String(roomId).startsWith("mock-")) {
      const updatedSettings = { ...calendarSettings };
      delete updatedSettings[dateStr];
      setCalendarSettings(updatedSettings);
      onSaveSettings(roomId, updatedSettings);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        startDate: dateStr,
        endDate: dateStr,
      };
      await hotelService.deleteRoomCalendar(roomId, payload);

      // Re-fetch to update state
      const reqYear = currentDate.getFullYear();
      const reqMonth = currentDate.getMonth() + 1;
      const response = await hotelService.getRoomCalendar(roomId, reqYear, reqMonth);
      
      if (response && response.success && response.data) {
        const apiDays = response.data.days || [];
        const defaultPrice = response.data.defaultPrice || basePrice;
        
        const newSettings = {};
        apiDays.forEach((day) => {
          if (day.status === "BLOCKED") {
            newSettings[day.date] = { price: "", isBlocked: true };
          } else if (day.source !== "default" || day.price !== defaultPrice) {
            newSettings[day.date] = { price: String(day.price), isBlocked: false };
          }
        });
        setCalendarSettings(newSettings);
      }
    } catch (err) {
      console.error("Error resetting date rule in API call:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="h-full overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm xl:p-6">
      {/* Header & Legend */}
      <div className="flex flex-col items-start justify-between gap-3 pb-4 md:flex-row md:items-center xl:gap-4 xl:pb-5">
        <div>
          <h4 className="text-base font-bold tracking-tight text-slate-900 xl:text-lg">
            Rates Calendar for {room.name}
          </h4>
          <p className="mt-0.5 text-xs text-slate-550">
            Configure daily room rates & availability blocks.
          </p>

          {/* Visual Legend */}
          <div className="mt-2 flex flex-wrap gap-2 xl:mt-3 xl:gap-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
              <span className="h-3.5 w-3.5 rounded border border-slate-200 bg-white"></span>
              Default Price
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700">
              <span className="h-3.5 w-3.5 rounded border border-emerald-250 bg-emerald-50"></span>
              Custom Rate
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-650">
              <span className="h-3.5 w-3.5 rounded border border-red-200 bg-red-50"></span>
              Blocked / Sold Out
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary">
              <span className="h-3.5 w-3.5 rounded border-2 border-primary/20 bg-primary/10"></span>
              Selected
            </div>
          </div>
        </div>
        <div className="min-w-[110px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-right shadow-xs xl:min-w-[120px] xl:px-4 xl:py-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Default Price
          </span>
          <p className="text-lg font-extrabold text-primary xl:text-xl">${basePrice}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-6">
        {/* Calendar Grid */}
        <div className="space-y-3 xl:col-span-2 xl:space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-primary/15 p-2.5 text-primary xl:p-3">
            <button
              type="button"
              onClick={prevMonth}
              className="cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-bold text-primary transition hover:bg-white/15 xl:px-3"
            >
              &larr; Prev
            </button>
            <span className="text-sm font-bold tracking-wide">
              {monthNames[month]} {year}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-bold text-primary transition hover:bg-white/15 xl:px-3"
            >
              Next &rarr;
            </button>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            {isLoading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              </div>
            )}
            <div className="grid grid-cols-7 border-b border-slate-150 bg-slate-50 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500 xl:py-3">
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
                <div
                  key={`empty-${idx}`}
                  className="min-h-[68px] bg-slate-50/30 xl:min-h-[85px]"
                ></div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const d = idx + 1;
                const dateStr = formatDateString(year, month, d);
                const isSelected = selectedDates.has(dateStr);
                const rule = calendarSettings[dateStr];
                const hasCustomRule = !!rule;
                const dayOfWeek = new Date(year, month, d).getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                let cellBg = isWeekend
                  ? "bg-slate-50/40 hover:bg-slate-100/50"
                  : "bg-white hover:bg-slate-50/70";
                if (isSelected) {
                  cellBg =
                    "bg-primary/10 border-2 border-primary/40 z-10 scale-95";
                } else if (rule?.isBlocked) {
                  cellBg = "bg-red-50/70 hover:bg-red-100/70 border-red-100";
                } else if (hasCustomRule) {
                  cellBg =
                    "bg-emerald-50/70 hover:bg-emerald-100/70 border-emerald-100";
                }

                return (
                  <div
                    key={dateStr}
                    onClick={() => handleDateClick(dateStr)}
                    className={`group relative flex min-h-[68px] cursor-pointer select-none flex-col justify-between p-1.5 transition-all duration-200 xl:min-h-[85px] xl:p-2.5 ${cellBg}`}
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-xs font-bold ${isSelected ? "text-primary font-extrabold scale-110" : "text-slate-800"}`}
                      >
                        {d}
                      </span>
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
                        <span className="inline-block px-1.5 py-0.5 bg-red-100 text-red-800 text-[8px] font-extrabold rounded-sm uppercase tracking-wider">
                          Blocked
                        </span>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span
                            className={`text-xs font-extrabold ${hasCustomRule ? "text-emerald-700" : "text-slate-450"}`}
                          >
                            ${rule ? rule.price : basePrice}
                          </span>
                          {hasCustomRule && (
                            <span className="text-[8px] uppercase tracking-wider text-emerald-600 font-bold">
                              Custom
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* <div className="flex flex-wrap gap-2 pt-1">
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
          </div> */}
        </div>

        {/* Configurations Side Panel */}
        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 shadow-xs xl:space-y-5 xl:p-5">
          <div>
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Bulk Selection Helper
            </h5>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <span className="text-sm uppercase tracking-wider text-slate-400 font-bold">
                  Start Date
                </span>
                <input
                  type="date"
                  value={rangeStart}
                  onChange={(e) => setRangeStart(e.target.value)}
                  className="w-full text-xs p-2.5 border border-primary/60 rounded-xl bg-white shadow-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <span className="text-sm uppercase tracking-wider text-slate-400 font-bold">
                  End Date
                </span>
                <input
                  type="date"
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(e.target.value)}
                  className="w-full text-xs p-2.5 border border-primary/60 rounded-xl bg-white shadow-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleApplyRangeSelection}
              className="w-full mt-3 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-sm"
            >
              Select Range
            </button>
          </div>

          <div className="border-t border-slate-200 pt-4 space-y-4">
            <div className="p-3 bg-white text-primary border border-primary/50 rounded-2xl flex justify-between items-center shadow-xs">
              <span className="text-xs font-bold">Selected Days:</span>
              <span className="px-2.5 py-0.5 bg-primary text-white font-extrabold rounded-lg text-xs">
                {selectedDates.size}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Set Availability Status
              </span>
              {/* Premium Pill Toggle Selector */}
              <div className="flex bg-slate-200 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIsBlocked(false)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    !isBlocked
                      ? "bg-primary text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Available
                </button>
                <button
                  type="button"
                  onClick={() => setIsBlocked(true)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    isBlocked
                      ? "bg-red-600 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Blocked
                </button>
              </div>
            </div>
            {!isBlocked && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 block">
                  Custom Price ($ per night)
                </span>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder={basePrice}
                    value={inputPrice}
                    onChange={(e) => setInputPrice(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 text-xs border border-primary rounded-xl bg-white shadow-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>
            )}
            <button
              type="button"
              disabled={selectedDates.size === 0}
              onClick={handleApplySettings}
              className="w-full py-3 bg-primary hover:bg-primary/90 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md shadow-primary/10"
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
