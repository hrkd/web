import { getArticles, getProfile, Article } from '@/lib/microcms';

export default async function Home() {
  const [{ contents: articles }, profile] = await Promise.all([
    getArticles(),
    getProfile(),
  ]);

  // 年でグループ化
  const worksByYear = articles.reduce((acc, article) => {
    const year = article.year.toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(article);
    return acc;
  }, {} as Record<string, Article[]>);

  // 年を降順でソート
  const years = Object.keys(worksByYear).sort((a, b) => Number(b) - Number(a));

  // 各年内のarticleを逆順に
  years.forEach((year) => {
    worksByYear[year].reverse();
  });

  return (
    <div id="app">
      <div id="content">
        <div id="wrapper">
          <h1>HRKD.NET</h1>
          <div className="home">
            <h2>Works</h2>
            {years.map((year) => (
              <div key={year}>
                <h3>{year}</h3>
                <ul>
                  {worksByYear[year].map((article) => (
                    <li key={article.id}>
                      {article.url ? (
                        <>
                          <a href={article.url} target="_blank">
                            {article.title}
                          </a>{' '}
                          | {article.type.map((t) => t.title).join(', ')}
                          {article.from ? <span>from {article.from}</span> : null}
                        </>
                      ) : (
                        article.title
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div dangerouslySetInnerHTML={{ __html: profile.introduction }} />
          </div>
        </div>
      </div>
    </div>
  );
}
