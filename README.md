## Live Demo

🔗 **[View the live project here](https://inventory-app-production-28c4.up.railway.app)**

# Inventory Management Application

A full-stack inventory management system for organizing and tracking movies, built with **Express** and **PostgreSQL** in a bold, brutalist web style.  
Designed with a clean architecture and a relational database at its core, this project emphasizes both functionality and aesthetic identity.

## Project Overview

The application allows users to:
- **Create** new genres, actors, and movies
- **Read** all genres, actors, and movies
- **Update** existing genres, actors, and movies
- **Delete** genres, actors, and movies

It fully implements the **CRUD** (Create, Read, Update, Delete) model for all three entities.

## Database Structure

**Entities & Relations:**
- `genres`
- `movies`
- `actors`
- `movies_genres` (many-to-one relation between movies and genres)
- `movies_actors` (many-to-many relation between movies and actors)

## Features

- Browse genres, actors, and movies through a clean, brutalist interface
- Create, edit, and delete genres, actors, and movies
- Many-to-many relationships between movies and both genres and actors
- Database constraints ensure relational integrity
- Deployed with pre-populated demo data

## Future Improvements
- Admin password protection for destructive actions
- Search bar functionality for genre and actors
- Improved accessibility and responsive design

## Credits

Built as part of [The Odin Project – Node.js Inventory Application](https://www.theodinproject.com/lessons/node-path-nodejs-inventory-application) module.
