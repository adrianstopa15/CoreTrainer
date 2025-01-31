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

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const dateString = `${yyyy}-${mm}-${dd}`;

      const dayEvents = eventsMap[dateString];
      if (dayEvents?.length > 0) {
        return (
          <div className="tooltip-container">
            <span className="tooltip-icon">🏋️</span>

            <div className="tooltip">
              {dayEvents.map((evt, idx) => (
                <div key={idx} className="tooltip-line">
                  <strong>{evt.hour}</strong> - {evt.name}
                </div>
              ))}
            </div>
          </div>
        );
      }
    }
    return null;
  };

  if (loading) {
    return <p className="text-white">Ładowanie kalendarza...</p>;
  }
  return (
    <div className="p-4">
      <h1 className="lg:text-xl text-white mb-4 text-center">
        Kalendarz treningów
      </h1>
      <div className="react-calendar-eventBox ">
        <Calendar locale="pl-PL" tileClassName={tileClassName} />
        <p className="">31 stycznia:</p>
      </div>
      <div className="text-sm mt-3">
        <p>
          <span className="legend-box completed"></span> - trening wykonany ✅
        </p>
        <p>
          <span className="legend-box planned"></span> - trening zaplanowany 📅
        </p>
        <p></p>
      </div>
    </div>
  );
}
