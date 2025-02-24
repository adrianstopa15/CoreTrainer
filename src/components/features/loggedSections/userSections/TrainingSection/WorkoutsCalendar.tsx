import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";

interface Workout {
  _id: string;
  name: string;
  date: string;
  trainingTime: number;
  exercises: any[];
}

type DayEvents = Array<{ name: string; hour: string }>;
type EventsMap = Record<string, DayEvents>;

export default function WorkoutsCalendar() {
  const [loading, setLoading] = useState(true);
  const [eventsMap, setEventsMap] = useState<EventsMap>({});

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/getWorkouts",
          {
            withCredentials: true,
          }
        );
        const userWorkouts: Workout[] = response.data.userWorkouts || [];

        const map: EventsMap = {};

        userWorkouts.forEach((w) => {
          const dayObj = new Date(w.date);
          const yyyy = dayObj.getFullYear();
          const mm = String(dayObj.getMonth() + 1).padStart(2, "0");
          const dd = String(dayObj.getDate()).padStart(2, "0");
          const dateString = `${yyyy}-${mm}-${dd}`;

          const hour = dayObj.toTimeString().slice(0, 5);

          if (!map[dateString]) {
            map[dateString] = [];
          }
          map[dateString].push({
            name: w.name,
            hour,
          });
        });

        setEventsMap(map);
      } catch (error) {
        console.error("Błąd podczas pobierania treningów", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const dateString = `${yyyy}-${mm}-${dd}`;

      if (eventsMap[dateString]?.length > 0) {
        return "highlight-day";
      }
    }
    return "";
  };

  const handleDateChange = (value: Date) => {
    setSelectedDate(value);
  };

  const formatDateToString = (date: Date): string => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const selectedDateString = formatDateToString(selectedDate);
  const dayEvents = eventsMap[selectedDateString] || [];

  if (loading) {
    return <p className="text-white">Ładowanie kalendarza...</p>;
  }

  return (
    <div className="pt-4">
      <div className="calendarContainer">
        <div>
          <Calendar
            locale="pl-PL"
            value={selectedDate}
            onChange={handleDateChange}
            tileClassName={tileClassName}
            className="workoutCalendar"
          />
        </div>

        <div className="calendarContainerDayInfo text-white">
          <h2 className="mb-2 ml-2">Wydarzenia w dniu {selectedDateString}:</h2>
          {dayEvents.length > 0 ? (
            dayEvents.map((evt, index) => (
              <div key={index} className="mb-2  p-2 rounded text-center">
                {evt.hour} - Trening ({evt.name})
              </div>
            ))
          ) : (
            <p className="text-center p-2">Brak wydarzeń tego dnia</p>
          )}
        </div>
      </div>

      {/* <div className="text-sm mt-3 text-white">
        <p>
          <span className="legend-box completed"></span> - trening wykonany ✅
        </p>
        <p>
          <span className="legend-box planned"></span> - trening zaplanowany 📅
        </p>
      </div> */}
    </div>
  );
}
