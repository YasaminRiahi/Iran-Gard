"""
Custom exception handlers for FastAPI application.
"""

from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


async def validation_exception_handler(request, exc: RequestValidationError):
    """
    Convert Pydantic validation errors to user-friendly Persian messages.

    Maps technical validation errors to clear, actionable error messages in Persian.
    """
    errors = []

    for error in exc.errors():
        field = error["loc"][1] if len(error["loc"]) > 1 else error["loc"][0]
        error_type = error["type"]

        # Map field names to Persian
        field_names = {
            "email": "ایمیل",
            "username": "نام کاربری",
            "password": "رمز عبور",
            "code": "کد تایید",
            "place_id": "شناسه مکان",
            "review_id": "شناسه نظر",
            "rating": "امتیاز",
            "review": "متن نظر",
            "city_name": "نام شهر",
            "category_id": "شناسه دسته‌بندی",
            "skip": "تعداد رد شده",
            "limit": "محدودیت",
        }
        field_label = field_names.get(field, field)

        # Map error types to Persian messages
        if error_type == "value_error.email":
            message = f"{field_label} معتبر نیست. لطفاً یک ایمیل صحیح وارد کنید."
        elif "email" in str(error_type).lower() and "@" in str(
            error.get("ctx", {}).get("reason", "")
        ):
            message = f"{field_label} معتبر نیست. لطفاً یک ایمیل صحیح وارد کنید."
        elif error_type == "string_too_short":
            min_length = error.get("ctx", {}).get("min_length", 1)
            message = f"{field_label} باید حداقل {min_length} کاراکتر باشد."
        elif error_type == "string_too_long":
            max_length = error.get("ctx", {}).get("max_length", 100)
            message = f"{field_label} نمی‌تواند بیشتر از {max_length} کاراکتر باشد."
        elif error_type == "value_error":
            message = f"{field_label} معتبر نیست."
        elif error_type == "missing":
            message = f"{field_label} الزامی است."
        elif error_type == "int_parsing":
            message = f"{field_label} باید یک عدد صحیح باشد."
        elif error_type == "greater_than_equal":
            ge_value = error.get("ctx", {}).get("ge", 1)
            message = f"{field_label} باید حداقل {ge_value} باشد."
        elif error_type == "less_than_equal":
            le_value = error.get("ctx", {}).get("le", 5)
            message = f"{field_label} باید حداکثر {le_value} باشد."
        elif error_type == "int_type":
            message = f"{field_label} باید یک عدد صحیح باشد."
        else:
            message = f"{field_label} معتبر نیست."

        errors.append(
            {
                "field": field,
                "message": message,
            }
        )

    return JSONResponse(
        status_code=422, content={"detail": errors, "type": "validation_error"}
    )
