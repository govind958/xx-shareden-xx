"use client";
import React, { FC } from 'react';
import UserSideNavbar from "../components/UserSideNavbar";
import Footer from "../components/UserSideFooterHomePage";
import Hero from "../components/HomePageHeroSection";
import TrustedBy from "../components/HomePageTrustSection";
import ProblemSection from "../components/HomePageProblemSection";

const StackboardClassic: FC = () => {
  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#0a0a0a] font-sans antialiased selection:bg-[#c53030] selection:text-white">
      <UserSideNavbar />

      <main>
        {/* HERO */}
        <section className="py-20 md:py-32 px-6 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1A365D] leading-[1.1]">
              Centralized platform for
              <br />
              <span className="text-[#2B6CB0]">agile project teams.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Stackboard combines project management, collaboration, and
              resource planning into one unified workspace to keep your teams
              aligned and productive.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
              <Link 
                href="/login" 
                className="px-8 py-3.5 bg-[#2B6CB0] text-white rounded-xl text-base font-semibold hover:bg-[#1e4e80] transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center hover:-translate-y-0.5"
              >
                Start Free Trial
              </Link>
              <Link 
                href="/login" 
                className="px-8 py-3.5 border-2 border-[#1A365D] text-[#1A365D] rounded-xl text-base font-semibold hover:bg-slate-50 transition-all flex items-center justify-center hover:-translate-y-0.5"
              >
                Book Demo
              </Link>
            </div>
          </div>
        </section>

        {/* CUSTOMIZATION SECTION */}
        <section className="py-24 px-6 bg-[#2B6CB0] text-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center mb-16">
              <div className="flex gap-1 p-1 bg-white/10 rounded-full border border-white/10">
                <button className="rounded-full bg-white text-[#2B6CB0] px-5 py-2 text-xs font-bold transition">
                  Customize projects
                </button>
                <button className="rounded-full text-white hover:bg-white/10 px-5 py-2 text-xs font-medium transition">
                  Automate workflows
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                  Customize your experience
                </h2>
                <p className="text-lg text-blue-100/90 leading-relaxed">
                  Build your projects from end-to-end to capture unique
                  requirements. Create personalized fields, modules, statuses,
                  and workflows to manage and track industry-specific work
                  metrics.
                </p>
                <Link
                  href="/features/customization"
                  className="inline-flex items-center gap-2 text-white font-semibold group hover:underline underline-offset-8 decoration-2"
                >
                  Learn more about project customization
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="bg-[#1e4e80]/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm mt-12 max-w-md">
                  <p className="text-lg text-blue-50 mb-6 italic leading-relaxed">
                    &ldquo;Stackboard helped us achieve about 300% growth rate for our business by unifying our data.&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://avatar.iran.liara.run/public/30"
                      alt="Hassan Al-aidy"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full border-2 border-white/20 bg-slate-200"
                    />
                    <div>
                      <p className="font-bold text-sm text-white">Hassan Al-aidy</p>
                      <p className="text-blue-300 text-xs">CEO, InnovateX</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* UI MOCKUP */}
              <div className="relative">
                <div className="bg-[#1e4e80] p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-bold text-blue-300 uppercase tracking-[0.2em]">
                      Task Information
                    </h4>
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-400/80" />
                      <div className="w-2 h-2 rounded-full bg-yellow-400/80" />
                      <div className="w-2 h-2 rounded-full bg-green-400/80" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <InputField label="Owner" icon={Users} />
                    <div />
                    <StatusField />
                    <DatePickerField label="Due Date" />
                    <div className="border border-dashed border-white/20 rounded-xl h-12 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white/20" />
                    </div>
                    <DatePickerField label="Start Date" />
                    <InputField label="Rate / Hour" />
                    <SelectField label="Billing Type" />
                  </div>
                </div>

                {/* OVERLAY DIALOG */}
                <div className="absolute -bottom-10 -left-6 md:-left-12 bg-white rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] w-64 border border-slate-100 text-slate-800 hidden sm:block">
                  <div className="flex gap-4 border-b border-slate-100 mb-4 pb-3 text-xs">
                    <span className="font-bold text-[#2B6CB0] border-b-2 border-[#2B6CB0] pb-3 -mb-[13px]">
                      New Fields
                    </span>
                    <span className="text-slate-400">Available</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <FieldItem label="Single Line" />
                    <FieldItem label="Multi-Select" />
                    <FieldItem label="Pick List" active />
                    <FieldItem label="Date" />
                    <FieldItem label="User List" />
                    <FieldItem label="Currency" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SUCCESS STORIES */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-4 bg-blue-50 rounded-[2rem] -z-10 group-hover:scale-105 transition duration-500 opacity-0 group-hover:opacity-100" />
              <div className="relative rounded-2xl overflow-hidden aspect-video shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                  alt="Team collaboration"
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#1A365D]/40 flex items-center justify-center transition-opacity group-hover:bg-[#1A365D]/20">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#2B6CB0] shadow-2xl group-hover:scale-110 transition duration-300">
                    <Play className="w-5 h-5 fill-current ml-1" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A365D] leading-tight">
                Hear firsthand how we transform businesses
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Witness how Stackboard streamlines operations, enhances
                customer service, and drives profitability. Learn about success stories from leaders who leverage our agile platform.
              </p>
              <Link 
                href="/success-stories" 
                className="inline-block px-8 py-3.5 bg-[#1A365D] text-white rounded-full text-sm font-bold hover:bg-black transition-all hover:shadow-xl active:scale-95"
              >
                Explore success stories
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURE CAROUSEL */}
        <section className="py-24 px-6 bg-[#F7FAFC]">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="bg-white p-10 md:p-14 rounded-[2.5rem] border border-slate-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#2B6CB0]" />
              <h3 className="text-3xl font-bold text-[#1A365D] mb-6">Plan faster</h3>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  <strong className="text-[#2B6CB0]">Offer a seamless planning experience</strong> for your teams using agile tools. Drag and adjust timelines in moments with over 10 methodologies.
                </p>
                <p>Plan offline and sync once you&apos;re back. Use your mobile device to scan requirements directly into the backlog.</p>
              </div>

              <div className="flex items-center gap-4 mt-10">
                <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all text-slate-400 hover:text-[#2B6CB0] hover:border-[#2B6CB0]">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all text-slate-400 hover:text-[#2B6CB0] hover:border-[#2B6CB0]">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === 0 ? "w-6 bg-[#2B6CB0]" : "w-1.5 bg-slate-300"}`} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 text-center bg-[#1A365D] text-white">
          <div className="max-w-2xl mx-auto space-y-10">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Ready to unify your teams?</h2>
            <Link 
              href="/signup" 
              className="inline-block px-10 py-4 bg-[#2B6CB0] text-white rounded-xl text-lg font-bold hover:bg-[#3182ce] transition-all shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 active:scale-95"
            >
              Get Started Today — It&apos;s Free
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

// --- HELPER UI COMPONENTS ---

const InputField = ({ label, icon: Icon }: { label: string; icon?: React.ElementType }) => (
  <div className="border border-white/10 bg-white/5 rounded-xl p-3 text-[12px] flex items-center justify-between text-blue-100/60 transition hover:bg-white/10 cursor-default">
    <span>{label}</span>
    {Icon && <Icon className="w-3.5 h-3.5 text-white/30" />}
  </div>
);

const StatusField = () => (
  <div className="border border-white/10 bg-white/5 rounded-xl p-3 text-[12px] flex items-center justify-between text-blue-100/60">
    <span>Status</span>
    <div className="flex items-center gap-2 bg-[#1A365D] px-2 py-0.5 rounded border border-white/10 text-[9px] text-white font-bold cursor-pointer hover:bg-blue-900 transition">
      OPEN <ChevronDown className="w-2.5 h-2.5 text-blue-300" />
    </div>
  </div>
);

const DatePickerField = ({ label }: { label: string }) => (
  <div className="border border-white/10 bg-white/5 rounded-xl p-3 text-[12px] flex items-center justify-between text-blue-100/60 cursor-pointer hover:bg-white/10 transition">
    <span>{label}</span>
    <Calendar className="w-3.5 h-3.5 text-white/30" />
  </div>
);

const SelectField = ({ label }: { label: string }) => (
  <div className="border border-white/10 bg-white/5 rounded-xl p-3 text-[12px] flex items-center justify-between text-blue-100/60 cursor-pointer hover:bg-white/10 transition">
    <span>{label}</span>
    <ChevronDown className="w-3.5 h-3.5 text-white/30" />
  </div>
);

const FieldItem = ({ label, active }: { label: string; active?: boolean }) => (
  <div
    className={`p-2 rounded-lg border transition-all cursor-grab flex items-center justify-between group ${
      active 
        ? "bg-teal-50 border-teal-200 text-teal-700 shadow-sm" 
        : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300"
    }`}
  >
    <div className="flex items-center gap-2">
      <div className={`w-1 h-1 rounded-full ${active ? "bg-teal-500" : "bg-slate-300"}`} />
      <span className="font-semibold">{label}</span>
    </div>
    <GripVertical className={`w-3 h-3 ${active ? "text-teal-300" : "text-slate-300"}`} />
  </div>
);

const FOOTER_LINKS = [
  { title: "Product", links: ["Features", "Integrations", "Pricing", "Changelog"] },
  { title: "Solutions", links: ["Engineering", "Marketing", "HR", "Operations"] },
  { title: "Resources", links: ["Documentation", "Help Center", "Community", "Blog"] },
  { title: "Company", links: ["About", "Careers", "Legal", "Privacy"] },
];

export default StackboardClassic;