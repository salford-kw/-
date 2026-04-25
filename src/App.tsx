/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Github, ExternalLink, Code2, Rocket, Share2, ShieldCheck, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'export' | 'integration'>('export');
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('github_token'));

  // Listen for OAuth success message
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GITHUB_AUTH_SUCCESS') {
        const token = event.data.accessToken;
        setAccessToken(token);
        localStorage.setItem('github_token', token);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnectGitHub = async () => {
    try {
      const res = await fetch('/api/auth/github/url');
      const { url } = await res.json();
      window.open(url, 'github_oauth', 'width=600,height=700');
    } catch (err) {
      console.error('Failed to get auth URL', err);
    }
  };

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem('github_token');
    setUserData(null);
  };

  const searchGithubUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;
    setLoading(true);
    try {
      const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
      };
      if (accessToken) {
        headers['Authorization'] = `token ${accessToken}`;
      }

      const res = await fetch(`https://api.github.com/users/${searchTerm}`, { headers });
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans selection:bg-black selection:text-white" dir="rtl">
      {/* Navigation / Header */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-black p-2 rounded-xl text-white">
              <Github size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">رابط GitHub</h1>
          </div>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('export')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'export' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              تصدير الكود
            </button>
            <button
              onClick={() => setActiveTab('integration')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'integration' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              دمج API
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'export' ? (
            <motion.div
              key="export"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-4xl font-extrabold text-black">كيف تحفظ مشروعك على GitHub؟</h2>
                <p className="text-lg text-gray-500">طريقة تصدير الكود من Google AI Studio إلى حسابك الشخصي.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <StepCard
                  index="1"
                  icon={<Share2 className="text-blue-600" />}
                  title="الدخول للإعدادات"
                  description="افتح قائمة الإعدادات (Settings) في الجزء العلوي أو السفلي من واجهة AI Studio."
                />
                <StepCard
                  index="2"
                  icon={<Rocket className="text-purple-600" />}
                  title="اختيار التصدير"
                  description="ابحث عن خيار 'Export to GitHub' أو 'Download ZIP' إذا كنت تفضل الرفع يدوياً."
                />
                <StepCard
                  index="3"
                  icon={<ShieldCheck className="text-emerald-600" />}
                  title="ربط الحساب"
                  description="سيُطلب منك تسجيل الدخول بحساب GitHub الخاص بك وتحديد المستودع (Repository) الذي ترغب في الرفع إليه."
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ExternalLink size={20} className="text-blue-500" />
                  لماذا تربط مشروعك بـ GitHub؟
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <ChevronRight size={18} className="mt-1 text-gray-400" />
                    <div>
                      <p className="font-semibold">حفظ الإصدارات</p>
                      <p className="text-sm text-gray-500">تتبع كل تغيير تقوم به والرجوع إليه في أي وقت.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight size={18} className="mt-1 text-gray-400" />
                    <div>
                      <p className="font-semibold">النشر (Deployment)</p>
                      <p className="text-sm text-gray-500">سهولة ربط المشروع بخدمات مثل Vercel أو Netlify أو GitHub Pages.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight size={18} className="mt-1 text-gray-400" />
                    <div>
                      <p className="font-semibold">التعاون مع الآخرين</p>
                      <p className="text-sm text-gray-500">دعوة مبرمجين آخرين للمساهمة في مشروعك.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="integration"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              <div className="space-y-2">
                <h2 className="text-4xl font-extrabold text-black">استخدام GitHub داخل تطبيقك</h2>
                <p className="text-lg text-gray-500">يمكنك جلب بيانات المستخدمين أو المستودعات باستخدام GitHub API.</p>
              </div>

              {/* API Demo Section */}
              <div className="bg-black text-white rounded-3xl p-8 shadow-2xl overflow-hidden relative">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Code2 size={28} className="text-blue-400" />
                      تجربة جلب البيانات (Live Demo)
                    </div>
                    {accessToken ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                          <ShieldCheck size={12} />
                          متصل بـ GitHub
                        </span>
                        <button onClick={logout} className="text-xs text-gray-400 hover:text-white transition-colors underline decoration-gray-600 underline-offset-4">تسجيل الخروج</button>
                      </div>
                    ) : (
                      <button 
                        onClick={handleConnectGitHub}
                        className="text-xs bg-white text-black px-4 py-2 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
                      >
                        <Github size={14} />
                        ربط حساب GitHub
                      </button>
                    )}
                  </h3>
                  
                  {!accessToken && (
                    <div className="mb-8 p-4 bg-blue-600/10 border border-blue-600/20 rounded-2xl flex items-start gap-3">
                      <div className="bg-blue-600 p-2 rounded-lg text-white mt-1">
                        <ShieldCheck size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">التوثيق المطلوب</p>
                        <p className="text-xs text-blue-200/70 leading-relaxed">لضمان عدم حظر الطلبات من قبل GitHub ورفع سقف الاستخدام، يرجى ربط حسابك أولاً.</p>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={searchGithubUser} className="flex gap-2 max-w-md mb-8">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="اسم المستخدم (مثال: octocat)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white placeholder:text-gray-500"
                        dir="ltr"
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
                    >
                      بحث
                    </button>
                  </form>

                  {loading && <p className="text-blue-400 animate-pulse">جاري جلب البيانات من GitHub...</p>}

                  {userData && !loading && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-6"
                    >
                      {userData.avatar_url && (
                        <img src={userData.avatar_url} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-white/10" />
                      )}
                      <div className="space-y-1">
                        <p className="text-2xl font-bold">{userData.name || userData.login}</p>
                        <p className="text-gray-400 font-mono text-sm">@{userData.login}</p>
                        <div className="flex gap-4 mt-2">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">Followers</p>
                            <p className="text-lg font-bold">{userData.followers}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">Repos</p>
                            <p className="text-lg font-bold">{userData.public_repos}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {!userData && !loading && (
                    <div className="text-gray-500 italic py-10 border border-dashed border-white/10 rounded-2xl text-center">
                      ابحث عن أي مستخدم على GitHub لرؤية النتائج مباشرة
                    </div>
                  )}
                </div>

                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -z-0" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 blur-[100px] -z-0" />
              </div>

              {/* Implementation Steps */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-black border-r-4 border-blue-600 pr-3">للمطورين: كيف تدمج GitHub؟</h4>
                  <p className="text-gray-600 leading-relaxed">
                    إذا أردت بناء تطبيق يطلب من المستخدم تسجيل الدخول بـ GitHub، ستحتاج إلى إتباع بروتوكول 
                    <span className="font-bold mx-1 text-blue-600 underline underline-offset-4">OAuth 2.0</span>.
                  </p>
                  <ul className="space-y-3 list-decimal list-inside text-gray-700">
                    <li>إنشاء <span className="font-semibold italic">GitHub OAuth App</span> في إعدادات مطوري GitHub.</li>
                    <li>الحصول على <span className="p-1 bg-gray-100 rounded font-mono text-xs">Client ID</span> و <span className="p-1 bg-gray-100 rounded font-mono text-xs">Client Secret</span>.</li>
                    <li>إعداد رابط العودة (Callback URL) ليشير إلى تطبيقك.</li>
                    <li>استخدام مكتبات مثل <span className="text-blue-600">Firebase Auth</span> أو <span className="text-blue-600">NextAuth</span> لتسهيل العملية.</li>
                  </ul>
                </div>
                <div className="bg-gray-100 rounded-3xl p-6 flex flex-col justify-center">
                  <p className="text-sm font-mono text-gray-500 mb-4">// مثال برمجي (JS)</p>
                  <code className="text-xs md:text-sm bg-gray-200 p-4 rounded-xl leading-relaxed font-mono block overflow-x-auto whitespace-pre">
{`async function getProfile(username) {
  const response = await fetch(
    \`https://api.github.com/users/\${username}\`
  );
  return await response.json();
}`}
                  </code>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-gray-200 mt-12 text-center text-gray-400 text-sm">
        تطبيق تعليمي مبني باستخدام Google AI Studio
      </footer>
    </div>
  );
}

function StepCard({ index, title, description, icon }: { index: string, title: string, description: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 hover:shadow-xl transition-all hover:-translate-y-1 group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gray-100 rounded-2xl group-hover:bg-white group-hover:scale-110 transition-all duration-300">
          {icon}
        </div>
        <span className="text-4xl font-black text-gray-100 group-hover:text-gray-200 transition-colors uppercase italic font-serif">{index}</span>
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

