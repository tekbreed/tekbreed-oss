# Release Gates

## Package release gate

A package is production-ready only when:

- builds successfully
- typecheck passes
- unit tests pass
- edge-case tests pass
- contract tests pass if adapter
- README quickstart works
- no secrets are stored/logged
- exported API is documented

---

# Cloud beta release gate

Cloud beta is usable only when:

- tenant creation works
- project creation works
- core memory read/update works
- notes work
- API keys work
- recall query works
- usage basics work
- pricing page exists
- support/contact path exists

---

# Launch gate

Public launch is acceptable when:

- OSS repo is public
- docs are public
- cloud beta path exists
- pricing is understandable
- a revenue path exists
- known limitations are honest

---

# Do-not-launch blockers

- cannot create project
- cannot save memory
- API keys broken
- recall consistently broken
- docs do not explain setup
- no contact/revenue path
