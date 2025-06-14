import os
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .scraper import Scrapping
from .research_model import get_recent_arxiv_metadata


@api_view(['GET'])
@permission_classes([AllowAny])
def search_query(request):
    query = request.GET.get('query', '')
    if not query:
        return Response({"error": "Query parameter is required."}, status=400)

    # Optional: Do something with the query
    Scrapping(query)
    # print(f"Looking for summary file for query:")
    # Define the path to the summary JSON
    summary_path = "all_pdf_summaries.json"
    print(f"Looking for summary file at: {summary_path}")

    if not os.path.exists(summary_path):
        return Response({"error": "Summary file not found."}, status=404)

    with open(summary_path, 'r', encoding='utf-8') as f:
        summary_data = json.load(f)

    # shutil.rmtree(".\output\data")
    metadata_List = get_recent_arxiv_metadata("output\data\metadata", 3)

    return Response(
        {
            "summary_data": summary_data,
            "metadata_list": metadata_List
        },
        status=200
    )
