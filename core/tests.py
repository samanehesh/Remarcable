from django.test import TestCase

from .models import Category, Product, Tag


class ApiRootTests(TestCase):
    def test_root_describes_the_api(self):
        response = self.client.get("/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {
            "name": "Remarcable Product API",
            "status": "ok",
            "endpoints": {
                "products": "/api/products/",
                "categories": "/api/categories/",
                "tags": "/api/tags/",
            },
        })


class ProductListTests(TestCase):
    def setUp(self):
        category = Category.objects.create(name="Electronics")
        self.portable = Tag.objects.create(name="Portable")
        self.wireless = Tag.objects.create(name="Wireless")

        both_tags = Product.objects.create(
            name="Wireless Speaker",
            description="A portable wireless speaker.",
            category=category,
        )
        both_tags.tags.set([self.portable, self.wireless])

        portable_only = Product.objects.create(
            name="Travel Stand",
            description="A portable device stand.",
            category=category,
        )
        portable_only.tags.add(self.portable)

    def test_multiple_tags_require_every_selected_tag(self):
        response = self.client.get(
            "/api/products/",
            {"tags": [self.portable.id, self.wireless.id]},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            [product["name"] for product in response.json()],
            ["Wireless Speaker"],
        )

    def test_single_tag_returns_every_product_with_that_tag(self):
        response = self.client.get(
            "/api/products/",
            {"tags": [self.portable.id]},
        )

        self.assertEqual(response.status_code, 200)
        self.assertCountEqual(
            [product["name"] for product in response.json()],
            ["Wireless Speaker", "Travel Stand"],
        )
