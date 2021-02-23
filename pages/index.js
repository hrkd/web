import Head from 'next/head';
import styles from '../styles/Home.module.scss';

export default function Home() {
  return (
    <div id="app">
      <div id="content">
        <div id="wrapper">
          <h1>HRKD.NET</h1>
          <div class="home">
            <h2>Works</h2>
            <h3>2019</h3>
            <ul>
              <li>
                <a href="https://prty.jp/work/fuji-rock-19-by-softbank-5g" target="_blank">
                  FUJI ROCK `19 by SoftBank 5G
                </a>{' '}
                | iOS development
              </li>
            </ul>
            <h3>2018</h3>
            <ul>
              <li>
                <a href="https://valu.is" target="_blank">
                  VALU
                </a>{' '}
                | web front end development<span>from 2017</span>
              </li>
              <li>
                <a href="https://matchbox.work" target="_blank">
                  MATCH BOX
                </a>{' '}
                | web front end development<span>from 2017</span>
              </li>
              <li>
                <a href="http://stillbyhand.jp/" target="_blank">
                  STILL BY HAND
                </a>{' '}
                | web front end / WordPress development
              </li>
              <li>ChatBot (Google dialog flow) client</li>
            </ul>
            <h3>2017</h3>
            <ul>
              <li>T-Shirt printing web service</li>
              <li>Css frame work for ec-service</li>
            </ul>
            <h3>2016</h3>
            <ul>
              <li>WordPress development for ec-service</li>
            </ul>
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
