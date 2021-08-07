export type EntryType = {
  date: string;
  issue: string;
  name: string;
  comment: string;
  project: string;
  spendTime: any;
  loaded: string;
  updateField: string;
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
  load: string;
  entryId?: string;
};

export enum LoadedResponse {
  OK = "OK",
  LEFT = "LEFT",
  EMPTY = "",
}
