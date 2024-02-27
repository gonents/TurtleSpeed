# TurtleSpeed
Top-notch blazing fast as turtle e2e autmation.

[TurtleSpeed](https://en.wikipedia.org/wiki/Turtle) is a Web testing system based on [Playwright](https://github.com/microsoft/playwright/) framework

## Installation
As easy as clone and install.
Clone the repo to your local machine and run command:
```bash
npm install

```

### .env File
If you run tests locally you can create a `.env` file and add the following:
```bash
ZONE=prod
RETRIES=3
```
TurtleSpeed can run locally with or without the file nor any missing environment variables.  


## Usage
```bash
npx playwright test --project=chromium
```

### Run on a specific Browser
Specify the browser name after the `--project` flag.
```bash
npx playwright test --project=Safari
```
```bash
npx playwright test --project='Microsoft Edge'
```
The supported browsers list is located in `playwright.config.ts` file.

### Run in headed (UI) mode
Use the `--headed` flag to run your tests with the ability to visually see the interacts:
```bash
npx playwright test --project=chromium --headed
```

### Run in Debug mode (developers view with Playwright Inspector)
Use the `--ui` flag to run in debugging mode 
```bash
npx playwright test --project=chromium --ui
```

## Connect to your CI (Jenkins)
Config a Jenkins job and use `Jenkinsfile_run_single_shard` file to run TurtleSpeed on Jenkins.
You can run the job on a Jenkins agent or a dedicated docker.
The Jenkins job uploads the run report and tests videos to S3 bucket by default.


## View Test Report
### Local
By default, the report is opened automatically if some of the tests failed, otherwise you can open it with the following command:
```bash
npx playwright show-report
```

### Jenkins
The report is located in the jenkins job page.
Find the link `report` from the list on the left side, or just add `report` in the end of the url (`../{JOB_NAME}/{BUILD_NUMBER}/report`) 