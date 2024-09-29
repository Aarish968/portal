function BackgroundSvgUnoDemo() {
  return (
    <div className="bg-grid-white/0.3/24 bg-bg-main relative h-screen w-full flex items-center justify-center">
      <div className="bg-bg-main [mask-image:radial-gradient(ellipse_at_center,transparent_05%,black)] pointer-events-none absolute inset-0 flex items-center justify-center"></div>
      <p className="relative z-20 from-neutral-200 to-neutral-500 bg-gradient-to-b bg-clip-text py-8 text-4xl text-transparent font-bold sm:text-7xl">
        Backgrounds
      </p>
    </div>
  )
}

export default BackgroundSvgUnoDemo
