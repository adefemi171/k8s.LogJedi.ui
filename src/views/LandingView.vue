<script setup lang="ts">
import { RouterLink } from 'vue-router'

const mainAppUrl = 'https://github.com/adefemi171/k8s.LogJedi'
</script>

<template>
  <div class="page">
    <section class="hero" aria-label="Hero">
      <div class="hero-media" aria-hidden="true">
        <img src="/k8s_jedi.png" alt="" class="hero-art" />
        <div class="hero-veil" />
      </div>

      <div class="hero-copy">
        <p class="brand-mark">k8s LogJedi</p>
        <h1>Failures, read. Fixes, written.</h1>
        <p class="support">
          Your AI SRE sidekick watches CrashLoops and ImagePulls, redacts secrets, and returns a clear root cause—plus a
          patch when it’s safe.
        </p>
        <div class="cta-row">
          <RouterLink to="/console" class="btn btn-primary">Open console</RouterLink>
          <a :href="mainAppUrl" class="btn btn-ghost" target="_blank" rel="noopener">Install from GitHub</a>
        </div>
      </div>
    </section>

    <main class="main">
      <section class="section flow" id="how">
        <h2>How it works</h2>
        <p class="section-lead">One path from signal to suggestion—no dashboard sprawl required.</p>
        <ol class="flow-list">
          <li>
            <span class="step">01</span>
            <div>
              <h3>Detect</h3>
              <p>
                Operator watches Pods, Deployments, Jobs, StatefulSets, DaemonSets, and CronJobs for failure signals.
              </p>
            </div>
          </li>
          <li>
            <span class="step">02</span>
            <div>
              <h3>Collect</h3>
              <p>Events, recent and previous logs, optional Loki/HTTP history—then scrub secrets before egress.</p>
            </div>
          </li>
          <li>
            <span class="step">03</span>
            <div>
              <h3>Analyze</h3>
              <p>FastAPI + Strands LLM service (mock, OpenAI, Bedrock, Gemini, or self-hosted compatible).</p>
            </div>
          </li>
          <li>
            <span class="step">04</span>
            <div>
              <h3>Act</h3>
              <p>
                Manual notify (Slack, Teams, PagerDuty, Opsgenie) or guarded auto-apply with dry-run and rollback.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section class="section install" id="install">
        <h2>Install in minutes</h2>
        <p class="section-lead">
          Helm for clusters you trust. Kind when you want to see a failure turn into an analysis locally.
        </p>

        <div class="install-block">
          <div class="install-meta">
            <h3>Helm</h3>
            <p>Operator + LLM service in one chart.</p>
          </div>
          <pre class="code"><code>helm install logjedi ./charts/logjedi -n logjedi --create-namespace</code></pre>
        </div>

        <div class="install-block">
          <div class="install-meta">
            <h3>Kind (local)</h3>
            <p>Build images, load them, deploy, then break a sample workload.</p>
          </div>
          <pre
            class="code"
          ><code>make dev-full
kubectl -n logjedi port-forward svc/llm-service 8000:8000
# then open the Console and watch /analyses fill in</code></pre>
        </div>
      </section>

      <footer class="footer">
        <p>May the logs be with you.</p>
        <p class="muted">
          <a :href="mainAppUrl" target="_blank" rel="noopener">Operator repo</a>
          ·
          <RouterLink to="/console">Live console</RouterLink>
        </p>
      </footer>
    </main>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
}

.hero {
  position: relative;
  min-height: calc(100vh - 64px);
  display: grid;
  align-items: end;
  overflow: hidden;
  isolation: isolate;
}

.hero-media {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-art {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  filter: saturate(0.85) contrast(1.05);
  animation: drift 10s ease-in-out infinite alternate;
  transform: scale(1.04);
}

.hero-veil {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(5, 10, 16, 0.92) 0%, rgba(5, 10, 16, 0.55) 48%, rgba(5, 10, 16, 0.25) 100%),
    linear-gradient(180deg, rgba(5, 10, 16, 0.15) 0%, rgba(5, 10, 16, 0.85) 78%, var(--bg) 100%);
}

