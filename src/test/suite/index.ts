import * as path from "path";
import * as Mocha from "mocha";
import * as glob from "glob";
import { TestRunner, TestRunnerCoreConfig } from "@web/test-runner";
import { groupEnd } from "console";

export function run(): Promise<void> {
  // Create the mocha test
  const testsRoot = path.resolve(__dirname, "..");
  const testrunnerConfig: TestRunnerCoreConfig = {
    rootDir: testsRoot,
    concurrentBrowsers: 1,
    concurrency: 1,

    protocol: "http",
    hostname: "localhost",
    port: 8089,
		browserStartTimeout: 2000,
		testsStartTimeout: 5000,
		testsFinishTimeout: 20000,
		coverageConfig: {
			report: true,
			reportDir: './report'
		},
    browsers: [],
    logger: {
      log: (message) => console.log(message),
      debug: (message) => console.error(message),
      error: (message) => console.error(message),
      warn: (message) => console.log(message),
      group: () => console.log("group"),
      groupEnd: () => console.log("message"),
      logSyntaxError: () => console.log("message"),
    },
    reporters: [],
    watch: false,
  };
  const runner = new TestRunner(testrunnerConfig);

  return new Promise((c, e) => {
    glob("**/**.test.js", { cwd: testsRoot }, (err, files) => {
      if (err) {
        return e(err);
      }

      // Add files to the test suite
      files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

      try {
        // Run the mocha test
        mocha.run((failures) => {
          if (failures > 0) {
            e(new Error(`${failures} tests failed.`));
          } else {
            c();
          }
        });
      } catch (err) {
        console.error(err);
        e(err);
      }
    });
  });
}
