"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { KeyRound, Shield, Terminal, Zap } from "lucide-react";
import { updateSuperAdminPassword } from "@/app/actions/super-admin";

export function ChangePasswordForm() {
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Signal codes do not match.");
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error("Key must be 6+ segments.");
            return;
        }

        setSaving(true);
        try {
            const result = await updateSuperAdminPassword(formData.currentPassword, formData.newPassword);
            if (result.success) {
                toast.success("Security keys rotated.");
                setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Key rotation protocol error.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-zinc-900 border border-white/10 p-10 relative overflow-hidden group">
            <div className="space-y-10">
                <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                    <div className="w-14 h-14 border border-white/5 flex items-center justify-center bg-zinc-950 text-[#ccff00]">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black font-heading uppercase tracking-widest text-white">Root Key Rotation</h2>
                        <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-2">Modify administrative auth parameters</p>
                    </div>
                </div>

                <div className="space-y-8 max-w-xl">
                    <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Current Key</label>
                        <input
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full bg-black border border-white/5 py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">New Key Segment</label>
                        <input
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full bg-black border border-white/5 py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">Verify Node Signature</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full bg-black border border-white/5 py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#ccff00]/50"
                        />
                    </div>
                </div>

                <div className="pt-8">
                    <button
                        onClick={handleSave}
                        disabled={saving || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                        className="w-full md:w-auto px-12 py-5 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white transition-all disabled:opacity-30 flex items-center justify-center gap-3"
                    >
                        {saving ? "SYNCING..." : (
                            <>
                                <KeyRound className="h-4 w-4" />
                                Execute Key Update
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
