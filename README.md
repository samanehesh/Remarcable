# Remarcable Product Search

Remarcable is a full-stack product search and filtering application built with
Django and Next.js. It demonstrates Django model relationships, optimized
QuerySets, JSON endpoints, responsive React components, and separate frontend
and backend deployments.

## Live Application

- Frontend: [remarcable-lac.vercel.app](https://remarcable-lac.vercel.app/)
- Products API: [remarcable-e13c73d78037.herokuapp.com/api/products/](https://remarcable-e13c73d78037.herokuapp.com/api/products/)
- Django Admin: [remarcable-e13c73d78037.herokuapp.com/admin/](https://remarcable-e13c73d78037.herokuapp.com/admin/)

The Next.js frontend is deployed on Vercel. The Django API and PostgreSQL
database are deployed on Heroku.

## Features

- Live, debounced description search without a submit button
- Category filtering
- Multi-tag filtering that requires products to match every selected tag
- Combinable search, category, and tag filters
- Filters synchronized with URL query parameters for refreshable, shareable URLs
- Collapsible filter panel with active-filter count
- Sortable Name and Category columns
- Responsive desktop table and mobile product cards
- Loading spinner, skeleton rows, and skeleton cards
- Friendly API error messages with retry buttons
- Clear filters action
- Django Admin for product, category, and tag management
- Optimized related-object loading with Django QuerySets
- Local SQLite and production PostgreSQL support

## Technology

### Backend

- Python 3.14
- Django 6.1
- PostgreSQL in production
- SQLite for local development
- Gunicorn
- WhiteNoise
- django-cors-headers
- psycopg

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

### Hosting

- Vercel: Next.js frontend
- Heroku: Django API and managed PostgreSQL

## Project Structure

```text
Remarcable/
|-- config/                     # Django project configuration
|-- core/                       # Models, views, URLs, admin, tests, migrations
|   `-- fixtures/products.json  # Sample product data for PostgreSQL
|-- frontend/
|   `-- src/app/
|       |-- components/
|       |   |-- product-filters.tsx
|       |   |-- product-table.tsx
|       |   `-- products-page.tsx
|       |-- types/
|       `-- page.tsx
|-- .python-version
|-- Procfile
|-- db.sqlite3
|-- manage.py
|-- requirements.txt
`-- README.md
```

## Data Model

The application contains three models:

- `Category`: has a unique name and can contain many products.
- `Tag`: has a unique name and can belong to many products.
- `Product`: has a name, description, one category, and zero or more tags.

`Product.category` is a `ForeignKey`. `Product.tags` is a
`ManyToManyField`.

## Local Setup

### Backend

Create and activate a virtual environment.

Windows:

```powershell
py -m venv venv
.\venv\Scripts\Activate.ps1
```

macOS or Linux:

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies, apply migrations, and start Django:

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The local API runs at `http://127.0.0.1:8000`.

To load the included sample fixture into an empty database:

```bash
python manage.py loaddata products
```

### Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000` and uses
`http://127.0.0.1:8000` by default.

To use a different backend, create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://example-backend.herokuapp.com
```

Do not include a trailing slash in the API base URL. The frontend also removes
trailing slashes defensively before constructing endpoint URLs.

## API

### Products

```text
GET /api/products/
```

Supported query parameters:

- `search`: case-insensitive product-description search
- `category`: category ID
- `tags`: repeatable tag ID

Example:

```text
/api/products/?search=portable&category=2&tags=1&tags=5
```

Different filter types are combined. When multiple tags are provided, a product
must have all selected tags.

### Categories

```text
GET /api/categories/
```

### Tags

```text
GET /api/tags/
```

## Filtering Implementation

Description search uses Django's case-insensitive lookup:

```python
products = products.filter(description__icontains=search)
```

Category filtering uses the related category ID:

```python
products = products.filter(category__id=category)
```

Tag filters are chained to require every selected tag:

```python
for tag_id in dict.fromkeys(tags):
    products = products.filter(tags__id=tag_id)
products = products.distinct()
```

The product QuerySet uses `select_related("category")` and
`prefetch_related("tags")` to avoid unnecessary related-object queries.

## Tests and Validation

Run backend checks and tests from the repository root:

```bash
python manage.py check
python manage.py test
python manage.py collectstatic --noinput
```

The backend tests verify single-tag filtering and all-selected-tag matching.

Run frontend validation from `frontend/`:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Deployment

### Heroku Backend

The root `Procfile` defines the release and web processes:

```text
release: python manage.py migrate
web: gunicorn config.wsgi
```

Required Heroku config variables:

```text
SECRET_KEY
DEBUG=False
ALLOWED_HOSTS=<heroku-hostname>
CSRF_TRUSTED_ORIGINS=https://<heroku-hostname>
DATABASE_URL=<provided automatically by Heroku Postgres>
```

Production settings read `DATABASE_URL` through `dj-database-url`. WhiteNoise
serves collected Django and Admin static files.

Load the sample fixture after initializing a new production database:

```bash
heroku run python manage.py loaddata products -a remarcable
```

### Vercel Frontend

Import the repository into Vercel and set the project Root Directory to
`frontend`. Configure:

```text
NEXT_PUBLIC_API_BASE_URL=https://remarcable-e13c73d78037.herokuapp.com
```

After changing a `NEXT_PUBLIC_` variable, redeploy the frontend because its value
is embedded during the Next.js build.

The Vercel production origin must also be present in Django's
`CORS_ALLOWED_ORIGINS`.

## Assumptions

- Each product belongs to exactly one category.
- Products can have zero or more tags.
- Selecting multiple tags requires a product to match all selected tags.
- Search applies to product descriptions and is case-insensitive.
- URL filters are replaced rather than appended to browser history on every
  keystroke.
- SQLite is intended for local development; PostgreSQL is used in production.

## Future Development

- Add backend pagination and paginated table controls
- Add product detail pages
- Add product images, prices, and inventory fields
- Add authenticated product-management workflows outside Django Admin
- Add frontend component and end-to-end tests
- Add structured API error responses and request logging
- Add monitoring and deployment health checks
- Add rate limiting for public API endpoints
- Add CI checks for Django tests, TypeScript, linting, and production builds

## AI Assistance

ChatGPT was used for project-structure guidance, model and QuerySet review,
frontend/backend integration, UI refinement, deployment configuration, testing,
and documentation. All code was reviewed, understood, tested, and adapted during
development.
