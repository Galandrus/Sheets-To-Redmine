# **Sheet to Redmine**

This is a script to upload hours in redmine tasks.

## **Dependencies**

To install all the dependencies run the command

```
yarn install
```

## **Run the script**

To run the script and upload all your hours run the command

```
yarn start
```

## **Credentials**

To generate the required variables that you need to use google sheets api you must see [THIS VIDEO](https://www.youtube.com/watch?v=MiPpQzW_ya0&t=2449s)

You need generate the file **./src/credentials.json** and add the following variables

> **client_email** => Google Cloud Platform Service Accounts

> **private_key** => Google Cloud Platform Service Accounts key

> **private_key_id** => Google Cloud Platform Service Accounts key

> **redmine_api_key** => Redmine / Mi Account / API access key

You can see an example in the file **./src/credentials_example.json**

## **Config**

In this file **./src/config.ts** there are the variables to interact with the spreadsheet.

> **WORK_SHEET_NAME** = "Name of the sheet"

> **WORK_SHEET_RANGE** = "Range of cells where the script work"

> **WORK_SHEET_LOAD_CELL** = "First cell to write redmine url"

> **spreadsheetId** = "ID of your spreadsheet"

---

## IMPORTANT

> THIS SCRIPT ONLY WORKS WITH AN SPECIFIC SHEET TEMPLATE.

> YOU CAN SEE THAT TEMPLATE IN THE TEMPLATES OF GOOGLE DRIVE.
