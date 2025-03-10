# Event Confirmation System

A full-stack CRUD application for managing event attendees built with Next.js, React Query, and MySQL.

## Features

- View a list of all event attendees
- Add new attendees
- View detailed information about each attendee
- Edit attendee information
- Delete attendees
- Responsive UI built with Shadcn UI components

## Tech Stack

- **Frontend**: Next.js 15, React 19, TanStack Query
- **UI Components**: Shadcn UI (based on Radix UI)
- **Form Handling**: React Hook Form with Zod validation
- **Database**: MySQL
- **API**: Next.js API Routes
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js 18+ and pnpm
- MySQL database

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```
DATABASE_HOST=localhost
DATABASE_USER=your_mysql_username
DATABASE_PASSWORD=your_mysql_password
DATABASE_NAME=event_confirmations
DATABASE_PORT=3306
```

## Database Setup

The application assumes you already have a MySQL database named `event_confirmations` with an `attendees` table that has the following structure:

```sql
CREATE TABLE attendees (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  job_title VARCHAR(100),
  company VARCHAR(100),
  group_size INT NOT NULL,
  dietary_preferences VARCHAR(255),
  additional_comments TEXT,
  confirmation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_email (email),
  INDEX idx_phone_number (phone_number),
  INDEX idx_company (company),
  INDEX idx_confirmation_date (confirmation_date)
);
```

## Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

## Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Build for Production

```bash
pnpm build
pnpm start
```

## API Endpoints

- `GET /api/attendees` - Get all attendees
- `POST /api/attendees` - Create a new attendee
- `GET /api/attendees/[id]` - Get a specific attendee
- `PUT /api/attendees/[id]` - Update a specific attendee
- `DELETE /api/attendees/[id]` - Delete a specific attendee

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - React components
- `/hooks` - Custom React hooks including React Query hooks
- `/lib` - Utility functions, types, and database connection
- `/public` - Static assets

## License

MIT
