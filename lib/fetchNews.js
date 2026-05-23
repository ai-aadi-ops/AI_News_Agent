import { XMLParser } from 'fast-xml-parser';

const FALLBACK_IMAGES = [
  '/1.png',
  '/2.png',
  '/3.png',
  '/4.png',
  '/5.png',
  '/6.png',
];

export async function fetchNews() {
  try {
    const feedUrl = 'https://www.artificialintelligence-news.com/feed/';
    const response = await fetch(feedUrl, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS: ${response.statusText}`);
    }
    
    const xmlData = await response.text();
    
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    });
    const parsedData = parser.parse(xmlData);
    
    const items = parsedData?.rss?.channel?.item || [];
    
    // Ensure items is an array
    const itemsArray = Array.isArray(items) ? items : [items];

    return itemsArray.slice(0, 15).map((item, index) => {
      let imageUrl = null;
      
      // Attempt to extract image from enclosure or media:content
      if (item.enclosure && item.enclosure['@_url']) {
        imageUrl = item.enclosure['@_url'];
      } else if (item['media:content'] && item['media:content']['@_url']) {
        imageUrl = item['media:content']['@_url'];
      } else if (item['content:encoded']) {
        // Extract from HTML content
        const match = item['content:encoded'].match(/<img[^>]+src="([^">]+)"/);
        if (match) {
          imageUrl = match[1];
        }
      }

      // Use a fallback image if no image was found
      if (!imageUrl) {
        imageUrl = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
      }

      // Format date
      const dateStr = item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).toUpperCase() : 'LATEST NEWS';

      // Clean up summary
      const rawSummary = item.description || item.summary || '';
      const cleanSummary = String(rawSummary)
        .replace(/(<([^>]+)>)/gi, "")
        .substring(0, 150) + '...';

      return {
        id: item.guid?.['#text'] || item.guid || String(index),
        title: item.title,
        summary: cleanSummary,
        date: dateStr,
        imageUrl: imageUrl,
        url: item.link
      };
    });

  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return [];
  }
}
