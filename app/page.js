import { fetchNews } from "@/lib/fetchNews";

// Force Next.js to dynamically render this page on every request
export const dynamic = 'force-dynamic';

export default async function Home() {
  const newsData = await fetchNews();

  return (
    <main className="container transition-all">
      <header>
        <h1 className="neon-text-cyan">AI News Terminal</h1>
        <p>Real-time updates from the frontier of artificial intelligence.</p>
      </header>

      <section className="news-grid">
        {newsData.length > 0 ? (
          newsData.map((news) => (
            <article key={news.id} className="news-card glass-panel transition-all neon-glow-hover">
              <a href={news.url} target="_blank" rel="noopener noreferrer" className="card-image-wrapper">
                <img 
                  src={news.imageUrl} 
                  alt={news.title} 
                  className="card-image"
                />
              </a>
              
              <div className="card-content">
                <span className="card-date">{news.date}</span>
                <h2 className="card-title">{news.title}</h2>
                <p className="card-summary">{news.summary}</p>
                
                <div className="card-footer">
                  <a href={news.url} target="_blank" rel="noopener noreferrer" className="read-more">
                    Read Official Source 
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1' }}>
            <h2 className="neon-text-magenta">Connecting to data streams...</h2>
            <p>Please refresh the page to try again.</p>
          </div>
        )}
      </section>
    </main>
  );
}
