# Generated by Django 5.1.7 on 2025-04-02 10:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_customuser_options_alter_customuser_managers_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='role',
            field=models.CharField(blank=True, choices=[('patient', 'Patient'), ('doctor', 'Doctor'), ('admin', 'Admin')], max_length=20, null=True),
        ),
    ]
