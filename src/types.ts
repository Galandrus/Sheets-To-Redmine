export type EntryType = {
  date: string;
  issue: string;
  name: string;
  comment: string;
  project: string;
  spendTime: any;
  loaded: LoadedResponse;
};

export type DateTasksType = {
  [key: string]: EntryType[];
};

export type TasksType = {
  [key: string]: EntryType;
};

export type LoadByDayType = {
  task: string;
  date: string;
  load: LoadedResponse;
  entryId?: number;
};

export enum LoadedResponse {
  OK = "OK",
  LEFT = "LEFT",
  EMPTY = "",
}

export const WORK_SHEET_NAME = "Agosto";
export const WORK_SHEET_RANGE = "B3:J1000";
export const WORK_SHEET_LOAD_CELL = "J3";

export const REDMINE_URL = "https://test-redmine.snappler-app.com";
