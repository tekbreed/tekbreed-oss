/**
 * Config module entry point for the TekMemo CLI.
 *
 * @module config
 */

export type {
	CliRuntimeFlags,
	ResolvedCliRuntimeConfig,
	TekMemoConfigFile,
	TekMemoReadPolicy,
	TekMemoRuntimeMode,
	TekMemoWritePolicy,
} from "./runtime";
export { resolveCliRuntimeConfig, writeDefaultCliConfig } from "./runtime";
