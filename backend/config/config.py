import os
from dotenv import load_dotenv
import boto3

class Config:
    def __init__(self) -> None:
        self.AWS_ACCESS_KEY=os.environ["AWS_ACCESS_KEY_ID"]
        self.AWS_SECRET_ACCESS = os.environ["AWS_SECRET_ACCESS_KEY"]
        self.AWS_REGION = os.environ["AWS_REGION"]
        self.S3_BUCKET_NAME = os.environ["S3_BUCKET_NAME"]

    def get_s3_config(self):
        s3 = boto3.client(
            "s3",
            region_name = self.AWS_REGION,
            aws_access_key_id = self.AWS_ACCESS_KEY,
            aws_secret_access_key = self.AWS_SECRET_ACCESS
        )
        return s3

    def get_bucket_name(self):
        return self.S3_BUCKET_NAME