.hero-copy {
  position: relative;
  z-index: 1;
  width: min(var(--max), calc(100% - 2rem));
  margin: 0 auto;
  padding: 4.5rem 0 3.5rem;
  animation: rise 0.8s ease-out both;
}

.brand-mark {
  margin: 0 0 0.75rem;
  font-size: clamp(2.4rem, 7vw, 4.6rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.95;
  color: var(--ink);
  text-shadow: 0 0 40px var(--glow);
}

.hero-copy h1 {
  margin: 0 0 1rem;
  max-width: 14ch;
  font-size: clamp(1.6rem, 3.6vw, 2.4rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: var(--accent-hot);
}

.support {
  margin: 0 0 1.75rem;
  max-width: 38rem;
  color: var(--ink-soft);
  font-size: 1.05rem;
}

.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.25rem;
  border: 1px solid transparent;
  border-radius: var(--radius);
  font-weight: 700;
  letter-spacing: 0.01em;
  text-decoration: none;
  transition:
    transform 0.15s ease,
    background 0.15s ease,
    border-color 0.15s ease;
}

.btn:hover {
  transform: translateY(-1px);
  text-decoration: none;
}

.btn-primary {
  background: var(--accent);
  color: #14100a;
}

.btn-primary:hover {
  background: var(--accent-hot);
  color: #14100a;
}

.btn-ghost {
  background: transparent;
  border-color: rgba(231, 240, 246, 0.28);
  color: var(--ink);
}

.btn-ghost:hover {
  border-color: var(--accent-hot);
  color: var(--accent-hot);
}

.main {
  width: min(var(--max), calc(100% - 2rem));
  margin: 0 auto;
  padding: 1rem 0 4rem;
}

.section {
  padding: 3.5rem 0;
  border-top: 1px solid var(--line);
  animation: rise 0.7s ease-out both;
  animation-delay: 0.15s;
}

.section h2 {
  margin: 0 0 0.5rem;
  font-size: clamp(1.6rem, 3vw, 2rem);
  letter-spacing: -0.03em;
}

.section-lead {
  margin: 0 0 2rem;
  max-width: 40rem;
  color: var(--ink-soft);
}

.flow-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0;
}

.flow-list li {
  display: grid;
  grid-template-columns: 4.5rem 1fr;
  gap: 1rem;
  padding: 1.25rem 0;
  border-top: 1px solid var(--line);
}

.flow-list li:last-child {
  border-bottom: 1px solid var(--line);
}

.step {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  color: var(--accent);
  padding-top: 0.2rem;
  animation: pulse-line 3.2s ease-in-out infinite;
}

.flow-list h3 {
  margin: 0 0 0.35rem;
  font-size: 1.15rem;
}

.flow-list p {
  margin: 0;
  color: var(--ink-soft);
}

.install-block {
  display: grid;
  grid-template-columns: minmax(12rem, 0.7fr) 1.3fr;
  gap: 1rem 1.5rem;
  align-items: start;
  margin-bottom: 1.75rem;
}

.install-meta h3 {
  margin: 0 0 0.35rem;
  color: var(--signal);
  font-size: 1.1rem;
}

.install-meta p {
  margin: 0;
  color: var(--muted);
}

.code {
  margin: 0;
  padding: 1rem 1.1rem;
  overflow-x: auto;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid var(--line);
  border-left: 2px solid var(--accent);
}

.code code {
  font-family: var(--font-mono);
  font-size: 0.84rem;
  color: #c5d7e6;
  white-space: pre;
}

.footer {
  padding-top: 2rem;
  border-top: 1px solid var(--line);
  text-align: center;
}

.footer p {
  margin: 0 0 0.4rem;
}

.muted {
  color: var(--muted);
  font-size: 0.95rem;
}

@media (max-width: 800px) {
  .hero-copy {
    padding: 3rem 0 2.5rem;
  }

  .install-block {
    grid-template-columns: 1fr;
  }

  .hero-art {
    object-position: 70% center;
  }
}
</style>
