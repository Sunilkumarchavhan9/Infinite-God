# Notes CRUD Assignment (Express + Node + TypeScript + Tailwind)

This project implements the assignment requirements:

- Notes REST API with in-memory storage
- Frontend page to perform CRUD operations
- Button loading state with spinner (`Loader2` from `lucide-react`)

## Assignment Coverage

Implemented endpoints:

- `POST /notes` - create note
- `GET /notes` - get all notes
- `GET /notes/:id` - get note by ID
- `PUT /notes/:id` - update note
- `DELETE /notes/:id` - delete note

Storage type:

- In-memory array (`notes`) in `server.ts`
- Data resets when server restarts

Frontend:

- Form to create/update notes
- Notes list with edit/delete actions
- Note ID visible in each card
- Loading spinner + disabled button behavior for save/delete actions

## Tech Stack

- Node.js + Express (API)
- Next.js (UI)
- TypeScript
- Tailwind CSS
- Lucide React icons

## Project Structure

- `server.ts` - Express server + Notes API routes + in-memory store
- `app/page.tsx` - frontend page for CRUD operations
- `components/Button.tsx` - reusable button with `loading` support
- `app/globals.css` - global and UI styling

## Run Locally

```bash
npm install
npm run dev
```

Open:

- App UI: `http://localhost:3000`
- API (all notes): `http://localhost:3000/notes`

## API Examples

### Create Note

`POST /notes`

```json
{
  "title": "Daily Standup",
  "content": "Completed API routes and testing."
}
```

Example success response:

```json
{
  "id": "uuid",
  "title": "Daily Standup",
  "content": "Completed API routes and testing.",
  "createdAt": "2026-04-01T12:00:00.000Z",
  "updatedAt": "2026-04-01T12:00:00.000Z"
}
```

### Update Note

`PUT /notes/:id`

```json
{
  "title": "Daily Standup - Updated",
  "content": "CRUD verified and loading state verified."
}
```

### Validation Error Example

`POST /notes` with invalid input:

```json
{
  "title": "",
  "content": ""
}
```

Response:

```json
{
  "message": "title and content are required"
}
```

## Frontend Loading State Behavior

`components/Button.tsx` supports:

- `loading` prop (`boolean`)
- centered `Loader2` spinner when loading
- button text hidden when loading
- button disabled while loading
- normal behavior when `loading=false`

## Manual Test Checklist

1. Create note from UI (`POST /notes`)
2. Verify all notes (`GET /notes`)
3. Copy note ID from card and open `GET /notes/:id`
4. Edit note from UI (`PUT /notes/:id`)
5. Delete note from UI (`DELETE /notes/:id`)
6. Verify loading spinner/disabled behavior on save/delete

## Notes

- `GET /notes` is also triggered automatically on page load.
- Since storage is in-memory, restarting dev server clears notes.
