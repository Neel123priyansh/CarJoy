import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false); 
    
    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';
        
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));

            navigate('/dashboard');
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Network error. Please try again.');
    } finally {
        setIsLoading(false);
    }
    };


    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1 ml-1">
                        Email Address
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                            <span className="material-icons text-sm">email</span>
                        </span>
                        <input
                            type="email"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f26522] focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-sm"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div>
                    <div className="flex justify-between mb-1 ml-1">
                        <label className="block text-sm font-bold text-slate-700">
                            Password
                        </label>
                        <a href="#" className="text-xs font-semibold text-[#003366] hover:text-[#f26522]">
                            Forgot Password?
                        </a>
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                            <span className="material-icons text-sm">lock</span>
                        </span>
                        <input
                            type="password"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f26522] focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-sm"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2 ml-1">
                    <input 
                        type="checkbox" 
                        id="remember" 
                        className="w-4 h-4 text-[#f26522] border-gray-300 rounded focus:ring-[#f26522]" 
                    />
                    <label htmlFor="remember" className="text-sm text-gray-600">
                        Keep me logged in
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-[#f26522] text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-[#d4541a] active:transform active:scale-[0.98] transition-all duration-150 flex items-center justify-center space-x-2"
                >
                    <span>Login to My Account</span>
                    <span className="material-icons text-sm">arrow_forward</span>
                </button>
            </form>

            {/* Social Login Separator */}
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-400 uppercase tracking-widest text-[10px] font-bold">
                        Or login with
                    </span>
                </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <img src="https://www.svgrepo.com/show/355037/google.svg" className="h-4 w-4 mr-2" alt="Google" />
                    <span className="text-xs font-bold text-gray-600">Google</span>
                </button>
                <button className="flex items-center justify-center py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <img src="https://www.svgrepo.com/show/448234/linkedin.svg" className="h-4 w-4 mr-2" alt="LinkedIn" />
                    <span className="text-xs font-bold text-gray-600">LinkedIn</span>
                </button>
            </div>
        </div>
    );
}

export default LoginPage;