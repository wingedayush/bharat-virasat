import { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  GraduationCap,
  Building2,
  CheckCircle2,
  ArrowRight,
  LogOut,
  ShieldCheck,
  Award,
  BookOpen,
  Compass,
  Landmark,
  Eye,
  EyeOff,
  Lightbulb,
  Camera
} from 'lucide-react';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { navigate } from '@/hooks/useRouter';
import { MonumentAnimatedBackground } from '@/components/MonumentAnimatedBackground';

export function LoginPage() {
  const { user, isLoggedIn, login, register, loginWithDemo, logout } = useAuth();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [studentId, setStudentId] = useState('');
  const [role, setRole] = useState<UserRole>('student_innovator');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      setErrorMsg('Please enter both your institutional email and password.');
      return;
    }
    login(signInEmail, signInPassword);
    setSuccessMsg('Welcome back! Redirecting to BharatVirasat...');
    setErrorMsg('');
    setTimeout(() => {
      navigate('/unesco');
    }, 800);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    register({
      name,
      email,
      role,
      college: college || 'National Student Innovation Network',
      studentId: studentId || 'STU-' + Math.floor(1000 + Math.random() * 9000)
    });
    setSuccessMsg('Account created successfully! Welcome to Student Innovation Hub.');
    setErrorMsg('');
    setTimeout(() => {
      navigate('/unesco');
    }, 800);
  };

  // If already logged in, show User Profile Dashboard
  if (isLoggedIn && user) {
    return (
      <MonumentAnimatedBackground className="min-h-screen text-stone-100 pt-24 pb-28 px-4 sm:px-6" isFixed={true}>
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Profile Header Card */}
          <div className="relative rounded-3xl overflow-hidden bg-stone-900/90 border border-amber-500/40 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-amber-400 shadow-xl"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80';
                  }}
                />
                <span className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-amber-500 text-stone-950 shadow-md">
                  <GraduationCap className="w-4 h-4" />
                </span>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name}</h1>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold capitalize">
                    {user.role.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-stone-300 text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                  <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                  {user.college || 'National Student Innovation Cell'}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-stone-400 pt-1 font-mono">
                  <span>ID: <strong className="text-stone-200">{user.studentId}</strong></span>
                  <span>•</span>
                  <span>{user.email}</span>
                  <span>•</span>
                  <span>Joined {user.joinedDate}</span>
                </div>
              </div>

              <button
                onClick={logout}
                className="self-center sm:self-start px-4 py-2.5 rounded-2xl bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Badges Strip */}
            <div className="mt-6 pt-6 border-t border-stone-800">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-3">
                🏆 Earned Badges & Civilizational Credentials
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {user.badges.map((b, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl bg-stone-950 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-sm flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Student Innovator Highlights & Quick Action Hub */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-stone-900/80 border border-stone-800 backdrop-blur-md">
              <div className="text-3xl font-extrabold text-amber-400 font-mono">{user.innovationsCount} Ideas</div>
              <p className="text-xs text-stone-300 font-semibold mt-1">Student Innovation Projects</p>
              <p className="text-[11px] text-stone-500 mt-1">Submitted for heritage showcase</p>
            </div>

            <div className="p-5 rounded-3xl bg-stone-900/80 border border-stone-800 backdrop-blur-md">
              <div className="text-3xl font-extrabold text-teal-400 font-mono">{user.sanctumsVisited} Sites</div>
              <p className="text-xs text-stone-300 font-semibold mt-1">UNESCO 3D Sanctums Explored</p>
              <p className="text-[11px] text-stone-500 mt-1">Virtual archaeo-astronomy visits</p>
            </div>

            <div className="p-5 rounded-3xl bg-stone-900/80 border border-stone-800 backdrop-blur-md">
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">100% Verified</div>
              <p className="text-xs text-stone-300 font-semibold mt-1">Student Innovation Pass</p>
              <p className="text-[11px] text-stone-500 mt-1">Full access to AI lens & spoken guides</p>
            </div>
          </div>

          {/* Quick Jump Buttons */}
          <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Continue Your Cultural Innovation Journey
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => navigate('/unesco')}
                className="p-4 rounded-2xl bg-amber-500/15 hover:bg-amber-500 hover:text-stone-950 text-amber-300 border border-amber-500/30 font-bold text-xs flex flex-col items-start gap-2 transition-all group cursor-pointer"
              >
                <Landmark className="w-5 h-5 text-amber-400 group-hover:text-stone-950" />
                <span>32 UNESCO Monuments (Full Cinema)</span>
              </button>

              <button
                onClick={() => navigate('/identify')}
                className="p-4 rounded-2xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700 font-bold text-xs flex flex-col items-start gap-2 transition-all cursor-pointer"
              >
                <Camera className="w-5 h-5 text-teal-400" />
                <span>AI Heritage Camera Lens</span>
              </button>

              <button
                onClick={() => navigate('/ask-bharat')}
                className="p-4 rounded-2xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700 font-bold text-xs flex flex-col items-start gap-2 transition-all cursor-pointer"
              >
                <Lightbulb className="w-5 h-5 text-purple-400" />
                <span>Ask AI Heritage Tutor</span>
              </button>

              <button
                onClick={() => navigate('/quiz')}
                className="p-4 rounded-2xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700 font-bold text-xs flex flex-col items-start gap-2 transition-all cursor-pointer"
              >
                <Award className="w-5 h-5 text-emerald-400" />
                <span>Civilizational Quiz & Points</span>
              </button>
            </div>
          </div>
        </div>
      </MonumentAnimatedBackground>
    );
  }

  // If not logged in, show Auth Screen (Sign In / Sign Up + 1-Click Demo Logins)
  return (
    <MonumentAnimatedBackground className="min-h-screen text-stone-100 pt-20 pb-28 px-4 sm:px-6" isFixed={true}>
      <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>Student Innovation Portal • BharatVirasat</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Enter the Sanctum of <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">Bharat</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto">
            Student Innovation Ideas showcasing the rich cultural heritage and traditions of India.
          </p>
        </div>

        {/* 1-Click Evaluator / Demo Login Cards */}
        <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-md space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              Instant 1-Click Demo Passes (For Evaluators & Judges)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => loginWithDemo('lead')}
              className="p-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500 hover:text-stone-950 text-left border border-amber-400/60 transition-all flex items-center gap-3 group cursor-pointer shadow-md"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 font-black flex items-center justify-center shrink-0">
                👑
              </div>
              <div className="overflow-hidden">
                <span className="font-bold text-xs block text-white group-hover:text-stone-950 truncate">
                  Ayush Raj
                </span>
                <span className="text-[10px] text-amber-300 group-hover:text-stone-900 truncate block font-medium">
                  Team Lead (Wintech)
                </span>
              </div>
            </button>

            <button
              onClick={() => loginWithDemo('student')}
              className="p-3 rounded-2xl bg-stone-900/90 hover:bg-amber-500 hover:text-stone-950 text-left border border-stone-750 transition-all flex items-center gap-3 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 group-hover:bg-stone-950 group-hover:text-amber-400 flex items-center justify-center shrink-0 font-bold">
                🎓
              </div>
              <div className="overflow-hidden">
                <span className="font-bold text-xs block text-white group-hover:text-stone-950 truncate">
                  Aarav Sharma
                </span>
                <span className="text-[10px] text-stone-400 group-hover:text-stone-900 truncate block">
                  Student Innovator
                </span>
              </div>
            </button>

            <button
              onClick={() => loginWithDemo('scholar')}
              className="p-3 rounded-2xl bg-stone-900/90 hover:bg-teal-500 hover:text-stone-950 text-left border border-stone-750 transition-all flex items-center gap-3 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 group-hover:bg-stone-950 group-hover:text-teal-400 flex items-center justify-center shrink-0 font-bold">
                📜
              </div>
              <div className="overflow-hidden">
                <span className="font-bold text-xs block text-white group-hover:text-stone-950 truncate">
                  Dr. Meera Nambiar
                </span>
                <span className="text-[10px] text-stone-400 group-hover:text-stone-900 truncate block">
                  ASI Heritage Scholar
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Main Auth Form Box */}
        <div className="rounded-3xl bg-stone-900/90 border border-stone-800 p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-stone-950 border border-stone-800">
            <button
              onClick={() => { setAuthMode('signin'); setErrorMsg(''); setSuccessMsg(''); }}
              className={'py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ' + (
                authMode === 'signin'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
              className={'py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ' + (
                authMode === 'signup'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              )}
            >
              Student Pass Registration
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {successMsg}
            </div>
          )}

          {/* SIGN IN FORM */}
          {authMode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                  College / Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="student@university.edu.in"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:border-amber-500 focus:outline-none placeholder-stone-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[11px] text-amber-400 hover:underline cursor-pointer">
                    Forgot code?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:border-amber-500 focus:outline-none placeholder-stone-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-xs shadow-xl shadow-amber-900/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
              >
                <span>Sign In to Student Heritage Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* SIGN UP / STUDENT REGISTRATION FORM */
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Priyanshu Verma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:border-amber-500 focus:outline-none placeholder-stone-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                    College / University
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Delhi University / IIT"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:border-amber-500 focus:outline-none placeholder-stone-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                    Student ID / Roll No.
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. 2024CSB1042"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:border-amber-500 focus:outline-none placeholder-stone-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Select Innovation Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student_innovator')}
                    className={'p-2.5 rounded-xl text-left border text-xs font-semibold transition-all cursor-pointer ' + (
                      role === 'student_innovator'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                        : 'bg-stone-950 text-stone-400 border-stone-800'
                    )}
                  >
                    🎓 Student Innovator
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('heritage_scholar')}
                    className={'p-2.5 rounded-xl text-left border text-xs font-semibold transition-all cursor-pointer ' + (
                      role === 'heritage_scholar'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                        : 'bg-stone-950 text-stone-400 border-stone-800'
                    )}
                  >
                    🏛️ Heritage Scholar
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="name@college.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:border-amber-500 focus:outline-none placeholder-stone-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:border-amber-500 focus:outline-none placeholder-stone-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-xs shadow-xl shadow-amber-900/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
              >
                <span>Create Student Innovation Pass</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Institutional Trust Seal */}
          <div className="pt-4 border-t border-stone-800/80 flex items-center justify-center gap-2 text-stone-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted • National Student Heritage & Innovation Network</span>
          </div>
        </div>

        {/* Creator Attribution Card */}
        <div className="p-4 rounded-2xl bg-stone-900/70 border border-stone-800 flex items-center justify-between text-xs text-stone-400 shadow-md">
          <span>Platform engineered by <strong className="text-white">Team Wintech</strong> (Led by Ayush Raj)</span>
          <button
            onClick={() => navigate('/team')}
            className="text-amber-400 hover:text-amber-300 font-bold hover:underline cursor-pointer"
          >
            Meet the Builders &rarr;
          </button>
        </div>
      </div>
    </MonumentAnimatedBackground>
  );
}
