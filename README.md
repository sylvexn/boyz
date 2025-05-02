#Surprise Website

A React TypeScript application for surprising people with a personalized experience including authentication, questionnaires, and success screens.

## Features

- Authentication screen with password protection
- Personalized questionnaires with multiple-choice questions
- Success screen showing personalized content after completing questions
- Animation effects for a modern, engaging experience
- SQLite database for user data and configuration

## Local Development

### Prerequisites

- Node.js 14+
- npm 6+

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up the SQLite database
   ```bash
   npm run db:setup
   ```

4. Start development server
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Technical Stack

- React
- TypeScript
- SQLite (for data storage)
- ExpressJS (for production server)

## Maintenance

- To update user data or questions, modify `groomsmen-data.json` and run `npm run db:setup`
- The SQLite database file is located at `src/db/groomsmen.sqlite` for development and `db/groomsmen.sqlite` in production 