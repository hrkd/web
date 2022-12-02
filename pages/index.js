import Head from 'next/head';
import styles from '../styles/Home.module.scss';

export default function Home() {
  const works = [
    {
      year: "2022",
      cases: [
        {
          title: "SKY GALLERY EXHIBITION SERIES vol.5『 目 [mé]』",
          url: "https://www.shibuya-scramble-square.com/sky/me/",
          type: ["web front end development","webgl development"]
        },
      ]
    },
    {
      year: "2021",
      cases: [
        {
          title: "FIMMIGRM film",
          url: "https://apps.apple.com/jp/app/fimmigrm-film/id1542313824",
          type: ["iOS development"]
        },
      ]
    },
    {
      year: "2020",
      cases: [
        {
          title: "Stadium Experiment",
          url: "https://prty.jp/work/stadium-experiment",
          type: ["iOS development"]
        },
        {
          title: "嵐 「5Gバーチャル大合唱」",
          url: "https://prty.jp/work/softbank-arashi",
          type: ["web front end development"]
        },
        {
          title: "NHK TOWN OF MEMORIES",
          url: "https://prty.jp/work/town-of-memories",
          type: ["projection mapping", "audio/light control"]
        },
      ]
    }, {
      year: "2019",
      cases: [
        {
          title: "FUJI ROCK `19 by SoftBank 5G",
          url: "https://prty.jp/work/fuji-rock-19-by-softbank-5g",
          type: ["iOS development"]
        },
      ]
    }, {
      year: "2018",
      cases: [
        {
          title: "VALU",
          url: "https://valu.is",
          type: ["web front end development"],
          from: "2017"
        },
        {
          title: "MATCH BOX",
          url: "https://matchbox.work",
          type: ["web front end development"],
          from: "2017"
        },
        {
          title: "STILL BY HAND",
          url: "http://stillbyhand.jp/",
          type: ["web front end / WordPress development"]
        },
        { title: "ChatBot (Google dialog flow) client" }
      ]
    },{
      year: "2017",
      cases: [
        {title: "T-Shirt printing web service"},
        {title: "Css frame work for ec-service"},
      ]
    },{
      year: "2016",
      cases: [
        {title: "WordPress development for ec-service"},
      ]
    }
  ]
  return (
    <div id="app">
      <div id="content">
        <div id="wrapper">
          <h1>HRKD.NET</h1>
          <div class="home">
            <h2>Works</h2>
            {works.map((work,index) => (
              <>
              <h3>{work.year}</h3>
              <ul>
                {work.cases.map((c,i)=>(
                  <li key={i}>
                    {c.url
                      ?
                      (<>
                        <a href={c.url} target="_blank">{c.title}</a>{' '}
                        | {c.type.join(', ')} {c.from?<span>from {c.from}</span>:null}
                      </>)
                      :
                      (c.title)
                    }
                  </li>
                ))}
              </ul>
              </>
            ))}

            <h2>About me</h2>
            <p>
              児玉広樹
              <br />
              北海道出身、東京在住のiOS/ウェブフロントエンドエンジニア。
              <br />
              Swift / iOS / TypeScript / React
              <br />
              <br />
              Hiroki Kodama
              <br />
              Born in Hokkaido, live in Tokyo as a iOS / web front-end engineer.
              <br />
              <br />
              主な経歴
              <br />
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
            </p>
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
