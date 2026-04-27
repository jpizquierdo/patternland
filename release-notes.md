## v0.0.7

### Features
- **Pattern detail view** — dedicated page at `/patterns/:id` with a large image, full metadata grid (brand, version, for-who, category, difficulty stars, fabric, external URL), and a file download grid for all 7 file variants; pattern titles in the list are now clickable links to the detail page; owner/admin actions (add files, edit, delete) available directly from the detail page (#55)
- **Icon resize & WebP conversion** — uploaded pattern icons are automatically resized and converted to WebP on the backend, reducing storage and transfer size (#54)

### Dependency updates

**Backend**
- pytest `9.0.3` — fixes CVE-2025-71176 (tmpdir privilege escalation) (#60)
- python-dotenv `1.2.2` (#57)

**Frontend**
- yaml `2.8.3` / `1.10.3` — fixes CVE-2026-33532 (stack overflow via deeply nested YAML) (#59)
- postcss `8.5.12` (#56)
- i18next-http-backend `3.0.5` (#58)

### Documentation
- Rewrote README with project description, tech stack table, quick start guide, configuration reference, project structure, and links to development and deployment docs (#61)
