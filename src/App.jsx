import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ToolsIndex from './pages/ToolsIndex';
import CategoriesIndex from './pages/CategoriesIndex';
import StaticPage from './pages/StaticPage';
import JsonFormatterTool from './pages/tools/JsonFormatterTool';
import JsonConverterTool from './pages/tools/JsonConverterTool';
import EncoderTool from './pages/tools/EncoderTool';
import UuidTool from './pages/tools/UuidTool';
import JwtTool from './pages/tools/JwtTool';
import DataFormatTool from './pages/tools/DataFormatTool';
import TextTools from './pages/tools/TextTools';
import HashTool from './pages/tools/HashTool';
import TimestampTool from './pages/tools/TimestampTool';
import ColorTool from './pages/tools/ColorTool';
import NumberBaseTool from './pages/tools/NumberBaseTool';
import RegexTool from './pages/tools/RegexTool';
import DiffTool from './pages/tools/DiffTool';
import QueryStringTool from './pages/tools/QueryStringTool';
import CronTool from './pages/tools/CronTool';
import WebsiteStatusTool from './pages/tools/WebsiteStatusTool';
import AdSlot from './components/AdSlot';
import FooterSeoContent from './components/FooterSeoContent';
import NotFound from './pages/NotFound';

export const routes = [
  { path: '/', component: Home },
  { path: '/tools', component: ToolsIndex },
  { path: '/categories', component: CategoriesIndex },
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

// Jump back to the top when navigating to a new page (hash links are left alone).
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="site-root flex flex-col min-h-screen">
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        
        <div className="container mx-auto px-4 py-8 max-w-[1400px] flex-grow flex flex-col">
          
          {/* AD 1 - TOP: below the sticky header, above the content. Scrolls with the page. */}
          <div className="w-full flex justify-center mb-8">
             <AdSlot className="w-full max-w-[970px] h-[90px]" slot="YOUR_TOP_AD_SLOT_ID" />
          </div>

          {/* Tool/Page Content (full width: the old sticky sidebar ads were removed so tools get room and ads stay in flow) */}
          <main id="main" className="flex-grow min-w-0 w-full max-w-[1100px] mx-auto">
            <Routes>
              {routes.map((r, i) => (
                 <Route key={i} path={r.path} element={<r.component path={r.path} />} />
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* AD 4 - BOTTOM: before the footer */}
          <div className="w-full flex justify-center mt-10">
             <AdSlot className="w-full max-w-[970px] h-[90px]" slot="YOUR_BOTTOM_AD_SLOT_ID" />
          </div>
          
        </div>
        
        <FooterSeoContent />
        <Footer />
      </div>
    </Router>
  );
}
