export default function Logo() {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className="w-full h-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M100,20 C140,20 160,60 160,100 C160,140 140,180 100,180 C60,180 40,140 40,100 C40,60 60,20 100,20" />
      <path d="M100,40 C120,40 140,60 140,100 C140,140 120,160 100,160" />
      <path d="M20,100 L180,100" />
    </svg>
  );
}
