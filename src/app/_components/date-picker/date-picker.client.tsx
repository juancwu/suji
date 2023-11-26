"use client";

import { useState, useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  addMonths,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  endOfMonth,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfToday,
  isEqual,
} from "date-fns";
import { cva } from "class-variance-authority";

const dayButtonStyles = cva("bg-gray-50 py-1.5 focus:z-10", {
  variants: {
    sameMonth: {
      true: "bg-white hover:bg-gray-50",
    },
    selected: {
      true: "font-semibold text-white",
    },
    today: {
      true: "text-indigo-600",
    },
    firstRowLeft: {
      true: "rounded-tl-lg",
    },
    firstRowRight: {
      true: "rounded-tr-lg",
    },
    lastRowLeft: {
      true: "rounded-bl-lg",
    },
    lastRowRight: {
      true: "rounded-br-lg",
    },
  },
  compoundVariants: [
    {
      selected: false,
      sameMonth: true,
      today: false,
      className: "text-gray-900",
    },
    {
      selected: false,
      sameMonth: false,
      today: false,
      className: "text-gray-400",
    },
    {
      today: true,
      selected: false,
      className: "text-indigo-600",
    },
  ],
});

const dayStyles = cva(
  "mx-auto flex h-7 w-7 items-center justify-center rounded-full",
  {
    variants: {
      selected: {
        true: "",
      },
      today: {
        true: "",
      },
    },
    compoundVariants: [
      {
        selected: true,
        today: true,
        className: "bg-indigo-600",
      },
      {
        selected: true,
        today: false,
        className: "bg-gray-900",
      },
    ],
  },
);

export interface DatePickerProps {
  onChange?: (date: Date) => void;
}

export default function DatePicker({ onChange }: DatePickerProps) {
  const [currentDate, setCurrentDate] = useState(startOfToday());
  const [selectedDay, setSelectedDay] = useState(currentDate);

  const days = useMemo(() => {
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    const start = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
    const end = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 });
    return eachDayOfInterval({
      start,
      end,
    });
  }, [currentDate]);

  return (
    <div>
      <div className="text-center">
        <div className="flex items-center text-gray-900">
          <button
            type="button"
            className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            onClick={() => {
              setCurrentDate((date) => addMonths(date, -1));
            }}
          >
            <span className="sr-only">Previous month</span>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="flex-auto text-sm font-semibold">
            {format(currentDate, "MMM yyyy")}
          </div>
          <button
            type="button"
            className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            onClick={() => {
              setCurrentDate((date) => addMonths(date, 1));
            }}
          >
            <span className="sr-only">Next month</span>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
          <div>S</div>
        </div>
        <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
          {days.map((day, dayIdx) => (
            <button
              key={day.toString()}
              type="button"
              onClick={() => {
                setSelectedDay(day);
                onChange?.(day);
              }}
              className={dayButtonStyles({
                sameMonth: isSameMonth(day, currentDate),
                selected: isEqual(day, selectedDay),
                today: isToday(day),
                firstRowLeft: dayIdx === 0,
                firstRowRight: dayIdx === 6,
                lastRowLeft: dayIdx === days.length - 7,
                lastRowRight: dayIdx === days.length - 1,
              })}
              disabled={!isSameMonth(day, currentDate)}
            >
              <time
                dateTime={format(day, "yyyy-MM-dd")}
                className={dayStyles({
                  selected: isEqual(day, selectedDay),
                  today: isToday(day),
                })}
              >
                {format(day, "d")}
              </time>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
