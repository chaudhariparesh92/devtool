import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
import WebsiteCheckerTool from './pages/tools/WebsiteCheckerTool';

import AdSlot from './components/AdSlot';

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

  { path: '/website-checker', component: WebsiteCheckerTool },
];

function BrandBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-8 border border-violet-500/20 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 p-[1px] shadow-2xl shadow-violet-500/10">
      <div className="relative overflow-hidden rounded-[15px] bg-slate-950 px-6 py-7 sm:px-10">
        
        {/* Glow effects */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center rounded-full bg-emerald-400/10 border border-emerald-400/30 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-400">
                ✦ 100% Free
              </span>

              <span className="text-xs font-medium text-slate-400">
                No signup required
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              <span className="text-white">FREE </span>
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                OnlineDeveloperTool
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-400">
              Fast, free developer tools for JSON, JWT, UUID, Regex, Hashes,
              Encoding, Timestamps, Colors and more.
            </p>
          </div>

          <div className="flex-shrink-0">
            <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
              <div className="text-2xl font-black text-white">
                40+ <span className="text-violet-400">Tools</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Built for developers
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdPlaceholder({ children }) {
  return (
    <div className="relative">
      {children}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#070b14] transition-colors">

        {/* Decorative background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-500/5 dark:bg-violet-500/10 blur-3xl" />
          <div className="absolute top-[40%] right-0 w-[400px] h-[400px] rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 blur-3xl" />
        </div>

        <Header />

        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-[1440px] flex-grow">

          {/* Brand / attention banner */}
          <BrandBanner />

          {/* Main content */}
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Content */}
            <main className="flex-grow min-w-0">

              {/* Top ad */}
              <AdPlaceholder>
                <div className="w-full flex justify-center mb-6">
                  <AdSlot
                    className="w-full max-w-[970px] h-[60px]"
                    height="60px"
                    slot="YOUR_TOP_AD_SLOT_ID"
                  />
                </div>
              </AdPlaceholder>

              {/* Page */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-slate-900/60 shadow-xl shadow-slate-200/40 dark:shadow-black/20 overflow-hidden">
                <div className="p-4 sm:p-6 lg:p-8">
                  <Routes>
                    {routes.map((r, i) => (
                      <Route
                        key={i}
                        path={r.path}
                        element={<r.component path={r.path} />}
                      />
                    ))}

                    <Route
                      path="*"
                      element={
                        <div className="text-center py-24">
                          <div className="text-7xl font-black bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">
                            404
                          </div>
                          <h2 className="mt-4 text-2xl font-black">
                            Tool not found
                          </h2>
                          <p className="mt-2 text-slate-500 dark:text-slate-400">
                            Looks like this tool escaped the toolbox.
                          </p>
                        </div>
                      }
                    />
                  </Routes>
                </div>
              </div>
            </main>

            {/* Sidebar */}
            <aside className="w-full lg:w-[300px] flex-shrink-0">
              <div className="sticky top-6 space-y-6">

                <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-b from-violet-500/10 to-transparent p-3">
                  <div className="px-2 pb-3">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">
                      Developer Space
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Tools that get out of your way.
                    </div>
                  </div>

                  <AdSlot
                    className="w-[300px] h-[600px]"
                    height="600px"
                    slot="YOUR_SIDEBAR_AD_SLOT_1"
                  />
                </div>

                <AdSlot
                  className="w-[300px] h-[250px]"
                  height="250px"
                  slot="YOUR_SIDEBAR_AD_SLOT_2"
                />

              </div>
            </aside>

          </div>

          {/* Bottom ad */}
          <div className="w-full flex justify-center mt-8">
            <AdSlot
              className="w-full max-w-[970px] h-[90px]"
              height="90px"
              slot="YOUR_BOTTOM_AD_SLOT_ID"
            />
          </div>

        </div>

        <Footer />
      </div>
    </Router>
  );
}
