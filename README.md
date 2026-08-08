# Remarcable Django Take-Home Assignment

This project is a simple product search and filtering application built with Django for the backend and Next.js for the frontend.

The application models products, categories, and tags, and allows users to search and filter products using Django QuerySets.

## Features

- Product, Category, and Tag models
- Django Admin for sample data management
- Search products by description
- Filter products by category
- Filter products by one or more tags
- Combine search, category, and tag filters
- Simple Next.js frontend
- Django JSON API endpoints
- Efficient related-object loading with Django QuerySets

## Tech Stack

### Backend

- Python
- Django
- SQLite
- django-cors-headers

### Frontend

- Next.js
- React
- TypeScript

## Project Structure

```text
Remarcable/
├── config/
├── core/
├── frontend/
├── manage.py
├── db.sqlite3
├── requirements.txt
├── .gitignore
└── README.md
```

## Data Models

The application contains three main models.

### Category

A category can contain multiple products.

### Tag

A tag can be associated with multiple products, and each product can have multiple tags.

### Product

Each product:

- Has a name
- Has a description
- Belongs to one category
- Can have multiple tags

The relationship between Product and Category is implemented using a Django `ForeignKey`.

The relationship between Product and Tag is implemented using a Django `ManyToManyField`.

## Sample Data

The SQLite database contains sample data created through the Django Admin interface.

The database includes:

- 5 categories
- 10 tags
- 20 products

## Backend Setup

### 1. Create a virtual environment

On Windows:

```powershell
py -m venv venv
.\venv\Scripts\Activate.ps1
```

On macOS or Linux:

```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Apply migrations

```bash
python manage.py migrate
```

### 4. Run the Django development server

```bash
python manage.py runserver
```

The backend will run at:

```text
http://127.0.0.1:8000
```

## Frontend Setup

Open another terminal and move into the frontend directory:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

Run the Next.js development server:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:3000
```

## How to Use

1. Start both the Django backend and Next.js frontend.
2. Open `http://localhost:3000`.
3. Enter text in the search field to search product descriptions.
4. Select a category to filter products by category.
5. Select one or more tags to filter products by tags.
6. Search, category, and tag filters can be combined.
7. Use the Clear Filters button to reset the results.

## API Endpoints

### Products

```text
GET /api/products/
```

Returns all products.

Supported query parameters:

- `search`
- `category`
- `tags`

Example:

```text
/api/products/?search=wireless&category=1&tags=2&tags=5
```

### Categories

```text
GET /api/categories/
```

Returns all categories.

### Tags

```text
GET /api/tags/
```

Returns all tags.

## Search and Filtering

Products can be searched by description using Django's case-insensitive `icontains` lookup:

```python
products = products.filter(description__icontains=search)
```

Products can be filtered by category:

```python
products = products.filter(category_id=category)
```

Products can be filtered by selected tags:

```python
for tag_id in dict.fromkeys(tags):
    products = products.filter(tags__id=tag_id)
products = products.distinct()
```

Chaining one filter per selected tag requires every returned product to have all
selected tags. The `distinct()` method prevents duplicate products caused by the
many-to-many joins.

Search and filters can also be combined.

Example:

```text
/api/products/?search=portable&category=5&tags=1
```

## Query Optimization

The product queryset uses:

```python
select_related("category")
```

for the `ForeignKey` relationship between Product and Category.

It also uses:

```python
prefetch_related("tags")
```

for the many-to-many relationship between Product and Tag.

This helps reduce unnecessary database queries when loading related data.

## Django Admin

The Django Admin interface was used to create the sample categories, tags, and products.

The admin page is available at:

```text
http://127.0.0.1:8000/admin/
```

A local admin user can be created with:

```bash
python manage.py createsuperuser
```

## Assumptions

- Each product belongs to one category.
- A product may have multiple tags.
- A tag may belong to multiple products.
- Selecting multiple tags returns only products that match all selected tags.
- Search is performed against the product description only, according to the assignment requirements.
- Search is case-insensitive.
- Styling is intentionally minimal because the assignment focuses primarily on Django models, relationships, QuerySets, views, and filtering functionality.
- SQLite is used for simplicity and portability.

## AI Assistance

ChatGPT was used as an assistance tool during development.

It was used for:

- Guidance on structuring the Django and Next.js project
- Reviewing Django model relationships
- Discussing Django QuerySet implementation
- Guidance on connecting the Next.js frontend to the Django backend
- Reviewing query optimization using `select_related()` and `prefetch_related()`
- Assistance with project documentation

All submitted code was reviewed, understood, tested, and adapted during development.

I am prepared to explain the Django models, relationships, QuerySets, filtering logic, API endpoints, and frontend/backend integration.
