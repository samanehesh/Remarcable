from django.urls import path

from .views import api_root, category_list, product_list, tag_list


urlpatterns = [
    path("", api_root, name="api_root"),
    path("api/products/", product_list, name="product_list"),
    path("api/categories/", category_list, name="category_list"),
    path("api/tags/", tag_list, name="tag_list"),
]
