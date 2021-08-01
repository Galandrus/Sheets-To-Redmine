import { google, oauth2_v2 } from "googleapis";
import credentials from "./credentials.json";

const SCOPES = [
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/spreadsheets.readonly",
  "https://spreadsheets.google.com/feeds/",
];

export const authentication = async () => {
  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    keyId: credentials.private_key_id,
    scopes: SCOPES,
  });

  try {
    await auth.authorize();
    console.log("Connected successfully");
  } catch (error) {
    console.log(error);
    throw "Authorization Error";
  }

  return auth;
};
