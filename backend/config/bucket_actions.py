from config.config import Config
import os

s3_configs = Config()

s3 = s3_configs.get_s3_config()
bucket_name = s3_configs.get_bucket_name()


def upload_file(brand:str, model: str, year: str, name: str, file_path: str, content_type: str) -> str:
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"No existe el archivo: {file_path}")

    key = f"{brand}/{model}/{year}/{name}.pdf"
    s3.upload_file(
        Filename=file_path,
        Bucket=bucket_name,
        Key=key,
        ExtraArgs={"ContentType": content_type},
    )
    return key

def get_file_url(brand:str,model:str, year:str, expires_in:int = 3600) -> str:
    key = f"{brand}/{model}/{year}/"
    return s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": bucket_name, "Key": key},
        ExpiresIn=expires_in
    )