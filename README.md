# Event Confirmation System

A full-stack CRUD application for managing event attendees built with Next.js, React Query, and database support for both MySQL and PostgreSQL.

## Features

- View a list of all event attendees
- Add new attendees
- View detailed information about each attendee
- Edit attendee information
- Delete attendees
- Responsive UI built with Shadcn UI components
- Support for both MySQL and PostgreSQL databases
- Docker support for easy deployment

## Tech Stack

- **Frontend**: Next.js 15, React 19, TanStack Query
- **UI Components**: Shadcn UI (based on Radix UI)
- **Form Handling**: React Hook Form with Zod validation
- **Database**: MySQL or PostgreSQL (configurable)
- **API**: Next.js API Routes
- **Styling**: Tailwind CSS
- **Deployment**: Docker with multi-stage builds

## Prerequisites

For local development:

- Node.js 18+ and pnpm
- MySQL or PostgreSQL database

For Docker deployment:

- Docker

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```
# Database type: 'mysql' or 'postgres'
DATABASE_TYPE=mysql

# Database connection details
DATABASE_HOST=localhost
DATABASE_USER=your_db_username
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=event_confirmations
DATABASE_PORT=3306  # 3306 for MySQL, 5432 for PostgreSQL
```

## Database Setup

The application assumes you already have a database with an `attendees` table that has the following structure:

```sql
CREATE TABLE attendees (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  job_title VARCHAR(100) NOT NULL,
  company VARCHAR(100) NOT NULL,
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

Note: For PostgreSQL, use `SERIAL` instead of `INT NOT NULL AUTO_INCREMENT` for the `id` column.

## Installation

### Local Development

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Docker Deployment

1. Build the Docker image:

```bash
docker build -t event-confirmation-app .
```

2. Run the container:

```bash
docker run -p 3000:3000 \
  -e DATABASE_TYPE=postgres \
  -e DATABASE_HOST=host.docker.internal \
  -e DATABASE_USER=your_db_username \
  -e DATABASE_PASSWORD=your_db_password \
  -e DATABASE_NAME=event_confirmations \
  -e DATABASE_PORT=5432 \
  event-confirmation-app
```

Note: Use `host.docker.internal` to connect to a database running on your host machine. For production, use the actual database host.

## Production Deployment

### Build for Production (without Docker)

```bash
pnpm build
pnpm start
```

### Docker Compose (for production)

Create a `docker-compose.yml` file:

```yaml
version: "3"

services:
  app:
    image: event-confirmation-app
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_TYPE=postgres
      - DATABASE_HOST=db
      - DATABASE_USER=postgres
      - DATABASE_PASSWORD=your_password
      - DATABASE_NAME=event_confirmations
      - DATABASE_PORT=5432
    depends_on:
      - db
    restart: always

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=your_password
      - POSTGRES_DB=event_confirmations
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: always

volumes:
  postgres_data:
```

Run with:

```bash
docker-compose up -d
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
