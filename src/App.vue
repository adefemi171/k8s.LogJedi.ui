<script setup lang="ts">
const githubUrl = 'https://github.com/adefemi171/k8s.LogJedi'
</script>

<template>
  <div class="site">
    <header class="header">
      <div class="header-inner">
        <h1 class="logo">k8s LogJedi</h1>
        <p class="tagline">May the logs be with you.</p>
        <a :href="githubUrl" class="cta" target="_blank" rel="noopener">View on GitHub</a>
      </div>
    </header>

    <main class="main">
      <section class="hero">
        <h2>Your AI SRE Jedi</h2>
        <p class="lead">
          Watches your pods, reads the logs, and turns failures into clear fixes—before they become outages.
        </p>
        <p class="sub">
          A production-ready Kubernetes operator that detects failed workloads, collects logs and events,
          and talks to an LLM service for analysis and optional remediation (Slack/Teams, auto or manual apply).
        </p>
      </section>

      <section class="features">
        <h2>What it does</h2>
        <ul class="feature-list">
          <li><strong>Watches</strong> Pods, Deployments, and Jobs for failure signals (CrashLoopBackOff, ImagePullBackOff, OOMKilled, etc.).</li>
          <li><strong>Collects</strong> Kubernetes Events and recent pod logs (with optional historical logs via a pluggable backend).</li>
          <li><strong>Analyzes</strong> via a FastAPI + Strands LLM service—multi-provider support (mock, OpenAI, Bedrock, Gemini).</li>
          <li><strong>Remediates</strong> with auto or manual apply: strategic-merge patches, dry-run, cooldown, and scope limits.</li>
          <li><strong>Notifies</strong> via Slack and Microsoft Teams webhooks when in manual mode.</li>
        </ul>
      </section>

      <section class="architecture">
        <h2>Architecture</h2>
        <div class="arch-grid">
          <div class="arch-card">
            <h3>Operator (Go)</h3>
            <p>controller-runtime; watches resources, collects events and logs, redacts secrets, POSTs to LLM service, applies patch or notifies.</p>
          </div>
          <div class="arch-card">
            <h3>LLM service (Python)</h3>
            <p>FastAPI <code>POST /analyze</code>; Strands agent with structured output; mock or config-driven LLM provider.</p>
          </div>
          <div class="arch-card">
            <h3>Log backend</h3>
            <p>Pluggable: in-cluster K8s API or HTTP/Loki-style for historical logs.</p>
          </div>
          <div class="arch-card">
            <h3>Notifications</h3>
            <p>Slack and Microsoft Teams webhooks for manual review and suggested patches.</p>
          </div>
        </div>
      </section>

      <section class="quickstart">
        <h2>Quick start</h2>

        <h3 class="quickstart-sub">Helm</h3>
        <p>Install the operator and LLM service in one step. Create the namespace (if needed), then install with optional overrides.</p>
        <pre class="code"><code>helm install logjedi ./charts/logjedi -n logjedi --create-namespace</code></pre>
        <p class="muted">Override apply mode or namespaces:</p>
        <pre class="code"><code>helm install logjedi ./charts/logjedi -n logjedi --create-namespace \
  --set operatorConfig.applyMode=auto \
  --set operatorConfig.autoApplyNamespaces=default</code></pre>

        <h3 class="quickstart-sub">Kind (local testing)</h3>
        <p>Start a local cluster, build and load images, then deploy the LLM service and operator. Create a sample failing deployment to trigger the operator.</p>
        <pre class="code"><code>kind create cluster --name logjedi
make docker-build
kind load docker-image logjedi-llm-service:latest --name logjedi
kind load docker-image logjedi-operator:latest --name logjedi
kubectl apply -f llm-service/deploy/
kubectl apply -f operator/config/deploy/
kubectl apply -f operator/config/samples/failing-deployment.yaml</code></pre>
        <p class="muted">See the main repo README for full steps, configuration, and minikube alternatives.</p>
      </section>

      <footer class="footer">
        <a :href="githubUrl" target="_blank" rel="noopener">k8s LogJedi on GitHub</a>
        <span class="muted"> · May the logs be with you.</span>
      </footer>
    </main>
  </div>
</template>

<style scoped>
.site {
  width: 100%;
  min-height: 100vh;
}

.header {
  padding: 4rem 1.5rem 3rem;
  text-align: center;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  border-bottom: 1px solid var(--card-border);
}

.header-inner {
  max-width: 640px;
  margin: 0 auto;
}

.logo {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
  color: #f8fafc;
  letter-spacing: -0.02em;
}

.tagline {
  font-size: 1.25rem;
  color: var(--accent);
  margin: 0 0 1.5rem;
  font-weight: 500;
}

.cta {
  display: inline-block;
  padding: 0.6rem 1.25rem;
  background: var(--accent);
  color: #0f172a;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s, transform 0.1s;
}

.cta:hover {
  background: #4ade80;
  text-decoration: none;
  transform: translateY(-1px);
}

.main {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.hero {
  margin-bottom: 3rem;
}

.hero h2 {
  font-size: 1.75rem;
  color: #f8fafc;
  margin: 0 0 1rem;
}

.lead {
  font-size: 1.15rem;
  color: #e2e8f0;
  margin: 0 0 0.75rem;
}

.sub {
  color: var(--muted);
  margin: 0;
}

.features,
.architecture,
.quickstart {
  margin-bottom: 3rem;
}

.features h2,
.architecture h2,
.quickstart h2 {
  font-size: 1.5rem;
  color: #f8fafc;
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--card-border);
}

.quickstart-sub {
  font-size: 1.15rem;
  color: var(--accent);
  margin: 1.5rem 0 0.5rem;
}

.quickstart-sub:first-of-type {
  margin-top: 0;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  padding: 0.5rem 0;
  padding-left: 1.25rem;
  position: relative;
  color: #cbd5e1;
}

.feature-list li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: var(--accent);
}

.arch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.arch-card {
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: 10px;
  padding: 1.25rem;
}

.arch-card h3 {
  font-size: 1rem;
  color: var(--accent);
  margin: 0 0 0.5rem;
}

.arch-card p {
  font-size: 0.9rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.5;
}

.arch-card code {
  font-size: 0.85em;
  background: #0f172a;
  padding: 0.1em 0.35em;
  border-radius: 4px;
  color: #a5b4fc;
}

.quickstart p {
  color: #cbd5e1;
  margin: 0 0 1rem;
}

.code {
  background: #0f172a;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  overflow-x: auto;
  margin: 0 0 1rem;
}

.code code {
  font-family: ui-monospace, monospace;
  font-size: 0.85rem;
  color: #94a3b8;
  white-space: pre;
}

.muted {
  font-size: 0.9rem;
  color: var(--muted);
  margin: 0;
}

.footer {
  text-align: center;
  padding: 2rem 0 0;
  border-top: 1px solid var(--card-border);
  color: #94a3b8;
  font-size: 0.95rem;
}

.footer .muted {
  color: var(--muted);
}
</style>
