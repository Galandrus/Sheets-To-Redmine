import { sheets_v4 as Sheets } from "googleapis";
import { REDMINE_URL, WORK_SHEET_NAME } from "./configs";
import { EntryType, LoadByDayType, LoadedResponse } from "./types";

export const parseLoadTask = (
  entries: EntryType[],
  loadEntries: LoadByDayType[]
) => {
  return entries.map((entry) => {
    if (entry.loaded !== undefined) return generateHyperlink(entry.loaded);

    const findTask = loadEntries.find(
      (loadEntry) =>
        loadEntry.date === entry.date && loadEntry.task === entry.name
    );

    return findTask?.entryId
      ? generateHyperlink(findTask.entryId)
      : LoadedResponse.EMPTY;
  });
};

export const generateUpdateCells = (
  entries: EntryType[],
  loadEntries: LoadByDayType[]
): Sheets.Schema$ValueRange[] => {
  return entries.map((entry) => {
    const findTask = loadEntries.find(
      (loadEntry) =>
        loadEntry.date === entry.date && loadEntry.task === entry.name
    );

    const loadedField = findTask?.entryId
      ? generateHyperlink(findTask.entryId)
      : LoadedResponse.EMPTY;

    return {
      range: `${WORK_SHEET_NAME}!${entry.updateField}`,
      values: [[loadedField]],
    };
  });
};

const generateHyperlink = (id: string) => {
  const url = `${REDMINE_URL}/time_entries/${id}/edit`;

  return `=HIPERVINCULO("${url}";"${id}")`;
};
