'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/src/context/AuthContext';
import { 
  ChevronLeft, 
  Info, 
  Trash2, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Tag, 
  X 
} from 'lucide-react';
import BuyNowButton from '@/src/components/buynowbutton';

/* --- LOADING COMPONENT --- */
const LoadingPage = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="flex gap-2">
      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
      <div className="w-2 h-2 rounded-full bg-gray-200 animate-pulse delay-75" />
      <div className="w-2 h-2 rounded-full bg-gray-200 animate-pulse delay-150" />
      <div className="w-2 h-2 rounded-full bg-gray-200 animate-pulse delay-300" />
      <div className="w-2 h-2 rounded-full bg-gray-200 animate-pulse delay-500" />
    </div>
  </div>
);

/* ---------------- TYPES ---------------- */
interface SubStack {
  id?: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStack {
  cart_id: string;
  stack_id: string | null;
  name: string;
  type: string;
  price: number;
  sub_stacks: SubStack[];
}

type PaymentTab = 'Recurring' | 'Non-Recurring';
type RecurringType = 'Credit Card' | 'UPI';

export default function ZohoStyleCheckout() {
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1); // 1: Add-ons, 2: Payment
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Yearly'>('Yearly');
  
  // Payment Method States
  const [activeTab, setActiveTab] = useState<PaymentTab>('Recurring');
  const [recurringMethod, setRecurringMethod] = useState<RecurringType>('Credit Card');

