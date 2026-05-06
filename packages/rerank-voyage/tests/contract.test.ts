import { defineRerankerContractTests } from "@repo/test-utils/contracts";
import { createVoyageReranker } from "../src";
import { createFakeVoyageRerankClient } from "../src/testing";

defineRerankerContractTests({
	name: "VoyageRerank",
	createReranker: () =>
		createVoyageReranker({ client: createFakeVoyageRerankClient() }),
});
