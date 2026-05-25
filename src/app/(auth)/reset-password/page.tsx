"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (data: ResetPasswordInput) => {
    setLoading(true);
    const { error } = await authClient.requestPasswordReset({
      email: data.email,
      redirectTo: "/reset-password/confirm",
    });
    setLoading(false);

    if (error) {
      toast.error(error.message ?? "Something went wrong");
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="ri-mail-check-line text-emerald-600 text-2xl"></i>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Check your email</h2>
          <p className="text-slate-500 text-sm mb-6">
            We sent a password reset link to your email address. It expires in 1 hour.
          </p>
          <Link
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="ri-line-chart-line text-white text-base"></i>
          </div>
          <span className="font-bold text-slate-800 text-lg">ExpenseIQ</span>
        </div>

        <div className="mb-8">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6">
            <i className="ri-arrow-left-s-line text-base"></i>
            Back to sign in
          </Link>
          <h2 className="text-2xl font-bold text-slate-800">Reset password</h2>
          <p className="text-slate-500 text-sm mt-1">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <i className="ri-mail-line text-base"></i>
              </div>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 placeholder-slate-400 transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            {loading && <i className="ri-loader-4-line animate-spin text-base"></i>}
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
      </div>
    </div>
  );
}
