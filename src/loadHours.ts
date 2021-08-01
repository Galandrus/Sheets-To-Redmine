import axios from "axios";
import credentials from "./credentials.json";
import {
  DateTasksType,
  EntryType,
  LoadByDayType,
  LoadedResponse,
  TasksType,
} from "./types";

const axiosClient = axios.create({
  baseURL: "http://redmine.snappler.com",
  headers: {
    "X-Redmine-API-Key": credentials.redmine_api_key,
  },
});

export const entryHourToRedmine = async (
  entry: EntryType
): Promise<boolean> => {
  try {
    await axiosClient.post("/time_entries", {
      time_entry: {
        issue_id: entry.issue,
        spent_on: entry.date,
        hours: entry.spendTime,
        comments: entry.comment,
      },
    });

    return true;
  } catch (error) {
    console.log("An error occurred when loaded hours to redmine:", error);
    return false;
  }
};

export const loadHours = async (
  data: EntryType[]
): Promise<LoadByDayType[]> => {
  const loadedResponses = data.map(async (entry): Promise<LoadByDayType> => {
    let response = {
      task: entry.name,
      date: entry.date,
      load: LoadedResponse.EMPTY,
    };

    if (!entry.date) return response;
    if (entry.loaded === LoadedResponse.OK)
      return { ...response, load: entry.loaded };

    console.log("Load ", entry.spendTime, "to the task ", entry.name);
    // const response = await entryHourToRedmine(entry);
    const loadResponse = Math.random() < 0.5;

    return {
      ...response,
      load: loadResponse ? LoadedResponse.OK : LoadedResponse.LEFT,
    };
  });

  return Promise.all(loadedResponses);
};

export const loadHoursPerDay = async (
  data: TasksType[]
): Promise<LoadByDayType[][]> => {
  const loadResponses = Object.values(data).map(async (dayEntries) => {
    const response = await loadHours(Object.values(dayEntries));

    return response;
  });

  return Promise.all(loadResponses);
};
