# Project Structure Rules

This document outlines the basic architectural conventions for this project to ensure consistency and maintainability.

## Directory Structure

### `/components`

- **Purpose**: This directory holds reusable, static HTML snippets.
- **Content**: Each file in this directory should be a self-contained block of HTML that represents a site-wide component (e.g., `header.html`, `footer.html`).
- **Usage**: These components are loaded into the main HTML pages via JavaScript. They should not contain any complex logic, only the structural HTML.

### `/assets`

- **Purpose**: This directory contains all static assets that the browser needs to render the site correctly. It is subdivided by asset type.
- **`/assets/js`**: Contains all client-side JavaScript files. This includes application logic (`app.js`) and the scripts responsible for loading our HTML components (`header.js`, `footer.js`).
- **`/assets/css`**: Contains all stylesheets.
- **`/assets/images`**: Contains all image files.

### `/api`

- **Purpose**: This directory contains serverless functions for Vercel.
- **Content**: Each file is a backend endpoint that can be called from the frontend. For example, `api/upload.js` handles file uploads to Vercel Blob storage.

## Guiding Principle

The core idea is to separate **Structure** (HTML in `/components`), **Presentation** (CSS in `/assets/css`), and **Behavior** (JavaScript in `/assets/js` and `/api`). This makes the project easier to navigate and modify.
