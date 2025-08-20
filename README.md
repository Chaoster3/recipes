# Delish - Recipe Discovery Platform

A full-stack web application for discovering, saving, reviewing, and sharing recipes.

## Overview

Delish enables users to search thousands of recipes, build personal collections, write detailed reviews with multi-criteria ratings, and generate smart shopping lists. The platform features a  voting system for community reviews and social sharing capabilities.

## Tech Stack

**Frontend:** React, Next.js, Tailwind CSS  
**Backend:** Node.js, Express.js  
**Database:** Supabase (PostgreSQL)  
**APIs:** Spoonacular API  
**Deployment:** Vercel  

## Core Functionality

### Recipe Discovery & Search
- Integration with Spoonacular API for recipes with detailed nutritional information and instructions
- Server-side rendering for individual recipe pages with SEO optimization
- Advanced search functionality with real-time results
- Random recipe recommendations for discovery

### User Authentication & Profiles
- Google OAuth integration for Google login option
- Username/password authentication with bcrypt hashing

### Review & Rating System
- Multi-criteria and text review system (taste, presentation, difficulty, overall)
- Community voting with upvote/downvote functionality

### Personal Recipe Management
- Favorites system recipe saving

### Smart Shopping Features
- Intelligent ingredient aggregation from multiple recipes
- Quantity adjustment and serving size calculations
- Print-optimized shopping list generation

### Social Sharing Integration
- Multi-platform sharing (Twitter, WhatsApp, Email)
- Dynamic URL generation for recipe sharing

## Database Schema

```sql
-- Core tables
users - User authentication data
recipes - Cached recipe information from Spoonacular API
reviews - User reviews with multi-criteria ratings  
review_votes - Upvote/downvote tracking with user relationships
favorites - Saved recipe collections
```

## Project Structure

```
├── frontend/                 # Next.js application
│   ├── src/app/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Authentication state management
│   │   ├── utils/            # Helper functions and API calls
│   │   ├── search/           # Recipe search functionality
│   │   ├── reviews/          # Community review system
│   │   ├── favorites/        # Personal recipe collections
│   │   ├── shopping/         # Shopping cart and list generation
│   │   └── recipe/[id]/      # Dynamic recipe pages (SSR)
├── backend/                  # Express.js API server
│   ├── controllers/          # Business logic and data processing
│   ├── routes/               # API endpoint definitions
│   ├── config/               # Database and environment configuration
│   └── api/                  # Server entry point
```

## Setup & Development

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Environment variables
# Backend: DB_URL
# Frontend: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_GOOGLE_CLIENT_ID

# Start development servers
cd backend && npm start      # Port 3001
cd frontend && npm run dev   # Port 3000
```