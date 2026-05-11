# Local-only TekMemo example

    Create an inspectable `.tekmemo/` memory store without TekMemo Cloud.

    ## What this example demonstrates

    - bootstraps a temporary `.tekmemo/` folder
- writes core memory
- appends a note
- reads memory back through the canonical APIs

    ## Install

    ```bash
    pnpm install
    ```

    ## Configure

    Copy the root examples env template when cloud access is needed:

    ```bash
    cp ../.env.example .env
    ```

    Then set the values relevant to this example.

    ## Run

    ```bash
    pnpm --filter @tekmemo/example-local-only dev
    ```

    ## Packages used

    ```bash
    pnpm add tekmemo @tekmemo/fs
    ```

    ## Safety notes

    - Never put `TEKMEMO_API_KEY` in browser-side code.
    - Use `@tekmemo/cloud-client` only from server routes, CLI tools, MCP runtimes, workers, or trusted backend code.
    - Local examples write only to temporary folders or `.tekmemo/` under the selected project root.
