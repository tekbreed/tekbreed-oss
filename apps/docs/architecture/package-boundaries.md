# Package boundaries

Understanding how TekMemo packages relate to each other helps you choose the right imports.

## Cloud API transport

Only `@tekbreed/tekmemo-cloud-client` communicates with the TekMemo Cloud API. Other packages delegate to it when cloud access is needed:

- CLI cloud commands use `@tekbreed/tekmemo-cloud-client`.
- MCP cloud runtime uses `@tekbreed/tekmemo-cloud-client`.
- AI SDK cloud tools use `@tekbreed/tekmemo-cloud-client`.

## Provider adapters

Provider adapters (`@tekbreed/tekmemo-openai`, `@tekbreed/tekmemo-voyageai`, `@tekbreed/tekmemo-upstash-vector`) accept credentials from your code. They do not store or manage provider keys.

## Convenience imports

`@tekbreed/tekmemo-adapters` is a convenience package that reexports multiple adapter packages through subpath imports. Use it when you want a single dependency for several integrations, or use the direct packages for a smaller dependency footprint.
