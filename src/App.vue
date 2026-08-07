<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
const mainAppUrl = 'https://github.com/adefemi171/k8s.LogJedi'
</script>

<template>
  <div class="shell">
    <nav class="nav" aria-label="Primary">
      <RouterLink to="/" class="brand">
        <img src="/k8s_jedi.png" alt="" width="36" height="36" />
        <span>k8s LogJedi</span>
      </RouterLink>
      <div class="nav-links">
        <RouterLink to="/" :class="{ active: route.name === 'landing' }">Home</RouterLink>
        <RouterLink to="/console" :class="{ active: route.name === 'console' }">Console</RouterLink>
        <a :href="mainAppUrl" target="_blank" rel="noopener">GitHub</a>
      </div>
    </nav>
    <RouterView />
  </div>
</template>

<style scoped>
.shell {
  min-height: 100vh;
}

.nav {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1.5rem;
  backdrop-filter: blur(12px);
  background: rgba(7, 16, 24, 0.72);
  border-bottom: 1px solid var(--line);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  color: var(--ink);
  font-weight: 700;
  letter-spacing: -0.02em;
  text-decoration: none;
}

.brand img {
  border-radius: 50%;
  box-shadow: 0 0 0 1px var(--line), 0 0 18px var(--glow);
}

.brand:hover {
  color: var(--accent-hot);
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  font-size: 0.95rem;
}

.nav-links a {
  color: var(--ink-soft);
  text-decoration: none;
  font-weight: 600;
}

.nav-links a:hover,
.nav-links a.active {
  color: var(--accent-hot);
}

@media (max-width: 640px) {
  .nav {
    padding: 0.75rem 1rem;
  }

  .brand span {
    font-size: 0.95rem;
  }

  .nav-links {
    gap: 0.85rem;
    font-size: 0.88rem;
  }
}
</style>
