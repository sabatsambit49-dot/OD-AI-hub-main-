import logging
import requests
from bs4 import BeautifulSoup
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
from typing import Optional

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/process-link",
    tags=["Link Processor"]
)

class LinkProcessRequest(BaseModel):
    url: HttpUrl

class LinkProcessResponse(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    content: Optional[str] = None

@router.post("", response_model=LinkProcessResponse)
async def process_link(request_data: LinkProcessRequest):
    url = str(request_data.url)
    try:
        # Fetch the page with a User-Agent to avoid basic blocks
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        }
        response = requests.get(url, headers=headers, timeout=10)
        
        # Check if the response is valid
        if response.status_code == 403:
            raise HTTPException(status_code=403, detail="Access denied (403 Forbidden) when trying to fetch the URL.")
        response.raise_for_status()

        # Ensure we're parsing HTML
        content_type = response.headers.get("Content-Type", "")
        if "text/html" not in content_type.lower():
            raise HTTPException(status_code=400, detail="The provided URL does not return an HTML page.")

        soup = BeautifulSoup(response.content, "html.parser")

        # Extract Title
        title_tag = soup.find("title")
        if not title_tag:
            title_meta = soup.find("meta", attrs={"property": "og:title"})
            title = title_meta.get("content", "").strip() if title_meta else None
        else:
            title = title_tag.text.strip()
        
        # Extract Meta Description
        desc_meta = soup.find("meta", attrs={"name": "description"})
        if not desc_meta:
            desc_meta = soup.find("meta", attrs={"property": "og:description"})
        description = desc_meta.get("content", "").strip() if desc_meta else None
        
        # Extract Main Image (og:image)
        image_meta = soup.find("meta", attrs={"property": "og:image"})
        image = image_meta.get("content", "").strip() if image_meta else None
        
        # Extract Main Text Content (concatenate paragraphs)
        paragraphs = soup.find_all("p")
        content_text = " ".join([p.text.strip() for p in paragraphs if p.text.strip()])
        # Limit the content text to reasonable preview length
        if len(content_text) > 300:
            content_text = content_text[:297] + "..."

        return LinkProcessResponse(
            title=title,
            description=description,
            image=image,
            content=content_text
        )

    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="The request timed out while trying to fetch the URL.")
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching URL {url}: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to fetch the URL. Ensure it is valid and publicly accessible.")
