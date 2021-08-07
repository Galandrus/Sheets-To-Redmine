import { google } from "googleapis";
import { authentication } from "./authentication";
import { generateUpdateCells } from "./parseLoadEntries";
import { loadHoursToRedmineByDay } from "./loadToRedmine";
import { WORK_SHEET_NAME, WORK_SHEET_RANGE, spreadsheetId } from "./configs";
import {
  getTasksPerDey,
  mapDataFromSheets,
  filterLoadedEntries,
} from "./parseEntries";

async function main() {
  const auth = await authentication();

  const sheets = google.sheets({ version: "v4", auth }).spreadsheets.values;

  const spreadsheets = await sheets.get({
    spreadsheetId,
    range: `${WORK_SHEET_NAME}!${WORK_SHEET_RANGE}`,
  });

  const entries = mapDataFromSheets(spreadsheets.data);
  // console.log(entries);

  const filterEntries = filterLoadedEntries(entries);
  const tasksPerDay = getTasksPerDey(filterEntries);

  const loadHours = await loadHoursToRedmineByDay(tasksPerDay);
  // console.log(loadHours.flat());

  const updateEntries = generateUpdateCells(filterEntries, loadHours.flat());
  // console.log(updateEntries);

  // Update Google Sheet
  await sheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: "USER_ENTERED",
      data: updateEntries,
    },
  });
}

main();
