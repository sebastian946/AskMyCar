from config.config import Config

s3_configs = Config()

s3 = s3_configs.get_s3_config()
bucket_name = s3_configs.get_bucket_name()

def upload_file(key: str, file_path: str, content_type:str) -> str:
    s3.upload_file(
        Filename=file_path,
        Bucket=bucket_name,
        KEY=key,
        ExtraArgs={"ContentType":content_type}
    )

    return key

def get_file_url(key:str, expires_in:int = 3600) -> str:
    return s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": bucket_name, "Key": key},
        ExpiresIn=expires_in
    )