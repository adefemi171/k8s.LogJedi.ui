<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  type Analysis,
  type Report,
  fetchAnalyses,
  fetchHealth,
  fetchReports,
  getApiBase,
  getStoredAuth,
  setStoredAuth,
} from '../api'

const auth = ref(getStoredAuth())
const analyses = ref<Analysis[]>([])
const reports = ref<Report[]>([])
const selectedId = ref<string | null>(null)
const loading = ref(false)
const error = ref('')
const healthOk = ref<boolean | null>(null)
const autoRefresh = ref(true)
const lastFetched = ref<Date | null>(null)

let timer: number | undefined

const selected = computed(() => analyses.value.find((a) => a.analysis_id === selectedId.value) || analyses.value[0] || null)
const selectedReport = computed(() => {
  const id = selected.value?.analysis_id
  if (!id) return null
  return reports.value.find((r) => r.analysis_id === id) || null
})

async function refresh() {
  loading.value = true
  error.value = ''
  try {
    setStoredAuth(auth.value.trim())
    const [a, r] = await Promise.all([fetchAnalyses(50, auth.value.trim()), fetchReports(50, auth.value.trim())])
    analyses.value = a
    reports.value = r
    lastFetched.value = new Date()
    if (!selectedId.value && a[0]?.analysis_id) selectedId.value = a[0].analysis_id || null
    try {
      await fetchHealth()
      healthOk.value = true
    } catch {
      healthOk.value = false
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    healthOk.value = false
  } finally {
    loading.value = false
  }
}

function startTimer() {
  stopTimer()
  if (!autoRefresh.value) return
  timer = window.setInterval(() => {
    void refresh()
  }, 8000)
}

function stopTimer() {
  if (timer !== undefined) {
    window.clearInterval(timer)
    timer = undefined
  }
}

function resourceLabel(item: Analysis | Report | null): string {
  if (!item) return '—'
  return `${item.resource_kind || '?'} ${item.namespace || 'default'}/${item.resource_name || '?'}`
}

function formatTime(value?: string): string {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString()
}

watch(autoRefresh, () => startTimer())

onMounted(() => {
  void refresh()
  startTimer()
})

onUnmounted(stopTimer)
</script>

<template>
  <main class="console">
    <header class="console-header">
      <div>
        <h1>Analysis console</h1>
        <p>
          Live view of LLM <code>/analyses</code> and <code>/reports</code>. Point at a port-forwarded service
          (<code>{{ getApiBase() }}</code>).
        </p>
      </div>
      <div class="status" :data-ok="healthOk === true" :data-bad="healthOk === false">
        <span class="dot" />
        <span v-if="healthOk === true">LLM reachable</span>
        <span v-else-if="healthOk === false">LLM unreachable</span>
        <span v-else>Checking…</span>
      </div>
    </header>

    <section class="controls" aria-label="Connection controls">
      <label class="field">
        <span>Authorization header</span>
        <input v-model="auth" type="password" autocomplete="off" placeholder="Bearer … (leave empty if unset)" />
      </label>
      <label class="toggle">
        <input v-model="autoRefresh" type="checkbox" />
        Auto-refresh
      </label>
      <button type="button" class="btn" :disabled="loading" @click="refresh">
        {{ loading ? 'Refreshing…' : 'Refresh' }}
      </button>
      <p v-if="lastFetched" class="meta">Updated {{ formatTime(lastFetched.toISOString()) }}</p>
    </section>

    <p v-if="error" class="error" role="alert">{{ error }}</p>

    <div class="layout">
      <aside class="list" aria-label="Analyses">
        <h2>Analyses <em>{{ analyses.length }}</em></h2>
        <button
          v-for="item in analyses"
          :key="item.analysis_id || item.timestamp || item.resource_name"
          type="button"
          class="list-item"
          :class="{ active: selected?.analysis_id === item.analysis_id }"
          @click="selectedId = item.analysis_id || null"
        >
          <strong>{{ resourceLabel(item) }}</strong>
          <span class="reason">{{ item.reason || 'unknown reason' }}</span>
          <span class="when">{{ formatTime(item.timestamp) }}</span>
        </button>
        <p v-if="!analyses.length && !loading" class="empty">
          No analyses yet. Deploy a failing workload and wait for the operator to call
          <code>/analyze</code>.
        </p>
      </aside>

      <section class="detail" aria-label="Selected analysis">
        <template v-if="selected">
          <header class="detail-head">
            <h2>{{ resourceLabel(selected) }}</h2>
            <p>{{ formatTime(selected.timestamp) }} · id {{ selected.analysis_id || 'n/a' }}</p>
          </header>

          <div class="blocks">
            <article>
              <h3>Summary</h3>
              <p>{{ selected.summary || '—' }}</p>
            </article>
            <article>
              <h3>Root cause</h3>
              <p>{{ selected.root_cause || '—' }}</p>
            </article>
            <article>
              <h3>Recommendation</h3>
              <p>{{ selected.recommendation || '—' }}</p>
            </article>
            <article v-if="selected.action">
              <h3>Suggested patch</h3>
              <pre>{{ JSON.stringify(selected.action, null, 2) }}</pre>
            </article>
            <article v-else>
              <h3>Suggested patch</h3>
              <p class="muted">None (manual remediation only).</p>
            </article>
            <article v-if="selectedReport?.steps?.length">
              <h3>Report steps</h3>
              <ol class="steps">
                <li v-for="step in selectedReport.steps" :key="`${step.step}-${step.message}`">
                  <span class="n">{{ step.step }}</span>
                  <span>{{ step.message }}</span>
                </li>
              </ol>
            </article>
            <article v-if="selected.usage">
              <h3>Usage</h3>
              <p>
                ~{{ selected.usage.estimated_tokens || 0 }} tokens
                <span v-if="selected.usage.estimated_cost_usd">
                  · ${{ selected.usage.estimated_cost_usd.toFixed(4) }}
                </span>
              </p>
            </article>
          </div>
        </template>
        <p v-else class="empty">Select an analysis to inspect.</p>
      </section>
    </div>
  </main>
</template>

<style scoped>
.console {
  width: min(var(--max), calc(100% - 2rem));
  margin: 0 auto;
  padding: 2rem 0 4rem;
  animation: rise 0.55s ease-out both;
}

.console-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.console-header h1 {
  margin: 0 0 0.4rem;
  font-size: clamp(1.6rem, 3vw, 2.1rem);
  letter-spacing: -0.03em;
}

.console-header p {
  margin: 0;
  color: var(--ink-soft);
  max-width: 42rem;
}

.console-header code {
  font-family: var(--font-mono);
  font-size: 0.85em;
  color: var(--accent-hot);
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.75rem;
  border: 1px solid var(--line);
  background: rgba(0, 0, 0, 0.25);
  font-size: 0.9rem;
  white-space: nowrap;
}

.status .dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: var(--muted);
}

