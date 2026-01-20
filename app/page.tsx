import { getArticles, Article } from '@/lib/microcms';

export default async function Home() {
  const { contents: articles } = await getArticles();

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

            <h2>About me</h2>
            <div>
              <p>
                児玉広樹
                <br />
                北海道出身、東京在住のiOS/ウェブフロントエンドエンジニア。
                <br />
                Swift / iOS / TypeScript / React
              </p>
              <p>
                Hiroki Kodama
                <br />
                Born in Hokkaido, live in Tokyo as a iOS / web front-end engineer.
              </p>
              <p>主な経歴</p>
              <ul>
                <li>
                  2019{' '}
                  <a href="https://prty.jp/" target="_blank">
                    株式会社PARTY
                  </a>
                  に入社
                </li>
                <li>
                  2018{' '}
                  <a href="https://prty.jp/" target="_blank">
                    株式会社PARTY
                  </a>
                  と業務委託契約
                </li>
                <li>
                  2017{' '}
                  <a href="https://valu.is/company" target="_blank">
                    株式会社VALU
                  </a>{' '}
                  と業務委託契約
                </li>
                <li>2013 東京に移住・フリーランスとして活動を開始</li>
                <li>2006 札幌市の広告制作会社に入社</li>
              </ul>
            </div>
            <h2>Activity</h2>
            <ul>
              <li>
                <a href="https://github.com/hrkd" target="_blank">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://twitter.com/_hrkd/" target="_blank">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/hrkd/" target="_blank">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
