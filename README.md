# Dice Game (Next.js + TypeScript + Material UI)

A simple dice game where you guess whether a random number will be **over** or **under** a chosen threshold.

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Material UI (MUI)**

## Game Rules / Acceptance Criteria

- **[Threshold input]** You can choose a number (threshold) that the dice result should be greater or lower than.
- **[Over / Under]** You can select whether the result must be **Over** or **Under** the threshold.
- **[Play]** Press **PLAY** to roll the dice.
- **[Result range]** The game generates a number from **1 to 100**.
- **[Win / Lose]** If the result satisfies the chosen condition, a success message/icon is shown; otherwise an error message/icon is shown.
- **[History]** Each game result is stored in an in-memory history list.
- **[Max history size]** History is limited to **10 items** (newest first).

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

- http://localhost:3000

## Notes

- The main UI/logic lives in `src/app/page.tsx`.
- The app uses Roboto via `next/font/google` and MUI ThemeProvider.
