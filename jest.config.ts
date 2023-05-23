import type { Config } from "@jest/types";
const jestConfig: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: "node"
};

export default jestConfig;