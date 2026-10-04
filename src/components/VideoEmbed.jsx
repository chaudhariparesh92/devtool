// Self-hosted demo video: no third-party player, no extra JS, nothing downloads
// until the visitor presses play (preload="none"); the WebP poster shows first.
export default function VideoEmbed({ src, poster, title, caption, width = 1280, height = 720 }) {
  return (
    <figure className="m-0">
      <div className="card overflow-hidden">
        <video
          controls
          preload="none"
          playsInline
          poster={poster}
          width={width}
          height={height}
          aria-label={title}
          className="block w-full h-auto"
        >
          <source src={src} type="video/mp4" />
          Your browser does not support embedded video. <a href={src}>Download the demo video</a>.
        </video>
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>{caption}</figcaption>
      )}
    </figure>
  );
}
