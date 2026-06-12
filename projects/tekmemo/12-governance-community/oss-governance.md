# OSS Governance and Community Plan

## Strategy

Open source the memory engine and adapters.

Keep the hosted SaaS control plane closed.

---

# Public repo essentials

- README
- LICENSE
- CONTRIBUTING
- SECURITY
- CODE_OF_CONDUCT optional later
- examples
- package docs
- roadmap

---

# Contribution policy

Accept contributions for:

- bug fixes
- tests
- docs
- provider adapters
- examples
- benchmark datasets

Be careful with:

- huge abstractions
- provider-specific logic inside neutral packages
- cloud-only features entering OSS core

---

# Issue labels

Recommended labels:

- `bug`
- `docs`
- `good first issue`
- `adapter`
- `recall`
- `reranking`
- `benchmark`
- `cloud-related`
- `needs-repro`
- `help wanted`

---

# Maintainer rule

Protect the package boundaries.

A useful contribution that breaks architecture should be redirected before it merges.
