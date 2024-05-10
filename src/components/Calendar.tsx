import { useMemo, useState } from "react";
import {
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isBefore,
  endOfDay,
  isToday,
  subMonths,
  addMonths,
} from "date-fns";
import { formatDate } from "../utls/formatDate";
import { cc } from "../utls/cc";
import { UnionOmit } from "../utls/types";
import { Modal, ModalProps } from "./Modal";
import { useEvents } from "../context/UseEvents";
import { Event } from "../context/Events";

export function Calendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const calendarDays = useMemo(() => {
    const firstWeekStart = startOfWeek(startOfMonth(selectedMonth));
    const lastWeekStart = endOfWeek(endOfMonth(selectedMonth));

    return eachDayOfInterval({ start: firstWeekStart, end: lastWeekStart });
  }, [selectedMonth]);

  return (
    <div className="calendar">
      <div className="header">
        <button className="btn" onClick={() => setSelectedMonth(new Date())}>
          Today
        </button>
        <div>
          <button
            className="month-change-btn"
            onClick={() => setSelectedMonth((m) => subMonths(m, 1))}
          >
            &lt;
          </button>
          <button
            className="month-change-btn"
            onClick={() => setSelectedMonth((m) => addMonths(m, 1))}
          >
            &gt;
          </button>
        </div>
        <span className="month-title">
          {formatDate(selectedMonth, { month: "long", year: "numeric" })}
        </span>
      </div>
      <div className="days">
        {calendarDays.map((day, index) => (
          <CalendarDay
            key={day.getTime()}
            day={day}
            showWeekName={index < 7}
            selectedMonth={selectedMonth}
          />
        ))}
      </div>
    </div>
  );
}

type CalendarDayProps = {
  day: Date;
  showWeekName: boolean;
  selectedMonth: Date;
};

function CalendarDay({ day, showWeekName, selectedMonth }: CalendarDayProps) {

  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false)
  const {addEvent} = useEvents()
  return (
    <div
      className={cc(
        "day",
        !isSameMonth(day, selectedMonth) && "non-month-day",
        isBefore(endOfDay(day), new Date()) && "old-month-day"
      )}
    >
      <div className="day-header">
        {showWeekName && (
          <div className="week-name">
            {formatDate(day, { weekday: "long" })}
          </div>
        )}
        <div className={cc("day-number", isToday(day) && "today")}>
          {formatDate(day, { day: "numeric" })}
        </div>
        <button className="add-event-btn" onClick={() => setIsNewEventModalOpen(true)}>+</button>
      </div>
      {/* <div className="events">
              <button className="all-day-event blue event">
                <div className="event-name">Short</div>
              </button>
              <button className="all-day-event green event">
                <div className="event-name">
                  Long Event Name That Just Keeps Going
                </div>
              </button>
              <button className="event">
                <div className="color-dot blue" />
                <div className="event-time">7am</div>
                <div className="event-name">Event Name</div>
              </button>
            </div> */}
            <EventFormModal date={day} isOpen={isNewEventModalOpen} onClose={() => setIsNewEventModalOpen(false)} onSubmit={addEvent}/>
    </div>
  );
}

type EventFormModalProps = {
  onSubmit: (event: UnionOmit<Event, "id">) => void;
} & (
  | {
      onDelete: () => void;
      event: Event;
      date?: never;
    }
  | {
      onDelete?: () => never;
      event?: never;
      date: Date;
    }
) & Omit<ModalProps, "children">

function EventFormModal({ onSubmit, onDelete, event, date, ...modalProps }: EventFormModalProps) {
  return (
    <Modal {...modalProps}>



      <div class="modal-title">
        <div>Add Event</div>
        <small>6/8/23</small>
        <button class="close-btn">&times;</button>
      </div>
      <form>
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" name="name" id="name" />
        </div>
        <div class="form-group checkbox">
          <input type="checkbox" name="all-day" id="all-day" />
          <label for="all-day">All Day?</label>
        </div>
        <div class="row">
          <div class="form-group">
            <label for="start-time">Start Time</label>
            <input type="time" name="start-time" id="start-time" />
          </div>
          <div class="form-group">
            <label for="end-time">End Time</label>
            <input type="time" name="end-time" id="end-time" />
          </div>
        </div>
        <div class="form-group">
          <label>Color</label>
          <div class="row left">
            <input
              type="radio"
              name="color"
              value="blue"
              id="blue"
              checked
              class="color-radio"
            />
            <label for="blue">
              <span class="sr-only">Blue</span>
            </label>
            <input
              type="radio"
              name="color"
              value="red"
              id="red"
              class="color-radio"
            />
            <label for="red">
              <span class="sr-only">Red</span>
            </label>
            <input
              type="radio"
              name="color"
              value="green"
              id="green"
              class="color-radio"
            />
            <label for="green">
              <span class="sr-only">Green</span>
            </label>
          </div>
        </div>
        <div class="row">
          <button class="btn btn-success" type="submit">
            Add
          </button>
          <button class="btn btn-delete" type="button">
            Delete
          </button>
        </div>
      </form>


    </Modal>
  );
}
