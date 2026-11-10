import { Link, useLocation } from "react-router-dom";
import { Terminal, ArrowUp, ExternalLink } from "lucide-react";
import { CATEGORIES } from "../data/tools";
import { categoryLink } from "../data/seo";

const POPULAR = [
  { name: "JSON Formatter", path: "/json-formatter" },
  { name: "JWT Decoder", path: "/jwt-decoder" },
  { name: "UUID Generator", path: "/uuid-generator" },
  { name: "Base64 Decoder", path: "/base64-decoder" },
  { name: "JSON to C#", path: "/json-to-csharp" },
  { name: "Timestamp Converter", path: "/timestamp-converter" },
  { name: "Website Status Checker", path: "/website-status-checker" },
];

const SITE_LINKS = [
  { name: "All Tools", path: "/tools" },
  { name: "Browse Categories", path: "/categories" },
  { name: "Guides", path: "/guides" },
  { name: "About", path: "/about" },
  { name: "Privacy", path: "/privacy" },
  { name: "Terms", path: "/terms" },
  { name: "Contact", path: "/contact" },
];

const colHead = "text-sm font-black uppercase tracking-wider mb-3";

export default function Footer() {
  const { pathname } = useLocation();

  // Same pill style as the header nav; the current page is highlighted.
  const FooterLink = ({ to, children }) => {
    const active = pathname === to;
    return (
      <Link
        to={to}
        aria-current={active ? "page" : undefined}
        className={`nav-link !text-sm !px-3 !py-1 ${active ? "is-active" : ""}`}
      >
        {children}
      </Link>
    );
  };

  return (
    <footer
      className="mt-12 border-t-[3px] bg-[var(--surface)]"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="container mx-auto px-4 py-10 max-w-[1400px]">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 min-w-0">
            <Link
              to="/"
              className="brand"
              aria-label="OnlineDeveloperTool - home"
            >
              <span className="brand-mark">
                <Terminal size={20} strokeWidth={3} />
              </span>
              <span className="brand-text">
                <span className="brand-free">Online</span>DeveloperTool
              </span>
            </Link>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Small developer chores, done in seconds. Format, encode, decode,
              convert, generate and check things without hunting through ten
              tabs.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="sticker lime">100% Free</span>
              <span className="sticker cyan">No signup</span>
            </div>
            <p className="font-code text-xs" style={{ color: "var(--muted)" }}>
              $ git blame --me <span className="cursor-blink" />
            </p>
          </div>

          <nav aria-label="Popular tools">
            <h2 className={colHead}>Popular Tools</h2>
            <ul className="flex flex-col items-start gap-1">
              {POPULAR.map((t) => (
                <li key={t.path}>
                  <FooterLink to={t.path}>{t.name}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Tool categories">
            <h2 className={colHead}>Developer Tools</h2>
            <ul className="flex flex-col items-start gap-1">
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <Link
                    to={categoryLink(c)}
                    className="nav-link !text-sm !px-3 !py-1"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Site links">
            <h2 className={colHead}>Resources &amp; Site</h2>
            <ul className="flex flex-col items-start gap-1">
              {SITE_LINKS.map((l) => (
                <li key={l.path}>
                  <FooterLink to={l.path}>{l.name}</FooterLink>
                </li>
              ))}
            </ul>
            <a
              href="https://devtransition.blogspot.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-pink !py-2 !px-4 !text-sm mt-4"
            >
              Read our blogs here{" "}
              <ExternalLink size={16} strokeWidth={3} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </nav>
        </div>

        <div
          className="mt-10 pt-6 border-t-2 border-dashed text-sm flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          <div className="space-y-1">
            <p>
              &copy; {new Date().getFullYear()}{" "}
              <strong style={{ color: "var(--ink)" }}>
                OnlineDeveloperTool.com
              </strong>
              . All rights reserved.
            </p>
            <p className="text-xs">
              OnlineDeveloperTool is built and maintained by DevTransition. Most
              tool inputs are processed in your browser; the Website Status
              Checker makes requests to the URLs you enter.
            </p>
            <br />
            <div className="hidden inline-flex items-center mr-4">
              <a
                href="https://thedevtoolsdir.com/product/online-developer-tools?ref=badge"
                rel="dofollow"
              >
                <img
                  src="https://thedevtoolsdir.com/badge/online-developer-tools.svg"
                  alt="Featured on TheDevToolsDir"
                  width="160"
                  height="44"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            </div>

            <div className="hidden inline-flex items-center mr-4">
              <a
                className="hypestar-badge hypestar-badge--auto"
                data-hypestar-theme="auto"
                href="https://hypestar.org/?utm_source=supporter_badge&amp;utm_medium=referral&amp;utm_campaign=hype_star_badge"
                target="_blank"
                rel="noopener nofollow"
              >
                <img
                  className="hypestar-badge__image"
                  src="https://hypestar.org/badges/support-hype-star-auto-v2.svg"
                  alt="Verified"
                  width="140"
                  height="24"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            </div>

            <div className="hidden inline-flex items-center mr-4">
              <a
                href="https://indielineup.com/product/online-developer-tool?ref=badge"
                rel="dofollow"
              >
                <img
                  src="https://indielineup.com/badge/online-developer-tool.svg"
                  alt="Featured on IndieLineup"
                  width="160"
                  height="44"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            </div>

            <div className="hidden inline-flex items-center mr-4">
              <a
                href="https://saaslineup.com/product/online-developer-tool?ref=badge"
                rel="dofollow"
              >
                <img
                  src="https://saaslineup.com/badge/online-developer-tool.svg"
                  alt="Featured on SaaSLineup"
                  width="160"
                  height="44"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            </div>

            <div className="hidden inline-flex items-center mr-4">
              <a
                href="https://theaitoolsdir.com/product/online-developer-tool?ref=badge"
                rel="dofollow"
              >
                <img
                  src="https://theaitoolsdir.com/badge/online-developer-tool.svg"
                  alt="Featured on TheAIToolsDir"
                  width="160"
                  height="44"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            </div>
            <div className="hidden inline-flex items-center mr-4">
              <a href="https://www.betterlaunch.co/product/online-developer-tool">
                <img
                  src="https://www.betterlaunch.co/badge-launching-dark.svg"
                  alt="betterlaunch.co"
                  width="200"
                  height="56"
                />
              </a>
            </div>
            <div className="hidden inline-flex items-center mr-4">
              <a href="https://ledepress.com">
                <img
                  src="https://ledepress.com/ledepress-badge.svg"
                  width="120"
                  height="44"
                  alt="Published on Lede Press"
                />
              </a>
            </div>
            <div className="hidden inline-flex items-center mr-4">
              <a href="https://hedpress.com">
                <img
                  src="https://hedpress.com/hedpress-badge.svg"
                  width="125"
                  height="44"
                  alt="Published on Hed Press"
                />
              </a>
            </div>
            <div className="hidden inline-flex items-center mr-4">
              <a href="https://listedpress.com">
                <img
                  src="https://listedpress.com/listedpress-badge.svg"
                  width="120"
                  height="44"
                  alt="Published on Listed Press"
                />
              </a>
            </div>
            <div className="hidden inline-flex items-center mr-4">
              <a href="https://piecepress.com">
                <img
                  src="https://piecepress.com/piecepress-badge.svg"
                  width="120"
                  height="44"
                  alt="Published on Piece Press"
                />
              </a>
            </div>
            <div className="hidden inline-flex items-center mr-4">
              <a
                href="https://nicklaunches.com/products/online-developer-tools/"
                target="_blank"
                rel="noopener"
              >
                <img
                  src="https://nicklaunches.com/badges/featured.png"
                  alt="Online Developer Tools on Nick Launches"
                  width="244"
                  height="56"
                />
              </a>
            </div>
            <div className="hidden inline-flex items-center mr-4">
              <a
                href="https://useneedle.net/directory/online-developer-tools"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://api.useneedle.net/api/directory/badges/online-developer-tools.svg"
                  alt="Listed on Needle Directory"
                  height="44"
                />
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="btn btn-ghost !py-2 !px-4 !text-sm"
          >
            <ArrowUp size={16} strokeWidth={3} aria-hidden="true" /> Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
