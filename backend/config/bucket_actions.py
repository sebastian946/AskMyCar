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
    prefix = f"{brand}/{model}/{year}/"
    response = s3.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
    contents = response.get("Contents", [])
    if not contents:
        raise FileNotFoundError(f"No hay ningun manual subido en s3://{bucket_name}/{prefix}")
    if len(contents) > 1:
        keys = ", ".join(obj["Key"] for obj in contents)
        raise ValueError(f"Se esperaba un solo archivo en s3://{bucket_name}/{prefix}, se encontraron varios: {keys}")

    key = contents[0]["Key"]
    return s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": bucket_name, "Key": key},
        ExpiresIn=expires_in
    )