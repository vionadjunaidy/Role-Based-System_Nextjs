"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({ level: 0, message: "" });
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const levels = {
    1: "Very Weak",
    2: "Weak",
    3: "Medium",
    4: "Strong",
  };

  const checkPasswordStrength = (pwd) => {
    if (pwd.length > 15) {
      return { level: 0, message: "Too lengthy" };
    } else if (pwd.length < 8) {
      return { level: 0, message: "Too short" };
    }

    const checks = [/[a-z]/, /[A-Z]/, /\d/, /[@.#$!%^&*.?]/];
    const score = checks.reduce((count, regex) => count + (regex.test(pwd) ? 1 : 0), 0);
    return { level: score, message: levels[score] || "Invalid" };
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
    
    if (name === "password" || name === "confirmPassword") {
      const newPassword = name === "password" ? value : formData.password;
      const newConfirmPassword = name === "confirmPassword" ? value : formData.confirmPassword;
      
      if (newConfirmPassword && newPassword !== newConfirmPassword) {
        setPasswordsMatch(false);
      } else if (newConfirmPassword) {
        setPasswordsMatch(true);
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
  
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    if (passwordStrength.level < 3) {
      setErrorMessage('Password is too weak. Please choose a stronger password.');
      setIsSubmitting(false);
      return;
    }
  
    try {
      const s = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });
      let sData = null;
      try {
        sData = await s.json();
      } catch (_) {
        sData = null;
      }
      if (!s.ok) throw new Error((sData && sData.error) || 'Signup failed');

      router.replace('/');
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  const getStrengthColor = (level) => {
    switch (level) {
      case 1:
        return "text-red-600 bg-red-100";
      case 2:
        return "text-orange-600 bg-orange-100";
      case 3:
        return "text-yellow-600 bg-yellow-100";
      case 4:
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an Account</h1>
            <p className="text-gray-600">Sign up to get started</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Create a password"
              />
              {formData.password && (
                <div className="mt-2">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStrengthColor(passwordStrength.level)}`}>
                    <span className="mr-1">Strength:</span>
                    <span>{passwordStrength.message}</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.level === 1
                          ? "bg-red-500"
                          : passwordStrength.level === 2
                          ? "bg-orange-500"
                          : passwordStrength.level === 3
                          ? "bg-yellow-500"
                          : passwordStrength.level === 4
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                      style={{ width: `${(passwordStrength.level / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={onChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  formData.confirmPassword && !passwordsMatch 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : formData.confirmPassword && passwordsMatch 
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                    : 'border-gray-300'
                }`}
                placeholder="Re-enter your password"
              />
              {formData.confirmPassword && (
                <div className="mt-2">
                  {!passwordsMatch ? (
                    <div className="flex items-center text-red-600 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                      </svg>
                      Passwords do not match
                    </div>
                  ) : (
                    <div className="flex items-center text-green-600 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      Passwords match
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}

            <div className="text-sm text-gray-600 flex justify-center">
            Already have an account? <Link href="/" className="text-indigo-600 hover:text-indigo-700 underline">Sign In</Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !passwordsMatch || passwordStrength.level < 3}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 cursor-pointer"
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

