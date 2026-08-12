/**
 * 비하이브 로고.
 *
 * 회사소개서 PDF에 들어 있던 원본(619×355)을 꺼내 흰 배경을 투명 처리한 것입니다.
 * 다크 모드에서는 검은 워드마크가 묻히므로 밝게 반전한 변형을 함께 둡니다.
 */
export default function Logo({ className = "h-14" }: { className?: string }) {
  return (
    <>
      <img
        src="/logo.png"
        alt="Beehive Corp"
        className={`${className} w-auto dark:hidden`}
      />
      <img
        src="/logo-dark.png"
        alt="Beehive Corp"
        className={`${className} hidden w-auto dark:block`}
      />
    </>
  );
}
