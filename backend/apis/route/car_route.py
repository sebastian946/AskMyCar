import logging

from fastapi import APIRouter, Depends, HTTPException, status, Request
from apis.models.car_model import Car, ChatRequest, ManualResponse, ChatResponse
from apis.core.security import verify_api_key
from apis.services.car_service import get_manual as get_manual_service, prompt_ai
from slowapi import Limiter
from slowapi.util import get_remote_address

logger = logging.getLogger(__name__)
limiter = Limiter(key_func=get_remote_address)

router = APIRouter(
    prefix="/askmycar",
    tags=["car"],
    dependencies=[Depends(verify_api_key)]
)

@router.post("/get_manual", status_code=status.HTTP_201_CREATED, response_model=ManualResponse)
@limiter.limit("10/minute")
def get_manual(request: Request, car_data:Car):
    try:
        result = get_manual_service(car_data)
    except ValueError as exc:
        logger.warning(f"get_manual rejected: {exc}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except Exception:
        logger.exception("get_manual failed")
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="No se pudo obtener el manual")
    return ManualResponse(status=result["status"], car=car_data, message=result["message"])

@router.post("/chat_ai", status_code=status.HTTP_200_OK, response_model=ChatResponse)
@limiter.limit("10/minute")
def chat_ia(request: Request, body: ChatRequest):
    try:
        result = prompt_ai(body.car, body.question)
    except ValueError as exc:
        logger.warning(f"chat_ai rejected: {exc}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except Exception:
        logger.exception("chat_ai failed")
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="No se pudo responder la pregunta")
    return ChatResponse(car=body.car, question=body.question, answer=result["answer"], sources=result["sources"])