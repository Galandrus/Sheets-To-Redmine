import moment from "moment";
import { sheets_v4 as Sheets } from "googleapis";
import { WORK_SHEET_LOAD_CELL } from "./configs";
import { DateTasksType, EntryType, TasksType } from "./types";

export const mapDataFromSheets = (
  data: Sheets.Schema$ValueRange
): EntryType[] => {
  const loadFieldLetter = WORK_SHEET_LOAD_CELL[0];
  let loadFieldNumber = Number(WORK_SHEET_LOAD_CELL[1]);

  return data.values.map(
    (row: string[]): EntryType => ({
      date: row[0],
      issue: row[1],
      name: row[2],
      comment: row[3],
      project: row[4],
      spendTime: row[7],
      loaded: row[8],
      updateField: `${loadFieldLetter}${loadFieldNumber++}`,
    })
  );
};

export const filterLoadedEntries = (entries: EntryType[]) => {
  return entries.filter(
    (entry) => entry.date !== undefined && entry.loaded === undefined
  );
};

export const getTasksPerDey = (filterEntries: EntryType[]) => {
  const entriesPerDay = splitEntriesByDays(filterEntries);
  // console.log(entriesPerDay);

  return Object.keys(entriesPerDay).map((day) =>
    splitEntriesByTask(entriesPerDay[day])
  );
};

const splitEntriesByDays = (entries: EntryType[]) => {
  return entries.reduce(
    (days: DateTasksType, entry: EntryType): DateTasksType => {
      days[entry.date] = (days[entry.date] || []).concat(entry);

      return days;
    },
    {}
  );
};

const splitEntriesByTask = (entries: EntryType[]) => {
  const concatString = " - ";
  return entries.reduce((tasks: TasksType, entry: EntryType): TasksType => {
    const currentTask = tasks[entry.name];

    if (currentTask) {
      const taskSpend = moment(currentTask.spendTime, "hh:mm");
      const newSpend = moment(entry.spendTime, "hh:mm");

      taskSpend
        .add(newSpend.minutes(), "minutes")
        .add(newSpend.hours(), "hours");

      currentTask.spendTime = taskSpend.format("H:mm");

      if (
        entry.comment &&
        !currentTask.comment.split(concatString).includes(entry.comment)
      ) {
        currentTask.comment = currentTask.comment.concat(
          concatString,
          entry.comment
        );
      }

      tasks[entry.name] = currentTask;
    } else {
      tasks[entry.name] = entry;
    }

    return tasks;
  }, {});
};
