export default function WavePattern() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-80 text-accent">
<svg
className="w-full h-full"
viewBox="0 0 1200 300"
preserveAspectRatio="none"
>
<defs>
  <pattern
    id="heroWave"
    width="600"
    height="300"
    patternUnits="userSpaceOnUse"
  >
    <path
      d="M0,150 Q150,60 300,150 T600,150"
      stroke="currentColor"
      strokeWidth="0.6"
      fill="none"
    />
    <path
      d="M0,180 Q150,100 300,180 T600,180"
      stroke="currentColor"
      strokeWidth="0.4"
      fill="none"
      opacity="0.6"
    />
    <path
      d="M0,120 Q150,200 300,120 T600,120"
      stroke="currentColor"
      strokeWidth="0.4"
      fill="none"
      opacity="0.5"
    />
  </pattern>
</defs>

<rect width="100%" height="100%" fill="url(#heroWave)" />
</svg>
</div>
  )
}