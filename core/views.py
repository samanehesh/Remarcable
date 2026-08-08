from django.http import JsonResponse

from .models import Category, Product, Tag


def api_root(request):
    return JsonResponse({
        "name": "Remarcable Product API",
        "status": "ok",
        "endpoints": {
            "products": "/api/products/",
            "categories": "/api/categories/",
            "tags": "/api/tags/",
        },
    })


def product_list(request):
    products = (
        Product.objects
        .select_related("category")
        .prefetch_related("tags")
        .order_by("category__name", "name")
    )

    search = request.GET.get("search", "").strip()
    category = request.GET.get("category", "").strip()
    tags = request.GET.getlist("tags")

    if search:
        products = products.filter(description__icontains=search)

    if category:
        products = products.filter(category__id=category)

    if tags:
        for tag_id in dict.fromkeys(tags):
            products = products.filter(tags__id=tag_id)
        products = products.distinct()

    data = []

    for product in products:
        data.append({
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "category": {
                "id": product.category.id,
                "name": product.category.name,
            },
            "tags": [
                {
                    "id": tag.id,
                    "name": tag.name,
                }
                for tag in product.tags.all()
            ],
        })

    return JsonResponse(data, safe=False)


def category_list(request):
    categories = Category.objects.order_by("name").values("id", "name")
    return JsonResponse(list(categories), safe=False)


def tag_list(request):
    tags = Tag.objects.order_by("name").values("id", "name")
    return JsonResponse(list(tags), safe=False)
