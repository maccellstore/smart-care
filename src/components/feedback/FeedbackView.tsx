import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n/translations';
import confetti from 'canvas-confetti';
import { 
  Star, 
  Search, 
  Plus, 
  ExternalLink, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Share2, 
  Copy, 
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';

export const FeedbackView: React.FC = () => {
  const { feedbacks, submitCustomerFeedback, jobs, language, addToast } = useApp();
  const t = useI18n(language);

  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);

  // Simulator states
  const [simJobId, setSimJobId] = useState(jobs[0]?.id || '');
  const [simRating, setSimRating] = useState(5);
  const [simComment, setSimComment] = useState('Excellent service! Fixed my MacBook screen within 24 hours. Highly recommended.');
  const [simHoverRating, setSimHoverRating] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // NPS & CSAT
  const total = feedbacks.length || 1;
  const avg = (feedbacks.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(1);
  const fiveStars = feedbacks.filter(f => f.rating === 5).length;
  const fourStars = feedbacks.filter(f => f.rating === 4).length;
  const lowStars = feedbacks.filter(f => f.rating <= 3).length;
  const googleRedirected = feedbacks.filter(f => f.routedToGoogle).length;
  const nps = Math.round(((fiveStars - lowStars) / total) * 100);

  const filtered = feedbacks.filter(f => {
    if (filterRating !== 'all' && f.rating !== filterRating) return false;
    return true;
  });

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const job = jobs.find(j => j.id === simJobId);
    if (!job) return;

    const isHigh = simRating >= 4;

    submitCustomerFeedback({
      jobId: job.id,
      jobNumber: job.jobNumber,
      customerId: job.customerId,
      customerName: job.customerName,
      deviceModel: `${job.deviceBrand} ${job.deviceModel}`,
      rating: simRating,
      comment: simComment
    });

    if (isHigh) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setHasSubmitted(true);
  };

  const copyGoogleReviewLink = () => {
    navigator.clipboard.writeText('https://g.page/r/SmartCareServiceCenter/review');
    addToast('Google Business Review URL copied to clipboard!', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {t('navFeedback')}
          </h1>
          <p className="text-xs text-slate-500">
            Intelligent Google Review routing funnel, customer satisfaction scoring & reputation management
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyGoogleReviewLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition"
          >
            <Copy className="w-3.5 h-3.5 text-blue-500" />
            <span>Copy Google Review Link</span>
          </button>

          <button
            onClick={() => {
              setHasSubmitted(false);
              setShowSimulatorModal(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 active:scale-95 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Test Review Funnel Flow</span>
          </button>
        </div>
      </div>

      {/* Logic Explainer Card */}
      <div className="rounded-3xl border border-amber-200 dark:border-amber-900/60 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              ★
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                SmartCare Two-Way Review Routing Architecture
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Automatically triggered via WhatsApp after a work order is marked <span className="font-bold text-emerald-600">DELIVERED</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-amber-200/60 dark:border-amber-900/40">
          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200 dark:border-emerald-900 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Positive Ratings (4★ & 5★) — Google Reviews Boost</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px]">
              Customer is praised and immediately forwarded to SmartCare’s verified <strong>Google Business Maps review page</strong> with pre-filled positive keywords to maximize local SEO rankings in Kannur / Kerala.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-rose-200 dark:border-rose-900 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-400">
              <AlertCircle className="w-4 h-4" />
              <span>Constructive Ratings (1★ to 3★) — Service Recovery</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px]">
              Feedback stays private and routes exclusively to the Service Center Manager & Admin to intercept negative public reviews and offer immediate warranty rework or service resolution.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Average CSAT</span>
          <div className="text-2xl font-extrabold text-amber-500 mt-1 flex items-center gap-1">
            <span>{avg}</span>
            <span className="text-base">/ 5.0</span>
          </div>
          <span className="text-[11px] text-slate-500">{feedbacks.length} Verified Customer Ratings</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Net Promoter Score (NPS)</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            +{nps}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">World-class satisfaction rating</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Forwarded to Google</span>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 font-mono">
            {googleRedirected} Reviews
          </div>
          <span className="text-[11px] text-slate-500 font-medium">{Math.round((googleRedirected / total) * 100)}% positive conversion</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Private Grievances</span>
          <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1 font-mono">
            {lowStars} Case(s)
          </div>
          <span className="text-[11px] text-purple-600 font-medium">Shielded from public Google page</span>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterRating('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            filterRating === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          All Reviews ({feedbacks.length})
        </button>

        {[5, 4, 3, 2, 1].map((r) => (
          <button
            key={r}
            onClick={() => setFilterRating(r)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
              filterRating === r
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <span>{r}★</span>
            <span className="text-[10px] opacity-75">
              ({feedbacks.filter(f => f.rating === r).length})
            </span>
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((fb) => (
          <div
            key={fb.id}
            className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < fb.rating ? 'fill-amber-500' : 'text-slate-200 dark:text-slate-700'}`}
                    />
                  ))}
                </div>

                {fb.routedToGoogle ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
                    <ExternalLink className="w-2.5 h-2.5" />
                    Google Review
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                    Private Escalation
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                "{fb.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">{fb.customerName}</span>
                <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">Job #{fb.jobNumber}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{fb.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Simulator Modal */}
      {showSimulatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            {!hasSubmitted ? (
              <form onSubmit={handleSimulateSubmit} className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                    <Star className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Customer Post-Repair Feedback
                    </h3>
                    <p className="text-xs text-slate-500">Test how rating affects the Google review routing</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Delivered Work Order
                  </label>
                  <select
                    value={simJobId}
                    onChange={(e) => setSimJobId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold"
                  >
                    {jobs.map(j => (
                      <option key={j.id} value={j.id}>{j.jobNumber} — {j.customerName} ({j.deviceBrand} {j.deviceModel})</option>
                    ))}
                  </select>
                </div>

                <div className="text-center py-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    How was your repair experience?
                  </label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onMouseEnter={() => setSimHoverRating(star)}
                        onMouseLeave={() => setSimHoverRating(0)}
                        onClick={() => setSimRating(star)}
                        className="p-1 transition-transform hover:scale-125"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            (simHoverRating || simRating) >= star
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-600 block mt-2">
                    {simRating === 5 ? '5/5 — Perfect & Super Fast!' :
                     simRating === 4 ? '4/5 — Very Good Service' :
                     simRating === 3 ? '3/5 — Average' : 'Needs Immediate Improvement'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Customer Comments
                  </label>
                  <textarea
                    rows={3}
                    value={simComment}
                    onChange={(e) => setSimComment(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSimulatorModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold shadow-md"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4 animate-fade-in">
                {simRating >= 4 ? (
                  <>
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                      <Sparkles className="w-8 h-8 animate-spin-slow" />
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      Thank you for your {simRating}★ Review!
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Your positive experience means the world to our technicians. Would you mind copying your feedback to our <strong>Google Maps Business Page</strong>?
                    </p>
                    <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-xs font-mono text-blue-700 dark:text-blue-300 text-left">
                      "{simComment}"
                    </div>
                    <div className="pt-2 flex flex-col gap-2">
                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Publish on Google Reviews</span>
                      </a>
                      <button
                        onClick={() => setShowSimulatorModal(false)}
                        className="w-full py-2 text-xs font-semibold text-slate-500"
                      >
                        Close
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      We Apologize for Falling Short
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Your response has been routed directly to our <strong>General Manager</strong>. A senior support specialist will call you within 2 hours to resolve any pending defects or issue a warranty priority bench re-check.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => setShowSimulatorModal(false)}
                        className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold"
                      >
                        Done
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
