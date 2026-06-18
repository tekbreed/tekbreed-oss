<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { ref, onMounted, onUnmounted } from "vue";
import AskAiBar from "./AskAiBar.vue";
import HeroVisual from "./HeroVisual.vue";
import SidebarBrand from "./SidebarBrand.vue";

const { Layout } = DefaultTheme;

const activeMode = ref(0);

const handleScroll = () => {
  if (typeof window !== "undefined") {
    if (window.scrollY > 0) {
      document.documentElement.classList.add("has-scrolled");
    } else {
      document.documentElement.classList.remove("has-scrolled");
    }
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  if (typeof document !== "undefined") {
    document.documentElement.classList.remove("has-scrolled");
  }
});

const modes = [
	{
		label: "Local",
		code: `import { Tekmemo } from "@tekbreed/tekmemo";

const memo = new Tekmemo({
  mode: "local",
  rootDir: "./.tekmemo",
  projectId: "my-app",
});`,
	},
	{
		label: "Cloud",
		code: `import { Tekmemo } from "@tekbreed/tekmemo";

const memo = new Tekmemo({
  mode: "cloud",
  cloud: {
    baseUrl: process.env.TEKMEMO_CLOUD_URL!,
    apiKey: process.env.TEKMEMO_API_KEY!,
  },
});`,
	},
	{
		label: "Hybrid",
		code: `import { Tekmemo } from "@tekbreed/tekmemo";

const memo = new Tekmemo({
  mode: "hybrid",
  rootDir: "./.tekmemo",
  cloud: {
    baseUrl: process.env.TEKMEMO_CLOUD_URL!,
    apiKey: process.env.TEKMEMO_API_KEY!,
  },
  readPolicy: "local-first",
  writePolicy: "local-first",
});`,
	},
];
</script>

