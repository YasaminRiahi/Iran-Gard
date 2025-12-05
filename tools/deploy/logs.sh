#!/bin/bash
# Logs viewer
# Usage: ./scripts/logs.sh [backend|postgres|all]

COMPONENT=${1:-all}
FOLLOW=${2:--f}  # -f for follow (default), leave empty for tail

case $COMPONENT in
    backend)
        docker-compose logs $FOLLOW backend
        ;;
    postgres)
        docker-compose logs $FOLLOW postgres
        ;;
    all)
        docker-compose logs $FOLLOW
        ;;
    *)
        echo "Usage: ./scripts/logs.sh [backend|postgres|all] [-f|--tail]"
        exit 1
        ;;
esac
