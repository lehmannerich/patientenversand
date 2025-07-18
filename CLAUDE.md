# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Patientenversand is a privacy-focused portal that enables healthcare providers to securely send medical documents directly to patients. The system is designed for patient self-hosting with a focus on data privacy and DSGVO compliance.

## Key Architecture

- **Frontend**: Vanilla JavaScript with drag-and-drop file upload capabilities
- **Backend**: Vercel serverless functions (Node.js)
- **Storage**: Vercel Blob Storage for file persistence
- **Security**: Currently HTTPS transport encryption; end-to-end encryption implementation planned

## Development Commands

```bash
# Install dependencies
npm install

# Run tests (currently no tests implemented)
npm test
```

## Project Structure

- `/api/` - Serverless API endpoints
  - `upload.js` - Handles file uploads to Vercel Blob Storage
- `/assets/` - Frontend resources (CSS, JS, images)
  - `/js/app.js` - Main upload functionality
  - `/js/config.js` - Client configuration
- `/components/` - Reusable HTML components
- Main HTML pages: `index.html`, `erichlehmann.html` (doctor portal), `compliance.html`

## Current State & Important Notes

1. **Encryption Status**: Files are currently uploaded unencrypted. The encryption implementation is documented in `docs/Encryption TODOs.md` with a detailed roadmap for hybrid cryptography (RSA-OAEP + AES-GCM).

2. **Configuration**: Patient-specific settings are in `assets/js/config.js`:

   - Patient details (name, Arztnummer)
   - Upload settings (max file size: 50MB)
   - Project metadata

3. **File Upload Flow**:
   - Doctor accesses patient's portal URL
   - Files uploaded via drag-and-drop or file selector
   - Files sent to `/api/upload` endpoint
   - Stored in Vercel Blob Storage

## Deployment

This project is designed for Vercel deployment. The API functions in `/api/` directory are automatically deployed as serverless functions.

## Security Roadmap

The project has a comprehensive plan for implementing end-to-end encryption:

- Patient key generation with password-protected keystore
- Hybrid encryption using RSA-OAEP (4096-bit) for key exchange
- AES-GCM (256-bit) for data encryption
- Zero-knowledge architecture where server never sees unencrypted data