<template>
  <Layout>
    <template #layout-top>
      <div class="alpha-announcement-bar">
        <span class="alpha-badge">Alpha</span>
        <span class="alpha-text">
          TekMemo Cloud is in early access.
          <a href="https://memo.tekbreed.com" class="alpha-link" target="_blank" rel="noopener noreferrer">Join the waitlist →</a>
        </span>
      </div>
    </template>

    <template #sidebar-nav-before>
      <SidebarBrand />
    </template>

    <template #doc-before>
      <AskAiBar />
    </template>

    <template #home-hero-image>
      <div class="hero-visual-container">
        <HeroVisual />
      </div>
    </template>

    <template #home-hero-after>
      <div class="home-custom-sections">
        <section class="credibility-section">
          <div class="credibility-container">
            <div class="credibility-row">
              <p class="compat-line">
                Works with <span class="compat-tool">Claude Code</span>
                <span class="compat-sep">·</span>
                <span class="compat-tool">Cursor</span>
                <span class="compat-sep">·</span>
                <span class="compat-tool">Codex</span>
                <span class="compat-sep">·</span>
                <span class="compat-tool">Opencode</span>
                <span class="compat-sep">·</span>
                <span class="compat-tool">any MCP client</span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </template>

    <template #home-features-after>
      <div class="home-custom-sections">
        <section class="problem-section">
          <div class="container">
            <h2>Every new session starts from zero.</h2>
            <p>
              You walk your agent through the auth system. It gets it. Next session — blank stare.
              You paste the architecture doc again, and it ships code that contradicts last week's
              decision. It has no memory of what you chose.
            </p>
          </div>
        </section>

        <section class="how-it-works-section">
          <div class="container">
            <h2>Three commands. Your agent remembers.</h2>
            <div class="steps">
              <div class="step">
                <span class="step-number">1</span>
                <div class="step-content">
                  <h3>Install</h3>
                  <div class="terminal-mockup">
                    <div class="terminal-header">
                      <span class="terminal-dot red"></span>
                      <span class="terminal-dot yellow"></span>
                      <span class="terminal-dot green"></span>
                    </div>
                    <div class="terminal-content">
                      <span class="terminal-prompt">$</span> npm install -D @tekbreed/tekmemo-cli
                    </div>
                  </div>
                </div>
              </div>
              <div class="step">
                <span class="step-number">2</span>
                <div class="step-content">
                  <h3>Initialize</h3>
                  <div class="terminal-mockup">
                    <div class="terminal-header">
                      <span class="terminal-dot red"></span>
                      <span class="terminal-dot yellow"></span>
                      <span class="terminal-dot green"></span>
                    </div>
                    <div class="terminal-content">
                      <span class="terminal-prompt">$</span> npx tekmemo init<br />
                      <span class="terminal-success">✓ Created .tekmemo/ with core memory, notes, recall indexes, and graph files.</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="step">
                <span class="step-number">3</span>
                <div class="step-content">
                  <h3>Record</h3>
                  <div class="terminal-mockup">
                    <div class="terminal-header">
                      <span class="terminal-dot red"></span>
                      <span class="terminal-dot yellow"></span>
                      <span class="terminal-dot green"></span>
                    </div>
                    <div class="terminal-content">
                      <span class="terminal-prompt">$</span> npx tekmemo remember "Auth uses JWT with refresh rotation" --tag auth<br />
                      <span class="terminal-success">✓ Saved to core memory.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p class="result-text">
              Next session, your agent already knows. No repeating yourself. No contradictions. No "what were we working on again?"
            </p>
          </div>
        </section>

        <section class="feature-showcase">
          <div class="showcase-container">
            <div class="feature-showcase-item">
              <div class="feature-showcase-content">
                <h3>Memory you can read</h3>
                <p>
                  Every decision, convention, and note sits in plain text under
                  <code>.tekmemo/</code>. Open it in your editor. Diff it in review. Commit it with
                  your code.
                </p>
                <a href="/packages/tekmemo/file-first-memory" class="showcase-link">
                  Learn about file-first memory →
                </a>
              </div>
              <div class="feature-showcase-visual">
                <div class="file-tree-mockup">
                  <div class="file-tree-header">.tekmemo/</div>
                  <div class="file-tree-body">
                    <div class="file-tree-item indent-1">manifest.json</div>
                    <div class="file-tree-item indent-1 folder">memory/</div>
                    <div class="file-tree-item indent-2">core.md</div>
                    <div class="file-tree-item indent-2">notes.md</div>
                    <div class="file-tree-item indent-1 folder">events/</div>
                    <div class="file-tree-item indent-2">memory-events.jsonl</div>
                    <div class="file-tree-item indent-2">conversations.jsonl</div>
                    <div class="file-tree-item indent-1 folder">indexes/</div>
                    <div class="file-tree-item indent-2">chunks.jsonl</div>
                    <div class="file-tree-item indent-1 folder">graph/</div>
                    <div class="file-tree-item indent-2">nodes.jsonl</div>
                    <div class="file-tree-item indent-2">edges.jsonl</div>
                    <div class="file-tree-item indent-1 folder">snapshots/</div>
                    <div class="file-tree-item indent-2">snapshots.jsonl</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="feature-showcase-item reverse">
              <div class="feature-showcase-content">
                <h3>Recall that fetches itself</h3>
                <p>
                  Stop scrolling through old prompts. TekMemo indexes your memory and returns the
                  right fragment for the task — semantically, not by keyword.
                </p>
                <a href="/packages/tekmemo/architecture/indexing-recall" class="showcase-link">
                  See how recall works →
                </a>
              </div>
              <div class="feature-showcase-visual">
                <div class="recall-mockup">
                  <div class="recall-query">
                    <span class="recall-query-label">Query</span>
                    <span class="recall-query-text">"How does auth work?"</span>
                  </div>
                  <div class="recall-results">
                    <div class="recall-result">
                      <span class="recall-score">0.94</span>
                      <div class="recall-result-body">
                        <span class="recall-result-title">core.md · Auth decisions</span>
                        <span class="recall-result-snippet"
                          >JWT with refresh rotation. Access tokens expire in 15min…</span
                        >
                      </div>
                    </div>
                    <div class="recall-result">
                      <span class="recall-score">0.87</span>
                      <div class="recall-result-body">
                        <span class="recall-result-title">notes.md · Auth flow notes</span>
                        <span class="recall-result-snippet"
                          >Token validation middleware checks expiry and signature…</span
                        >
                      </div>
                    </div>
                    <div class="recall-result">
                      <span class="recall-score">0.71</span>
                      <div class="recall-result-body">
                        <span class="recall-result-title">conversations.jsonl · Session 42</span>
                        <span class="recall-result-snippet"
                          >User decided to switch from session-based to JWT auth…</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="feature-showcase-item">
              <div class="feature-showcase-content">
                <h3>One API, three modes</h3>
                <p>
                  Local mode works offline. Cloud mode adds sync and hosted search. Hybrid gives you
                  both. Switch with one flag — your code stays the same.
                </p>
                <a href="/packages/tekmemo/cloud-client" class="showcase-link">
                  Explore cloud client →
                </a>
              </div>
              <div class="feature-showcase-visual">
                <div class="mode-toggle-mockup">
                  <div class="mode-toggle-buttons">
                    <button
                      v-for="(m, i) in modes"
                      :key="m.label"
                      :class="['mode-toggle-btn', { active: activeMode === i }]"
                      type="button"
                      @click="activeMode = i"
                    >
                      {{ m.label }}
                    </button>
                  </div>
                  <div class="mode-toggle-code">
                    <pre><code>{{ modes[activeMode].code }}</code></pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="audience-section">
          <div class="container">
            <h2>Built for how you work</h2>
            <div class="audience-grid">
              <div class="audience-card">
                <h3>Building AI apps</h3>
                <p>
                  Give your apps durable memory. Import <code>@tekbreed/tekmemo</code>. Same API
                  whether memory lives in local files, cloud, or both. AI SDK tools ship in the box.
                </p>
                <a href="/api/tekmemo/" class="audience-link">See the API reference →</a>
              </div>
              <div class="audience-card">
                <h3>Using a coding agent</h3>
                <p>
                  Your coding agent finally remembers your project. Install the MCP server, add one
                  config block, and your agent gets project context every session — automatically.
                </p>
                <a href="/packages/mcp/client-setup" class="audience-link">Connect your agent →</a>
              </div>
            </div>
          </div>
        </section>

        <section class="comparison-section">
          <div class="container">
            <h2>Why TekMemo over hosted memory tools?</h2>
            <p>
              Most memory tools hide your data in a dashboard you can't inspect. TekMemo stores
              everything as plain text and JSON in your project's <code>.tekmemo/</code> directory.
            </p>
            <div class="comparison-table-wrapper">
              <table class="comparison-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>TekMemo</th>
                    <th>Hosted Memory Tools</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Where memory lives</td>
                    <td>Plain files in your repo</td>
                    <td>Locked in a remote dashboard</td>
                  </tr>
                  <tr>
                    <td>Inspect &amp; edit</td>
                    <td>Any text editor, any diff tool</td>
                    <td>Vendor UI only</td>
                  </tr>
                  <tr>
                    <td>Version control</td>
                    <td>Git-tracked with your code</td>
                    <td>Separate system (if at all)</td>
                  </tr>
                  <tr>
                    <td>Ownership</td>
                    <td>You own every byte</td>
                    <td>Vendor-dependent</td>
                  </tr>
                  <tr>
                    <td>Offline support</td>
                    <td>Full offline by default</td>
                    <td>Requires internet connection</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section class="bottom-cta-section">
          <div class="container">
            <p class="oss-badge">MIT Licensed</p>
            <h2>One command. Your agent never forgets.</h2>
            <div class="code-snippet large">
              <code>npx tekmemo init</code>
            </div>
            <div class="cta-buttons">
              <a href="/packages/tekmemo/getting-started" class="cta-button primary">Read the Quick Start →</a>
            </div>
            <a href="https://github.com/tekbreed/tekbreed-oss" class="bottom-cta-link">
              View on GitHub
            </a>
          </div>
        </section>
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.container {
  max-width: 768px;
  margin: 0 auto;
  padding: 0 24px;
}

