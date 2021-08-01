import moment from "moment";
import { sheets_v4 as Sheets } from "googleapis";
import {
  DateTasksType,
  EntryType,
  LoadByDayType,
  LoadedResponse,
  TasksType,
} from "./types";

export const mapData = (data: Sheets.Schema$ValueRange): EntryType[] => {
  return data.values.map(
    (row: string[]): EntryType => ({
      date: row[0],
      issue: row[1],
      name: row[2],
      comment: row[3],
      project: row[4],
      spendTime: row[7],
      loaded: row[8] as LoadedResponse,
    })
  );
};

export const filterLoadedEntries = (entries: EntryType[]) => {
  return entries.filter(
    (entry) => entry.date !== undefined && entry.loaded !== LoadedResponse.OK
  );
};

export const splitByDays = (entries: EntryType[]) => {
  return entries.reduce(
    (days: DateTasksType, entry: EntryType): DateTasksType => {
      days[entry.date] = (days[entry.date] || []).concat(entry);

      return days;
    },
    {}
  );
};

export const splitByTask = (entries: EntryType[]) => {
  return entries.reduce((tasks: TasksType, entry: EntryType): TasksType => {
    const currentTask = tasks[entry.name];

    if (currentTask) {
      const taskSpend = moment(currentTask.spendTime, "hh:mm");
      const newSpend = moment(entry.spendTime, "hh:mm");

      taskSpend
        .add(newSpend.minutes(), "minutes")
        .add(newSpend.hours(), "hours");

      currentTask.spendTime = taskSpend.format("H:mm");

      tasks[entry.name] = currentTask;
    } else {
      tasks[entry.name] = entry;
    }

    return tasks;
  }, {});
};

export const parseLoadTask = (
  entries: EntryType[],
  loadEntries: LoadByDayType[]
): LoadedResponse[] => {
  return entries.map((entry) => {
    if (entry.loaded === LoadedResponse.OK) return entry.loaded;

    const findTask = loadEntries.find(
      (loadEntry) =>
        loadEntry.date === entry.date && loadEntry.task === entry.name
    );

    return findTask ? findTask.load : LoadedResponse.EMPTY;
  });
};
