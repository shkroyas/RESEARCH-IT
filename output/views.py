from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .scrap import main


@api_view(['GET'])  # GET method because query is in URL params
@permission_classes([AllowAny])
def search_query(request):
    query = request.GET.get('query', '')  # get from URL param
    if not query:
        return Response({"error": "Query parameter is required."}, status=400)

    results = main(query)
    return Response(query, status=200)
