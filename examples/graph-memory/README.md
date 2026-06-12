# Graph memory example

    Create local graph nodes and edges for relationship-aware memory.

    ## What this example demonstrates

    - creates an in-memory graph store
- stores concepts and relationships
- queries neighbors and a path

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
    pnpm --filter @tekbreed/example-tekmemo-graph-memory dev
    ```

    ## Packages used

    ```bash
    pnpm add @tekbreed/tekmemo-graph
    ```

    ## Safety notes

    - Never put `TEKMEMO_API_KEY` in browser-side code.
    - Use `@tekbreed/tekmemo-cloud-client` only from server routes, CLI tools, MCP runtimes, workers, or trusted backend code.
    - Local examples write only to temporary folders or `.tekmemo/` under the selected project root.
