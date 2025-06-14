import os
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .scraper import Scrapping


@api_view(['GET'])
@permission_classes([AllowAny])
def search_query(request):
    query = request.GET.get('query', '')
    if not query:
        return Response({"error": "Query parameter is required."}, status=400)

    # Optional: Do something with the query
    Scrapping(query)

    # Define the path to the summary JSON
    summary_path = os.path.join('output', 'all_pdf_summaries.json')
    if not os.path.exists(summary_path):
        return Response({"error": "Summary file not found."}, status=404)

    with open(summary_path, 'r', encoding='utf-8') as f:
        summary_data = json.load(f)

    return Response(summary_data, status=200)