.hero-visual-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Credibility Section */
.credibility-section {
  padding: 32px 24px 24px;
  margin-top: 48px;
  margin-bottom: 40px;
  border-top: 1px solid var(--vp-c-border);
}

.credibility-container {
  max-width: 720px;
  margin: 0 auto;
}

.credibility-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.compat-line {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  margin: 0;
  white-space: nowrap;
}

.compat-tool {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.compat-sep {
  color: var(--vp-c-text-3);
  margin: 0 4px;
}

.alpha-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 8px;
  background: var(--vp-c-brand-soft);
  border: 1px solid var(--vp-c-brand-1);
}

.alpha-box-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-brand-1);
  flex-shrink: 0;
}

.alpha-box-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin: 0;
  white-space: nowrap;
}

.alpha-box-link {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  margin-left: 2px;
}

.alpha-box-link:hover {
  text-decoration: underline;
  color: var(--vp-c-brand-2);
}

@media (max-width: 640px) {
  .credibility-row {
    flex-direction: column;
    gap: 12px;
  }

  .alpha-box-text {
    white-space: normal;
  }
}

/* Problem Section */
.problem-section {
  padding: 72px 0 96px 0;
}

.problem-section h2 {
  font-size: 28px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.3;
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}

.problem-section p {
  font-size: 17px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

/* How It Works */
.how-it-works-section {
  padding: 96px 0;
}

.how-it-works-section h2 {
  font-size: 28px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.3;
  letter-spacing: -0.02em;
  margin-bottom: 48px;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.step {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.step-number {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
  font-weight: 700;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-content {
  flex: 1;
  min-width: 0;
}

.step-content h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 10px;
}

.step-content p {
  font-size: 15px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-top: 10px;
}

.step-content p code {
  background: var(--vp-c-bg-soft);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}

.code-snippet {
  background: var(--vp-code-block-bg);
  border-radius: 8px;
  padding: 12px 16px;
  font-family: var(--vp-font-family-mono);
  font-size: 13.5px;
  overflow-x: auto;
  line-height: 1.6;
}

.code-snippet.large {
  padding: 16px 20px;
  font-size: 15px;
}

.result-text {
  margin-top: 40px;
  font-size: 17px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

/* Feature Showcase */
.showcase-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 64px 24px;
}

.feature-showcase-item {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
  margin-bottom: 96px;
}

.feature-showcase-item:last-child {
  margin-bottom: 0;
}

.feature-showcase-item.reverse .feature-showcase-visual {
  order: -1;
}

.feature-showcase-content h3 {
  font-size: 28px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 16px;
  line-height: 1.2;
}

.feature-showcase-content p {
  font-size: 17px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 24px;
}

.feature-showcase-content p code {
  background: var(--vp-c-bg-soft);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 14px;
}

.showcase-link {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.showcase-link:hover {
  text-decoration: underline;
}

/* File Tree Mockup */
.file-tree-mockup {
  background: var(--vp-code-block-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  overflow: hidden;
}

.file-tree-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--vp-c-border);
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.file-tree-body {
  padding: 12px 0;
}

.file-tree-item {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  color: var(--vp-c-text-2);
  padding: 3px 16px;
  line-height: 1.7;
}

.file-tree-item.indent-1 {
  padding-left: 32px;
}

.file-tree-item.indent-2 {
  padding-left: 52px;
}

.file-tree-item.folder {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

/* Recall Mockup */
.recall-mockup {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  overflow: hidden;
}

.recall-query {
  padding: 14px 16px;
  border-bottom: 1px solid var(--vp-c-border);
  display: flex;
  align-items: center;
  gap: 10px;
}

.recall-query-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}

.recall-query-text {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  color: var(--vp-c-text-1);
}

.recall-results {
  padding: 8px 0;
}

.recall-result {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--vp-c-border);
}

.recall-result:last-child {
  border-bottom: none;
}

.recall-score {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  flex-shrink: 0;
  min-width: 36px;
}

.recall-result-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.recall-result-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.recall-result-snippet {
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

/* Mode Toggle Mockup */
.mode-toggle-mockup {
  background: var(--vp-code-block-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  overflow: hidden;
}

.mode-toggle-buttons {
  display: flex;
  gap: 4px;
  padding: 8px;
  border-bottom: 1px solid var(--vp-c-border);
}

.mode-toggle-btn {
  padding: 6px 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  background: transparent;
  color: var(--vp-c-text-2);
  transition: background 0.2s, color 0.2s;
}

.mode-toggle-btn:hover {
  color: var(--vp-c-text-1);
}

.mode-toggle-btn.active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.mode-toggle-code {
  padding: 20px;
  overflow-x: auto;
}

.mode-toggle-code pre {
  margin: 0;
}

.mode-toggle-code code {
  font-family: var(--vp-font-family-mono);
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
}

/* Audience Section */
.audience-section {
  padding: 0 0 96px 0;
}

.audience-section h2 {
  font-size: 28px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.3;
  letter-spacing: -0.02em;
  margin-bottom: 36px;
}

.audience-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.audience-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 32px;
}

.audience-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 14px;
}

.audience-card p {
  font-size: 15px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin-bottom: 20px;
}

.audience-card p code {
  background: var(--vp-c-bg);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}

.audience-link {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.audience-link:hover {
  text-decoration: underline;
}

/* Comparison Section */
.comparison-section {
  padding: 0 0 96px 0;
}

.comparison-section h2 {
  font-size: 28px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.3;
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}

.comparison-section > .container > p {
  font-size: 17px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin-bottom: 20px;
}

.comparison-section > .container > p code {
  background: var(--vp-c-bg-soft);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}

.comparison-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.comparison-list li {
  position: relative;
  padding-left: 28px;
  margin-bottom: 12px;
  font-size: 15px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.comparison-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--vp-c-brand-1);
  font-weight: 700;
  font-size: 16px;
}

/* Stats Section */
.stats-section {
  padding: 64px 0;
  border-top: 1px solid var(--vp-c-border);
  border-bottom: 1px solid var(--vp-c-border);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-number {
  font-size: 36px;
  font-weight: 800;
  color: var(--vp-c-brand-1);
  line-height: 1;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
}

.stat-label-primary {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.3;
}

.stat-label-secondary {
  font-size: 13px;
  font-weight: 400;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}

/* Bottom CTA */
.bottom-cta-section {
  padding: 0 0 96px 0;
  text-align: center;
  border-top: 1px solid var(--vp-c-border);
  padding-top: 80px;
}

.bottom-cta-section .oss-badge {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin-bottom: 16px;
}

.bottom-cta-section h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.3;
  letter-spacing: -0.02em;
  margin-bottom: 24px;
}

.bottom-cta-section .code-snippet {
  display: inline-block;
  margin-bottom: 24px;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}

.cta-button {
  display: inline-block;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.cta-button.primary {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
}

.cta-button.primary:hover {
  background: var(--vp-c-brand-2);
}

.cta-button.secondary {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-border);
}

.cta-button.secondary:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.bottom-cta-link {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-decoration: none;
}

.bottom-cta-link:hover {
  color: var(--vp-c-brand-1);
}

/* Responsive */
@media (max-width: 768px) {
  .feature-showcase-item {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .feature-showcase-item.reverse .feature-showcase-visual {
    order: 0;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media (max-width: 640px) {
  .audience-grid {
    grid-template-columns: 1fr;
  }

  .step {
    flex-direction: column;
    gap: 12px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
