/**
 * 소셜 채널 브랜드 아이콘.
 * 각 로고는 공식 브랜드 컬러 규정을 따릅니다 —
 * Instagram gradient / Naver #03C75A / KakaoTalk #FEE500.
 */

type IconProps = { className?: string };

export function InstagramIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#feda75" />
          <stop offset="25%" stopColor="#fa7e1e" />
          <stop offset="50%" stopColor="#d62976" />
          <stop offset="75%" stopColor="#962fbf" />
          <stop offset="100%" stopColor="#4f5bd5" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig-gradient)" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.6" r="1.2" fill="#fff" />
      <rect
        x="4.6"
        y="4.6"
        width="14.8"
        height="14.8"
        rx="3.6"
        fill="none"
        stroke="#fff"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function NaverIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="5" fill="#03C75A" />
      <path d="M8 6.5h2.6l3.4 5.2V6.5H16v11h-2.6L10 12.3v5.2H8z" fill="#fff" />
    </svg>
  );
}

export function KakaoIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="5" fill="#FEE500" />
      <path
        d="M12 6.4c-3.7 0-6.7 2.3-6.7 5.2 0 1.9 1.3 3.5 3.2 4.4l-.6 2.3c-.1.3.2.5.5.3l2.7-1.8c.3 0 .6.1.9.1 3.7 0 6.7-2.3 6.7-5.2S15.7 6.4 12 6.4z"
        fill="#3C1E1E"
      />
    </svg>
  );
}