  // Coupon States
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  const [cartStacks, setCartStacks] = useState<CartStack[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [organizationData, setOrganizationData] = useState<any>(null);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      // Create a minimum delay timer to show the animation nicely
      const timer = new Promise((resolve) => setTimeout(resolve, 1500));

      if (authLoading || !user) {
        if (!authLoading && !user) setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const [prof, org, cart] = await Promise.all([
          supabase.from('profiles').select('name').eq('user_id', user.id).single(),
          supabase.from('organizations').select('org_name').eq('user_id', user.id).single(),
          supabase.from('cart_stacks').select(`id, total_price, cluster_name, cluster_data, stacks (id, name, type)`).eq('user_id', user.id).eq('status', 'active'),
          timer // Wait for the minimum 1.5s delay
        ]);
        
        setProfileData({ email: user.email || '', name: prof.data?.name || '' });
        setOrganizationData({ name: org.data?.org_name || '' });

        if (cart.data) {
          const formatted = cart.data.map((item: any) => ({
            cart_id: item.id,
            stack_id: item.stacks?.id || null,
            name: item.cluster_name || item.stacks?.name || 'Professional Plan',
            type: item.stacks?.type || 'standard',
            price: item.total_price || 0,
            sub_stacks: (item.cluster_data as any[])?.map(s => ({ 
                name: s.name, 
                price: s.price || 0, 
                quantity: 1 
            })) || []
          }));
          setCartStacks(formatted);
        }
      } catch (e) { 
          console.error("Fetch Error:", e); 
      } finally { 
          setLoading(false); 
      }
    };
    fetchCheckoutData();
  }, [user, authLoading]);

  // Logic Helpers
  const removeItem = (stackIndex: number, subIndex?: number) => {
    const newStacks = [...cartStacks];
    if (subIndex !== undefined) {
        newStacks[stackIndex].sub_stacks.splice(subIndex, 1);
    } else {
        newStacks.splice(stackIndex, 1);
    }
    setCartStacks(newStacks);
  };

  const updateQuantity = (stackIndex: number, subIndex: number, val: string) => {
    const qty = Math.max(0, parseInt(val) || 0);
    const newStacks = [...cartStacks];
    newStacks[stackIndex].sub_stacks[subIndex].quantity = qty;
    setCartStacks(newStacks);
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    if (couponInput.toUpperCase() === 'SAVE10') {
        setAppliedCoupon({ code: 'SAVE10', discount: 500 });
        setCouponInput('');
    } else {
        setCouponError('Invalid coupon code');
    }
  };

  const removeCoupon = () => setAppliedCoupon(null);

  // Calculations
  const subtotal = useMemo(() => {
    let total = 0;
    cartStacks.forEach(stack => {
        total += stack.price;
        stack.sub_stacks.forEach(sub => {
            total += (sub.price * sub.quantity);
        });
    });
    return billingCycle === 'Yearly' ? total : total * 1.2;
  }, [cartStacks, billingCycle]);

  const totalPayable = Math.max(0, subtotal - (appliedCoupon?.discount || 0));

  /* --- CONDITIONAL RENDER FOR LOADING --- */
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] font-sans text-slate-700">
      
      {/* STEPPER HEADER - DEEP NAVY BACKGROUND */}
      <div className="w-full bg-[#1A365D] text-white pt-8 pb-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#38A169] flex items-center justify-center text-xs text-white">✓</span>
              <span className="opacity-80 text-xs">Plan</span>
            </div>
            <div className="w-12 h-[1px] bg-white/20" />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${step === 1 ? 'bg-white text-[#1A365D]' : 'bg-[#38A169] border-none'}`}>
                {step > 1 ? '✓' : '2'}
              </span>
              <span className={step === 1 ? 'font-bold' : 'opacity-80'}>Add-ons</span>
            </div>
            <div className="w-12 h-[1px] bg-white/20" />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${step === 2 ? 'bg-white text-[#1A365D]' : 'border-white/40'}`}>3</span>
              <span className={step === 2 ? 'font-bold' : 'opacity-60'}>Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-6">
          
          <div className="flex-1 space-y-4">
            
            {/* PLAN SELECTOR CARD */}
            <div className="bg-white border border-slate-200 rounded shadow-sm p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 text-[#1A365D] rounded flex items-center justify-center font-bold text-xl border border-[#1A365D]">B</div>
                <div>
                  <h2 className="font-bold text-lg text-[#1A365D]">{cartStacks[0]?.name || 'Professional Plan'}</h2>
                  <button className="text-[#319795] text-sm font-medium hover:underline">Change Plan</button>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <div className="flex bg-slate-100 p-1 rounded-md mb-2 w-fit">
                    <button onClick={() => setBillingCycle('Monthly')} className={`px-4 py-1 text-xs font-bold rounded transition-all ${billingCycle === 'Monthly' ? 'bg-white shadow-sm text-[#2B6CB0]' : 'text-slate-500'}`}>Monthly</button>
                    <button onClick={() => setBillingCycle('Yearly')} className={`px-4 py-1 text-xs font-bold rounded transition-all ${billingCycle === 'Yearly' ? 'bg-[#2B6CB0] text-white' : 'text-slate-500'}`}>Yearly</button>
                </div>
                <p className="text-xl font-bold text-[#1A365D]">₹{subtotal.toLocaleString()}</p>
              </div>
            </div>

            {step === 1 ? (
              /* ADD-ONS TABLE */
              <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      <th className="px-6 py-4">Items</th>
                      <th className="px-6 py-4 text-center w-32">No. of Units</th>
                      <th className="px-6 py-4 text-right w-40">Amount</th>
                      <th className="px-6 py-4 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cartStacks.map((stack, sIdx) => (
                      <React.Fragment key={stack.cart_id}>
                        <tr className="group">
                          <td className="px-6 py-6">
                            <p className="font-bold text-[#1A365D]">{stack.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">Base Plan License</p>
                          </td>
                          <td className="px-6 py-6 text-center text-sm font-medium text-slate-600">1</td>
                          <td className="px-6 py-6 text-right font-bold text-[#1A365D]">₹{stack.price.toLocaleString()}</td>
                          <td className="px-4 py-6 text-center">
                             <button onClick={() => removeItem(sIdx)} className="text-slate-300 hover:text-[#E53E3E] transition-colors"><Trash2 size={16} /></button>
                          </td>
                        </tr>
                        {stack.sub_stacks.map((sub, subIdx) => (
                          <tr key={subIdx} className="bg-slate-50/50">
                            <td className="pl-12 pr-6 py-4">
                              <p className="font-semibold text-sm text-slate-700">{sub.name}</p>
                              <p className="text-[11px] text-slate-400">Performance Add-on</p>
                            </td>
                            <td className="px-6 py-4">
                              <input type="number" value={sub.quantity} onChange={(e) => updateQuantity(sIdx, subIdx, e.target.value)} className="w-20 mx-auto block border border-slate-300 rounded px-2 py-1 text-sm text-center focus:border-[#2B6CB0] focus:ring-[#2B6CB0] outline-none" />
                            </td>
                            <td className="px-6 py-4 text-right font-medium text-slate-600">₹{(sub.price * sub.quantity).toLocaleString()}</td>
                            <td className="px-4 py-4 text-center">
                                <button onClick={() => removeItem(sIdx, subIdx)} className="text-slate-300 hover:text-[#E53E3E]"><Trash2 size={14} /></button>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* BILLING & PAYMENT FORM */
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded shadow-sm p-8">
                  <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-[#1A365D]">
                      <CreditCard size={20} className="text-[#2B6CB0]" />
                      Billing Address
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                      <FormGroup label="Billing Name/Company Name" defaultValue={organizationData?.name} />
                      <FormGroup label="Phone" placeholder="+91 ..." />
                      <FormGroup label="Country/Region" value="India" readOnly />
                      <FormGroup label="State" type="select" />
                      <FormGroup label="Street Address" isFull placeholder="Building, Street, Area" />
                      <FormGroup label="City" />
                      <FormGroup label="ZIP/Postal Code" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
                  <div className="p-8 pb-6">
                    <h3 className="font-bold text-lg mb-6 text-[#1A365D]">Payment Method</h3>
                    <div className="flex border-b border-slate-100 mb-8">
                        <button onClick={() => setActiveTab('Recurring')} className={`px-8 py-3 text-sm font-bold transition-all border-b-2 -mb-[2px] ${activeTab === 'Recurring' ? 'border-[#2B6CB0] text-[#2B6CB0]' : 'border-transparent text-slate-400'}`}>Recurring</button>
                        <button onClick={() => setActiveTab('Non-Recurring')} className={`px-8 py-3 text-sm font-bold transition-all border-b-2 -mb-[2px] ${activeTab === 'Non-Recurring' ? 'border-[#2B6CB0] text-[#2B6CB0]' : 'border-transparent text-slate-400'}`}>One-time</button>
                    </div>

                    <div className="min-h-[140px]">
                        {activeTab === 'Recurring' ? (
                            <div className="space-y-6">
                                <div className="flex gap-8">
                                    <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                                        <input type="radio" checked={recurringMethod === 'Credit Card'} onChange={() => setRecurringMethod('Credit Card')} className="w-4 h-4 accent-[#2B6CB0]" /> 
                                        Credit Card
                                    </label>
                                    <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                                        <input type="radio" checked={recurringMethod === 'UPI'} onChange={() => setRecurringMethod('UPI')} className="w-4 h-4 accent-[#2B6CB0]" /> 
                                        UPI
                                    </label>
                                </div>
                                <div className="bg-slate-50 p-4 rounded border border-slate-100 text-[13px] text-slate-600">
                                    <p><span className="font-bold text-[#1A365D]">Note:</span> Recurring payments are automated. UPI recurring may take 24-72 hours to verify.</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-[13px] text-slate-600">Manual payment required for every renewal. No automated charges.</p>
                        )}
                    </div>
                  </div>
                  <div className="bg-[#fcfdfe] px-8 py-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 grayscale opacity-50">
                         <ShieldCheck size={16} />
                         <span className="text-[10px] font-bold uppercase">PCI DSS Compliant</span>
                      </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR - ACTION ACCENTS */}
          <div className="lg:w-[350px]">
            <div className="bg-white border border-slate-200 rounded shadow-sm sticky top-6 overflow-hidden">
              {billingCycle === 'Yearly' && (
                <div className="bg-[#38A169] p-2.5 text-center">
                    <p className="text-white text-[11px] font-bold uppercase tracking-wider">Annual Discount Applied</p>
                </div>
              )}
              
              <div className="p-6">
                {step === 1 && cartStacks.length > 0 && (
                    <button onClick={() => setStep(2)} className="w-full bg-[#2B6CB0] hover:bg-[#1A365D] text-white font-bold py-3.5 rounded shadow-lg mb-6 transition-all">
                        Proceed to Billing
                    </button>
                )}

                <h3 className="font-bold text-slate-800 mb-4 text-xs uppercase tracking-tight">Order Summary</h3>
                <div className="space-y-3 pb-4 border-b border-slate-100">
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>Subtotal</span>
                        <span className="font-medium text-slate-800">₹{subtotal.toLocaleString()}</span>
                    </div>
                    
                    {appliedCoupon && (
                        <div className="flex justify-between text-sm text-[#38A169] bg-green-50 px-2 py-1.5 rounded border border-[#38A169] border-dashed">
                            <span className="flex items-center gap-1 font-medium italic">
                                <Tag size={12} /> {appliedCoupon.code}
                            </span>
                            <div className="flex items-center gap-2">
                                <span>- ₹{appliedCoupon.discount.toLocaleString()}</span>
                                <button onClick={removeCoupon} className="text-slate-400 hover:text-[#E53E3E]"><X size={14} /></button>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between text-sm text-slate-600">
                        <span>Tax (GST 0%)</span>
                        <span className="font-medium text-slate-800">₹0.00</span>
                    </div>
                </div>

                {!appliedCoupon && (
                    <div className="mt-4 pb-4 border-b border-slate-100">
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Coupon Code" 
                                value={couponInput}
                                onChange={(e) => setCouponInput(e.target.value)}
                                className="flex-1 border border-slate-200 rounded px-3 py-2 text-xs outline-none focus:border-[#2B6CB0] focus:ring-[#2B6CB0] uppercase font-semibold"
                            />
                            <button 
                                onClick={handleApplyCoupon}
                                className="bg-[#1A365D] text-white px-3 py-2 rounded text-[11px] font-bold hover:bg-black transition-colors"
                            >
                                APPLY
                            </button>
                        </div>
                        {couponError && <p className="text-[10px] text-[#E53E3E] mt-1 font-medium">{couponError}</p>}
                    </div>
                )}

                <div className="py-4 flex justify-between items-center bg-slate-50 -mx-6 px-6 mb-6 mt-4">
                    <span className="font-bold text-slate-900">Total Payable</span>
                    <span className="font-extrabold text-xl text-[#2B6CB0]">₹{totalPayable.toLocaleString()}</span>
                </div>

                {step === 2 && (
                    <div className="space-y-3">
                        <BuyNowButton 
                            amount={totalPayable}
                            userDetails={{
                                name: organizationData?.name || profileData?.name || '',
                                email: profileData?.email || '',
                            }}
                            cartItems={cartStacks}
                            onSuccess={() => alert('Payment Successful!')}
                        />
                        <button onClick={() => setStep(1)} className="w-full border border-slate-300 py-3 rounded font-bold text-slate-500 hover:bg-slate-50 transition-colors text-sm">
                            Back to Items
                        </button>
                    </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* --- UI HELPERS --- */
function FormGroup({ label, type = 'text', isFull = false, ...props }: any) {
    return (
        <div className={isFull ? 'col-span-2' : 'col-span-1'}>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-tight mb-1.5">{label}</label>
            {type === 'select' ? (
                <select className="w-full border border-slate-200 rounded px-3 py-2.5 text-sm bg-white outline-none focus:border-[#2B6CB0] focus:ring-[#2B6CB0]">
                    <option>Select State</option>
                    <option>Maharashtra</option>
                    <option>Karnataka</option>
                    <option>Delhi</option>
                </select>
            ) : (
                <input type="text" {...props} className="w-full border border-slate-200 rounded px-3 py-2.5 text-sm outline-none focus:border-[#2B6CB0] focus:ring-[#2B6CB0] transition-all placeholder:text-slate-300" />
            )}
        </div>
    );
}