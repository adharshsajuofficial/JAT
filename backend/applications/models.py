from django.db import models

# Create your models here.
from django.contrib.auth.models import User
from django.db import models


class Application(models.Model):
    STATUS_CHOICES = [
        ("WISHLIST", "Wishlist"),
        ("APPLIED", "Applied"),
        ("SCREENING", "Screening"),
        ("INTERVIEW", "Interview"),
        ("OFFER", "Offer"),
        ("REJECTED", "Rejected"),
    ]

    company = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="APPLIED",
    )
    date_applied = models.DateField(null=True, blank=True)

    job_url = models.URLField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    work_type = models.CharField(max_length=50, blank=True)
    salary = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="applications",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company} - {self.role}"

    