import { google, sheets_v4 as Sheets } from "googleapis";
import { authentication } from "./authentication";
import {
  filterLoadedEntries,
  mapData,
  parseLoadTask,
  parseToColumns,
  splitByDays,
  splitByTask,
} from "./parseEntries";
import { loadHours, loadHoursPerDay } from "./loadHours";
import {
  WORK_SHEET_LOAD_CELL,
  WORK_SHEET_NAME,
  WORK_SHEET_RANGE,
} from "./types";

async function main() {
  const auth = await authentication();

  const spreadsheetId = "101XvczXF6UW3wc2rpnsF7DsfxeTlQ9KUyDQ30yFzoeg";

  const sheets = google.sheets({ version: "v4", auth }).spreadsheets.values;

  const spreadsheets = await sheets.get({
    spreadsheetId,
    range: `${WORK_SHEET_NAME}!${WORK_SHEET_RANGE}`,
  });

  // console.log(mapData(spreadsheets.data));

  const entries = mapData(spreadsheets.data);
  // console.log(entries);

  const filterEntries = filterLoadedEntries(entries);
  const entriesPerDay = splitByDays(filterEntries);
  // console.log(entriesPerDay);

  const tasksPerDay = Object.keys(entriesPerDay).map((day) =>
    splitByTask(filterLoadedEntries(entriesPerDay[day]))
  );

  // console.log(tasksPerDay);

  const loadHours = await loadHoursPerDay(tasksPerDay);
  // console.log(loadHours.flat());

  const addLoadToEntries = parseLoadTask(entries, loadHours.flat());
  console.log(addLoadToEntries);

  // const columnsInputs = parseToColumns(addLoadToEntries);
  // console.log(columnsInputs);

  await sheets.update({
    spreadsheetId,
    range: `${WORK_SHEET_NAME}!${WORK_SHEET_LOAD_CELL}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      majorDimension: "COLUMNS",
      values: [addLoadToEntries],
    },
  });
}

main();
