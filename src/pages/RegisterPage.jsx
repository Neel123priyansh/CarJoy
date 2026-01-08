import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = ({ onBack, onSuccess }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isloading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        businessName: "",
        email: "",
        phone: "",
        storeType: "Shopify",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  // Optional: Client-side validation before API call
  if (!formData.email.includes('@')) {
    alert('Please enter a valid email');
    setIsLoading(false);
    return;
  }

  try {

    const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';
    
    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        businessName: formData.businessName,
        storeType: formData.storeType,
        phone: formData.phone,
        password: formData.password
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    
    
    if (typeof onSuccess === 'function') {
        onSuccess({ userData: formData, apiResponse: data });
    } else {
        console.log('Registration successful (no onSuccess prop):', data);
        alert('Registration successful!');
        navigate('/');
    }
    
  } catch (error) {
    console.error('Registration error:', error);

    alert(error.message || 'Unable to register. Please try again.');

    } finally {
        setIsLoading(false);
    }
    };

    return (
        <div className="min-h-screen bg-[#FBFDFF] flex flex-col md:flex-row font-sans overflow-hidden">
            {/* --- LEFT SIDE: THE BRAND PANEL --- */}
            <div className="w-full md:w-[450px] bg-[#003366] p-12 text-white flex flex-col justify-between relative overflow-hidden">
                {/* Decorative background circle */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#f26522] rounded-full opacity-10 blur-3xl"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 cursor-pointer mb-16" onClick={onBack}>
                        <div className="w-10 h-10 bg-[#f26522] rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase">ShipMy<span className="text-[#f26522]">Parcel</span></span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black leading-[1.1] mb-6">
                        Start your <br /> 
                        <span className="text-[#f26522]">Growth Journey.</span>
                    </h2>
                    <p className="text-slate-400 font-medium max-w-xs leading-relaxed">
                        Complete these 3 steps to access the most powerful logistics dashboard in India.
                    </p>
                </div>

                {/* Progress Indicators */}
                <div className="space-y-8 relative z-10">
                    {[
                        { num: 1, label: "Profile Setup" },
                        { num: 2, label: "Store Details" },
                        { num: 3, label: "Account Security" }
                    ].map((item) => (
                        <div key={item.num} className="flex items-center space-x-4 group">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black border-2 transition-all duration-500 ${
                                step >= item.num ? "bg-[#f26522] border-[#f26522] shadow-[0_0_20px_rgba(242,101,34,0.3)]" : "border-slate-700 text-slate-500"
                            }`}>
                                {item.num}
                            </div>
                            <span className={`text-xs font-black uppercase tracking-[0.2em] transition-colors duration-500 ${step >= item.num ? "text-white" : "text-slate-500"}`}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] relative z-10">
                    🛡️ ISO 27001 SECURED DATA
                </div>
            </div>

            {/* --- RIGHT SIDE: THE FORM PANEL --- */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-24 relative">
                {isloading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-4 border-[#f26522] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#003366]">Setting up your dashboard...</p>
                    </div>
                )}

                <div className="max-w-md w-full">
                    <button 
                        onClick={step === 1 ? onBack : prevStep}
                        className="group text-[10px] font-black text-slate-400 hover:text-[#f26522] transition-colors uppercase tracking-[0.2em] mb-12 flex items-center"
                    >
                        <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> 
                        {step === 1 ? "Return Home" : "Go Back"}
                    </button>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* STEP 1: PERSONAL INFO */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <h3 className="text-3xl font-black text-[#003366] tracking-tight">Tell us about yourself</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-[20px] focus:border-[#f26522] focus:bg-white outline-none transition-all font-bold text-slate-700" placeholder="e.g. Rahul Sharma" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-[20px] focus:border-[#f26522] focus:bg-white outline-none transition-all font-bold text-slate-700" placeholder="rahul@business.com" />
                                    </div>
                                    <button type="button" onClick={nextStep} className="w-full bg-[#003366] text-white py-5 rounded-[20px] font-black text-xs tracking-[0.2em] hover:bg-[#002244] transition-all shadow-xl hover:-translate-y-1">CONTINUE</button>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: BUSINESS INFO */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <h3 className="text-3xl font-black text-[#003366] tracking-tight">Business Details</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand Name</label>
                                        <input required type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-[20px] focus:border-[#f26522] focus:bg-white outline-none transition-all font-bold text-slate-700" placeholder="e.g. UrbanGlow Stores" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Store Platform</label>
                                        <select name="storeType" value={formData.storeType} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-[20px] focus:border-[#f26522] focus:bg-white outline-none transition-all font-black text-xs text-slate-600 appearance-none">
                                            <option>Shopify</option>
                                            <option>WooCommerce</option>
                                            <option>Amazon India</option>
                                            <option>Custom API Integration</option>
                                        </select>
                                    </div>
                                    <button type="button" onClick={nextStep} className="w-full bg-[#003366] text-white py-5 rounded-[20px] font-black text-xs tracking-[0.2em] hover:bg-[#002244] transition-all shadow-xl hover:-translate-y-1">NEXT STEP</button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: SECURITY */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <h3 className="text-3xl font-black text-[#003366] tracking-tight">Secure Account</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-[20px] focus:border-[#f26522] focus:bg-white outline-none transition-all font-bold text-slate-700" placeholder="+91 99999 99999" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Set Password</label>
                                        <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-[20px] focus:border-[#f26522] focus:bg-white outline-none transition-all font-bold text-slate-700" placeholder="••••••••" />
                                    </div>
                                    <div className="pt-4">
                                        <button type="submit" className="w-full bg-[#f26522] text-white py-5 rounded-[20px] font-black text-xs tracking-[0.2em] hover:bg-[#d4541a] transition-all shadow-2xl hover:scale-[1.02] active:scale-95">CREATE ACCOUNT</button>
                                        <p className="text-[9px] text-slate-400 mt-6 text-center font-bold leading-relaxed uppercase tracking-widest">By signing up you agree to ShipMyParcel's <br/> <span className="text-slate-600 underline cursor-pointer">Terms</span> & <span className="text-slate-600 underline cursor-pointer">Privacy Policy</span></p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;