import boto3

from app.core.config import settings

s3_client = boto3.client("s3", **settings.S3_CONFIG)


def create_bucket():
    try:
        print(f"Checking S3 bucket {settings.S3_BUCKET} in {settings.S3_ENDPOINT}")
        s3_client.head_bucket(Bucket=settings.S3_BUCKET)
    except s3_client.exceptions.ClientError:
        print("S3 Bucket not found, creating...")
        s3_client.create_bucket(Bucket=settings.S3_BUCKET)
