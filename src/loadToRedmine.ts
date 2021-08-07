import axios from "axios";
import credentials from "./credentials.json";
import { REDMINE_URL } from "./configs";
import { EntryType, LoadByDayType, LoadedResponse, TasksType } from "./types";

const axiosClient = axios.create({
  baseURL: REDMINE_URL,
  headers: {
    "X-Redmine-API-Key": credentials.redmine_api_key,
  },
});

export const entryHourToRedmine = async (
  entry: EntryType
): Promise<{ result: boolean; entryId?: string }> => {
  try {
    const result = await axiosClient.post("/time_entries.json", {
      time_entry: {
        issue_id: entry.issue,
        spent_on: entry.date,
        hours: entry.spendTime,
        comments: entry.comment,
      },
    });

    return { result: true, entryId: result.data.time_entry.id };
  } catch (error) {
    console.log(
      "An error occurred when loaded hours to redmine.",
      "issue",
      entry.issue,
      "name",
      entry.name
    );

    return { result: false };
  }
};

export const loadRedmine = async (
  data: EntryType[]
): Promise<LoadByDayType[]> => {
  const loadedResponses = data.map(async (entry): Promise<LoadByDayType> => {
    let response = {
      task: entry.name,
      date: entry.date,
      load: LoadedResponse.EMPTY,
      entryId: undefined,
    };

    if (!entry.date || !entry.issue) return response;

    if (entry.loaded !== undefined) return { ...response, load: entry.loaded };

    const { result, entryId } = await entryHourToRedmine(entry);
    // const result = Math.random() < 0.5;
    // const entryId = result ? "9999" : undefined;

    result &&
      console.log(
        "Load",
        entry.spendTime,
        "to the task",
        entry.name,
        "on",
        entry.date
      );

    return {
      ...response,
      entryId,
      load: result ? LoadedResponse.OK : LoadedResponse.LEFT,
    };
  });

  return Promise.all(loadedResponses);
};

export const loadHoursToRedmineByDay = async (
  data: TasksType[]
): Promise<LoadByDayType[][]> => {
  const loadResponses = Object.values(data).map(async (dayEntries) => {
    const response = await loadRedmine(Object.values(dayEntries));

    return response;
  });

  return Promise.all(loadResponses);
};
