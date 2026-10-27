This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 카카오톡 공유 설정

결과 페이지의 카카오톡 공유 버튼은 `NEXT_PUBLIC_KAKAO_JS_KEY` 환경변수가 있을 때만 보여요.

1. [Kakao Developers](https://developers.kakao.com)에 로그인 → **내 애플리케이션 → 애플리케이션 추가하기**로 앱을 만들어요.
2. **앱 설정 → 앱 키**에서 **JavaScript 키**를 복사해요.
3. **앱 설정 → 플랫폼 → Web 플랫폼 등록**에서 사이트 도메인을 등록해요: `https://howyoulove.netlify.app` (로컬 테스트용으로 `http://localhost:3000`도 추가).
4. 로컬에서는 `.env.example`을 `.env.local`로 복사해 키를 넣고, Netlify에서는 **Site configuration → Environment variables**에 `NEXT_PUBLIC_KAKAO_JS_KEY`를 추가한 뒤 다시 배포해요. (`NEXT_PUBLIC_` 변수는 빌드 시점에 들어가므로 키를 바꾸면 재배포가 필요해요.)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
