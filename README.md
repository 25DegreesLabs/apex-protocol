# Apex Protocol

Apex Protocol is a remote fitness coaching platform and progressive web application (PWA) designed for athletic development, workout logging, and progress tracking.

## Features

- **Progressive Web App (PWA)**: Installable on mobile devices with support for offline logging and synchronization.
- **Custom Rounds Timer**: Interactive workout timers with customizable intervals, saved configurations, and persistent audio/visual cues.
- **Google Sheets Integration**: Seamless workout and progress tracking synced directly to a coach's Google Sheets dashboard via Apps Script webhooks.
- **Personalized Framework**: Custom nutrition, cooking, and daily motivation (Daily Ignition) systems built-in.

## Structure

- `/app`: The client-side progressive web application (React/Vite).
- `/database`: Local spreadsheet models, generator scripts (`build_sheet.py`), and historical coaching templates.
- `/dev_files`: Project documentation, checklists, and context handoff logs.
- `/scripts`: Helper scripts for data injection and sheet automation.

## Tech Stack

- **Frontend**: Vite, React, Vanilla CSS, PWA Manifest.
- **Backend / Sheets**: Google Apps Script, Python data scripts (openpyxl, pandas).
