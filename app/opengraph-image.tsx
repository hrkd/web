import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';
export const alt = 'HRKD.NET';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// キャッシュバスター: この値を変更するとOGP画像のURLハッシュが更新される
const OG_VERSION = '1.0.0';

export default async function Image() {
  // PT Sans Bold Italic フォントを取得（TTF形式）
  const fontUrl = 'https://fonts.gstatic.com/s/ptsans/v18/jizdRExUiTo99u79D0e8fOytKA.ttf';
  const fontData = await fetch(fontUrl).then((res) => res.arrayBuffer());

  // 背景画像を読み込み
  const bgImagePath = join(process.cwd(), 'public', 'og-bg.png');
  const bgImageBuffer = await readFile(bgImagePath);
  const bgImageBase64 = `data:image/png;base64,${bgImageBuffer.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          backgroundColor: '#111111',
        }}
      >
        {/* 背景画像 */}
        <img
          src={bgImageBase64}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* タイトル */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'PT Sans',
              fontStyle: 'italic',
              fontWeight: 700,
              fontSize: 48,
              color: '#ffffff',
              letterSpacing: '1px',
            }}
          >
            HRKD.NET
          </span>
          {/* 黄色いアンダースコア */}
          <span
            style={{
              fontFamily: 'PT Sans',
              fontStyle: 'italic',
              fontWeight: 700,
              fontSize: 48,
              color: '#ffc729',
              letterSpacing: '1px',
              position: 'relative',
              top: -10,
            }}
          >
            _
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'PT Sans',
          data: fontData,
          style: 'italic',
        },
      ],
    }
  );
}