.status[data-ok='true'] .dot {
  background: var(--signal);
  box-shadow: 0 0 10px rgba(62, 207, 142, 0.7);
}

.status[data-bad='true'] .dot {
  background: var(--danger);
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  align-items: end;
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--line);
}

.field {
  display: grid;
  gap: 0.35rem;
  flex: 1 1 18rem;
}

.field span,
.toggle {
  font-size: 0.85rem;
  color: var(--muted);
}

.field input {
  width: 100%;
  padding: 0.7rem 0.8rem;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: rgba(0, 0, 0, 0.35);
  color: var(--ink);
}

.toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding-bottom: 0.55rem;
}

.btn {
  padding: 0.7rem 1.1rem;
  border: 1px solid transparent;
  border-radius: var(--radius);
  background: var(--accent);
  color: #14100a;
  font-weight: 700;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.6;
  cursor: wait;
}

.meta {
  margin: 0;
  color: var(--muted);
  font-size: 0.85rem;
  padding-bottom: 0.55rem;
}

.error {
  padding: 0.85rem 1rem;
  margin: 0 0 1rem;
  border: 1px solid rgba(227, 93, 106, 0.45);
  background: rgba(227, 93, 106, 0.12);
  color: #ffc1c7;
}

.layout {
  display: grid;
  grid-template-columns: minmax(240px, 0.9fr) 1.4fr;
  gap: 1.25rem;
  align-items: start;
}

.list,
.detail {
  min-height: 20rem;
  border: 1px solid var(--line);
  background: rgba(12, 24, 36, 0.55);
}

.list {
  padding: 0.75rem;
}

.list h2,
.detail-head h2 {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

.list h2 em {
  font-style: normal;
  color: var(--accent);
  margin-left: 0.35rem;
}

.list-item {
  display: grid;
  gap: 0.2rem;
  width: 100%;
  text-align: left;
  padding: 0.8rem 0.75rem;
  margin-bottom: 0.4rem;
  border: 1px solid transparent;
  border-radius: var(--radius);
  background: transparent;
  color: var(--ink);
  cursor: pointer;
}

.list-item:hover,
.list-item.active {
  border-color: rgba(212, 160, 23, 0.45);
  background: rgba(212, 160, 23, 0.08);
}

.list-item strong {
  font-size: 0.95rem;
}

.reason {
  color: var(--signal);
  font-family: var(--font-mono);
  font-size: 0.8rem;
}

.when {
  color: var(--muted);
  font-size: 0.78rem;
}

.detail {
  padding: 1.1rem 1.2rem 1.4rem;
}

.detail-head {
  margin-bottom: 1.25rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid var(--line);
}

.detail-head h2 {
  text-transform: none;
  font-size: 1.35rem;
  color: var(--ink);
  letter-spacing: -0.02em;
}

.detail-head p {
  margin: 0.35rem 0 0;
  color: var(--muted);
  font-size: 0.9rem;
}

.blocks {
  display: grid;
  gap: 1.1rem;
}

.blocks h3 {
  margin: 0 0 0.4rem;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
}

.blocks p {
  margin: 0;
  color: var(--ink-soft);
  white-space: pre-wrap;
}

.blocks pre {
  margin: 0;
  padding: 0.85rem;
  overflow: auto;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: #c5d7e6;
}

.steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.55rem;
}

.steps li {
  display: grid;
  grid-template-columns: 1.5rem 1fr;
  gap: 0.55rem;
  color: var(--ink-soft);
  font-size: 0.95rem;
}

.steps .n {
  color: var(--accent);
  font-family: var(--font-mono);
}

.empty,
.muted {
  color: var(--muted);
}

.empty code {
  font-family: var(--font-mono);
  color: var(--accent-hot);
}

@media (max-width: 860px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .console-header {
    flex-direction: column;
  }
}
</style>
