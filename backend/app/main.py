import sentry_sdk
from fastapi import FastAPI, Depends
from fastapi.routing import APIRoute
from starlette.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

from app.api.main import api_router
from app.api.deps import get_current_active_superuser
from app.core.config import settings
from app.core.lifespan import lifespan


def custom_generate_unique_id(route: APIRoute) -> str:
    """Generate a unique id for the route for a better OpenAPI.json generation."""
    print(route)
    return f"{route.tags[0]}-{route.name}"


if settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
    sentry_sdk.init(dsn=str(settings.SENTRY_DSN), enable_tracing=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    # generate_unique_id_function=custom_generate_unique_id,
    lifespan=lifespan,
)

# Set all CORS enabled origins
if settings.all_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)


# Enable /metrics endpoint for Prometheus
if settings.PROMETHEUS_METRICS:
    if settings.ENVIRONMENT == "local":
        prometheis_in_schema = True
    else:
        prometheis_in_schema = False
    Instrumentator().instrument(app, metric_namespace="patternland").expose(
        app,
        include_in_schema=prometheis_in_schema,
        dependencies=[Depends(get_current_active_superuser)],
        tags=["metrics"],
    )
