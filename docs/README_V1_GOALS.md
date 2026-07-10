# Playwright Excel Reporter (V1)

## Vision

Build a Playwright reporter that compiles an entire test run into **one self-contained Excel (.xlsx) file**.

Unlike Playwright HTML Report, this report should:

- require no web server
- require no extracted assets
- require no trace.zip
- be easy to share through email/chat
- open directly in Microsoft Excel
- remain compatible with Google Sheets as much as possible

The report should feel like a **database explorer** rather than an exported HTML page.

---

# Non Goals (V1)

V1 intentionally does NOT support:

- Video recording
- trace.zip viewer
- DOM snapshot replay
- Accessibility snapshot
- Timeline animation
- Live browser replay
- Editing report contents
- Macros (VBA)
- Office Scripts

---

# Core Principles

## Single File

Everything is stored inside one `.xlsx`.

No external folders.

No external images.

No external HTML.

---

## Read Only

The workbook is a compiled artifact.

Users inspect data.

Users do not edit data.

Database sheets are hidden and protected.

---

## Google Sheets Friendly

Avoid Excel-only features whenever possible.

Allowed:

- Hyperlinks
- Floating images
- Hidden sheets
- Frozen panes
- Auto filters
- Conditional formatting
- Cell comments/notes

Avoid:

- VBA
- ActiveX
- Office Scripts
- External links
- OLE objects

---

# Workbook Layout

Visible sheets

1. Dashboard
2. Inspector

Hidden sheets

1. _db
2. _images

Total: 4 sheets

---

# Dashboard

Purpose:

Landing page.

Contains:

- Report summary
- Pass / Fail counts
- Duration
- Browser summary
- Failed tests
- Slowest tests
- Quick hyperlinks to Inspector

---

# Inspector

Main working area.

Contains:

## Filters

- Status
- Browser
- Project
- Search

## Test List

Shows every test.

Columns:

- Status
- Name
- Browser
- Duration
- Retry
- Tags

Selecting a test opens its details.

---

## Action Timeline

Shows Playwright actions.

Examples

- goto()
- click()
- fill()
- expect()
- locator()

Each action may contain

- screenshot
- network
- console
- error

---

## Detail Panel

Displays selected action.

Contains

- Properties
- Screenshot
- Console
- Network Request
- Network Response
- Stack Trace

---

# Database

Hidden protected sheet.

Stores normalized relational data.

Entities

- Test
- Action
- Request
- Header
- Body
- Console
- Chunk
- Image
- Metadata

Each entity owns a unique ID.

Relationships are based on IDs.

Never reference row numbers.

---

# Images

Dedicated hidden sheet.

Contains floating images only.

Requirements

- Floating images
- JPEG format
- Anchored to cells
- Hyperlink navigation

---

# Network

Network is a first-class citizen.

Each request stores

- Method
- URL
- Host
- Path
- Status
- Duration
- Request Headers
- Response Headers
- Request Body
- Response Body

Bodies larger than Excel cell limits are chunked.

---

# Chunk System

Excel cell limit:

32767 characters

Large values are automatically split.

Example

Chunk 1
Chunk 2
Chunk 3

Used for

- JSON
- HTML
- Console
- Stack traces

---

# Screenshot Policy

V1 stores screenshots only when available.

Preferred format:

JPEG

Reasons

- Excellent compatibility
- Smaller workbook
- Supported by Excel
- Supported by Google Sheets

---

# Protection

Database sheets

- Hidden
- Protected

Visible sheets

Only filter/search cells remain editable.

Everything else is locked.

---

# Compiler Philosophy

Playwright Results

↓

Normalize

↓

Compile

↓

Optimize

↓

Excel Workbook

Workbook is the final artifact.

---

# V1 Success Criteria

- Single .xlsx output
- No external assets
- No trace.zip
- No HTML
- Opens in Excel
- Imports into Google Sheets
- Can inspect failed tests
- Can inspect screenshots
- Can inspect network requests
- Can inspect request/response bodies
- Can inspect console logs
- Searchable
- Filterable
- Read-only
- Stable schema

---

# Out of Scope

These may be implemented in V2+

- Report merging
- Historical comparison
- Diff reports
- Timeline visualization
- Flame graph
- Performance charts
- API statistics
- Duplicate detection
- Image deduplication
- Body deduplication
- Compression pipeline
- Streaming compiler
- SQLite intermediate format
- Plugin ecosystem

---

# Design Philosophy

This project is **not** trying to recreate Playwright Trace Viewer.

Instead, it aims to build an **offline investigation workbook** that QA engineers can easily share, archive, search, and inspect using standard spreadsheet software.