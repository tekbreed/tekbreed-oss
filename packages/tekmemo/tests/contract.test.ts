import { defineMemoryStoreContractTests } from "@repo/test-utils/contracts";
import { InMemoryMemoryStore } from "../src/index.js";

defineMemoryStoreContractTests({
	name: "InMemoryMemoryStore",
	createStore: () => new InMemoryMemoryStore(),
	missingReadBehavior: "throw",
});
