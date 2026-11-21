import { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ToolsIndex from './pages/ToolsIndex';
import CategoriesIndex from './pages/CategoriesIndex';
import CategoryPage from './pages/CategoryPage';
import { CATEGORY_ROUTES } from './data/seo';
import StaticPage from './pages/StaticPage';
import GuidesIndex from './pages/GuidesIndex';
import GuidePage from './pages/GuidePage';
import { GUIDE_ROUTES } from './data/guides';
import AdSlot from './components/AdSlot';
import FooterSeoContent from './components/FooterSeoContent';
import NotFound from './pages/NotFound';
import { lazyRoute } from './lazyRoute';

// Tool pages are code-split: each one is downloaded only when that tool is opened.
const JsonFormatterTool = lazyRoute(() => import('./pages/tools/JsonFormatterTool'));
const JsonConverterTool = lazyRoute(() => import('./pages/tools/JsonConverterTool'));
const EncoderTool = lazyRoute(() => import('./pages/tools/EncoderTool'));
const UuidTool = lazyRoute(() => import('./pages/tools/UuidTool'));
const JwtTool = lazyRoute(() => import('./pages/tools/JwtTool'));
const DataFormatTool = lazyRoute(() => import('./pages/tools/DataFormatTool'));
const TextTools = lazyRoute(() => import('./pages/tools/TextTools'));
const HashTool = lazyRoute(() => import('./pages/tools/HashTool'));
const TimestampTool = lazyRoute(() => import('./pages/tools/TimestampTool'));
const ColorTool = lazyRoute(() => import('./pages/tools/ColorTool'));
const NumberBaseTool = lazyRoute(() => import('./pages/tools/NumberBaseTool'));
const RegexTool = lazyRoute(() => import('./pages/tools/RegexTool'));
const DiffTool = lazyRoute(() => import('./pages/tools/DiffTool'));
const QueryStringTool = lazyRoute(() => import('./pages/tools/QueryStringTool'));
const CronTool = lazyRoute(() => import('./pages/tools/CronTool'));
const WebsiteStatusTool = lazyRoute(() => import('./pages/tools/WebsiteStatusTool'));

// Keep ad wrappers out of the layout until real numeric AdSense slot IDs are configured.
// This avoids empty top/bottom gaps when the project still contains placeholder IDs.
const TOP_AD_SLOT = 'YOUR_TOP_AD_SLOT_ID';
const BOTTOM_AD_SLOT = 'YOUR_BOTTOM_AD_SLOT_ID';
const isConfiguredAdSlot = (slot) => /^\d+$/.test(String(slot || '').trim());

export const routes = [
  { path: '/', component: Home },
  { path: '/tools', component: ToolsIndex },
  { path: '/categories', component: CategoriesIndex },
  ...CATEGORY_ROUTES.map((path) => ({ path, component: CategoryPage })),
  { path: '/guides', component: GuidesIndex },
  ...GUIDE_ROUTES.map((path) => ({ path, component: GuidePage })),
  { path: '/about', component: StaticPage },
  { path: '/privacy', component: StaticPage },
  { path: '/terms', component: StaticPage },
  { path: '/contact', component: StaticPage },
  { path: '/json-formatter', component: JsonFormatterTool },
  { path: '/json-validator', component: JsonFormatterTool },
  { path: '/json-beautifier', component: JsonFormatterTool },
  { path: '/json-minifier', component: JsonFormatterTool },
  { path: '/json-to-csharp', component: JsonConverterTool },
  { path: '/json-to-typescript', component: JsonConverterTool },
  { path: '/json-to-java', component: JsonConverterTool },
  { path: '/json-to-python', component: JsonConverterTool },
  { path: '/json-to-go', component: JsonConverterTool },
  { path: '/json-to-php', component: JsonConverterTool },
  { path: '/json-to-kotlin', component: JsonConverterTool },
  { path: '/url-encoder', component: EncoderTool },
  { path: '/url-decoder', component: EncoderTool },
  { path: '/base64-encoder', component: EncoderTool },
  { path: '/base64-decoder', component: EncoderTool },
  { path: '/html-encoder', component: EncoderTool },
  { path: '/html-decoder', component: EncoderTool },
  { path: '/uuid-generator', component: UuidTool },
  { path: '/uuid-validator', component: UuidTool },
  { path: '/uuid-parser', component: UuidTool },
  { path: '/jwt-decoder', component: JwtTool },
  { path: '/jwt-generator', component: JwtTool },
  { path: '/xml-formatter', component: DataFormatTool },
  { path: '/xml-validator', component: DataFormatTool },
  { path: '/yaml-formatter', component: DataFormatTool },
  { path: '/yaml-to-json', component: DataFormatTool },
  { path: '/csv-to-json', component: DataFormatTool },
  { path: '/json-to-csv', component: DataFormatTool },
  { path: '/text-counter', component: TextTools },
  { path: '/case-converter', component: TextTools },
  { path: '/text-to-slug', component: TextTools },
  { path: '/slug-generator', component: TextTools },
  { path: '/hash-generator', component: HashTool },
  { path: '/sha256-generator', component: HashTool },
  { path: '/sha512-generator', component: HashTool },
  { path: '/md5-generator', component: HashTool },
  { path: '/timestamp-converter', component: TimestampTool },
  { path: '/unix-timestamp', component: TimestampTool },
  { path: '/color-converter', component: ColorTool },
  { path: '/hex-to-rgb', component: ColorTool },
  { path: '/rgb-to-hex', component: ColorTool },
  { path: '/number-base-converter', component: NumberBaseTool },
  { path: '/binary-to-decimal', component: NumberBaseTool },
  { path: '/decimal-to-binary', component: NumberBaseTool },
  { path: '/hex-to-decimal', component: NumberBaseTool },
  { path: '/decimal-to-hex', component: NumberBaseTool },
  { path: '/regex-tester', component: RegexTool },
  { path: '/regex-generator', component: RegexTool },
  { path: '/diff-checker', component: DiffTool },
  { path: '/query-string-parser', component: QueryStringTool },
  { path: '/query-string-generator', component: QueryStringTool },
  { path: '/cron-expression-generator', component: CronTool },
  { path: '/cron-expression-parser', component: CronTool },
  { path: '/website-status-checker', component: WebsiteStatusTool }
];

// Load the code-split chunk for a path. Used before prerendering (server) and before hydrating (browser)
// so the first render already contains the real page, never a Suspense fallback.
export function preloadRoute(pathname) {
  const clean = (pathname || '/').replace(/\/+$/, '') || '/';
  const match = routes.find((r) => r.path === clean);
  return match && match.component.preload ? match.component.preload() : Promise.resolve();
}

// Jump back to the top when navigating to a new page (hash links are left alone).
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <div className="site-root flex flex-col min-h-screen">
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        
        <div className="container mx-auto px-4 py-8 max-w-[1400px] flex-grow flex flex-col">
          
          {/* AD 1 - TOP: only reserve space when a real numeric slot is configured. */}
          {isConfiguredAdSlot(TOP_AD_SLOT) && (
            <div className="w-full flex justify-center mb-8">
              <AdSlot className="w-full max-w-[970px] h-[90px]" slot={TOP_AD_SLOT} />
            </div>
          )}

          {/* Tool/Page Content (full width: the old sticky sidebar ads were removed so tools get room and ads stay in flow) */}
          <main id="main" className="flex-grow min-w-0 w-full max-w-[1100px] mx-auto">
            <Suspense fallback={null}>
            <Routes>
              {routes.map((r, i) => (
                 <Route key={i} path={r.path} element={<r.component path={r.path} />} />
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </main>

          {/* AD 4 - BOTTOM: only reserve space when a real numeric slot is configured. */}
          {isConfiguredAdSlot(BOTTOM_AD_SLOT) && (
            <div className="w-full flex justify-center mt-10">
              <AdSlot className="w-full max-w-[970px] h-[90px]" slot={BOTTOM_AD_SLOT} />
            </div>
          )}
          
        </div>
        
        <FooterSeoContent />
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
