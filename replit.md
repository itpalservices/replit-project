# CRM Platform

## Overview
This is a full-stack Customer Relationship Management (CRM) platform built with Angular frontend and Node.js/Express backend. The application allows users to manage customer data with features for creating, updating, viewing, and soft-deleting customer records. The system uses a PostgreSQL database for data persistence and follows modern web development practices with TypeScript throughout.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Angular 17 with standalone components architecture
- **UI Library**: Angular Material for consistent design system and components
- **Styling**: SCSS for enhanced CSS capabilities
- **Routing**: Angular Router with lazy loading for performance optimization
- **HTTP Client**: Angular HttpClient for API communication with proxy configuration
- **Development Server**: Configured to run on port 5000 with proxy to backend API

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database Layer**: Raw PostgreSQL queries using node-postgres (pg) driver
- **Schema Management**: SQL-based table creation with automatic initialization
- **API Design**: RESTful endpoints for customer CRUD operations
- **Database Features**: 
  - UUID primary keys for better distributed system compatibility
  - Soft delete functionality using `deleted_at` timestamp
  - Indexed fields (email, status) for query optimization
  - Automatic timestamps for audit trails

### Data Storage
- **Database**: PostgreSQL with connection pooling
- **Schema**: Single `customers` table with comprehensive customer fields
- **Indexing Strategy**: Email and status fields indexed for performance
- **Data Integrity**: NOT NULL constraints on critical fields
- **Audit Trail**: Created and updated timestamps with soft delete capability

### API Structure
The backend exposes RESTful endpoints for customer management:
- GET `/api/customers` - Retrieve active customers
- GET `/api/customers/deleted` - Retrieve soft-deleted customers
- POST `/api/customers` - Create new customer
- PUT `/api/customers/:id` - Update existing customer
- DELETE `/api/customers/:id` - Soft delete customer
- POST `/api/customers/restore/:id` - Restore deleted customer

### Development Workflow
- **Frontend Development**: Angular CLI with hot reload and proxy configuration
- **Backend Development**: Nodemon for automatic server restart
- **Database Migration**: Automatic table creation on server startup
- **API Testing**: CORS enabled for cross-origin development requests

## External Dependencies

### Frontend Dependencies
- **Angular Ecosystem**: Core Angular 17 packages including animations, forms, router, and HTTP client
- **Angular Material**: Complete UI component library with CDK for advanced functionality
- **Angular CDK**: Layout module for responsive design patterns
- **RxJS**: Reactive programming library for handling asynchronous operations
- **TypeScript**: Type-safe development with strict configuration

### Backend Dependencies
- **Express.js**: Web application framework for Node.js
- **PostgreSQL Driver**: `pg` package for database connectivity with connection pooling
- **CORS**: Cross-origin resource sharing middleware for development
- **Drizzle ORM**: Modern TypeScript ORM (configured but not actively used in current implementation)
- **Neon Database**: Serverless PostgreSQL connector for cloud deployment
- **UUID**: Library for generating unique identifiers

### Development Tools
- **Nodemon**: Development server with automatic restart functionality
- **Angular CLI**: Command-line interface for Angular development and build processes
- **TypeScript Compiler**: For type checking and JavaScript compilation
- **Webpack Dev Server**: Integrated development server with hot module replacement