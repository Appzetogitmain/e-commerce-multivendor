import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  initialName?: string;
  initialPhone?: string;
  initialEmail?: string;
}

export default function EnquiryModal({
  isOpen,
  onClose,
  productId,
  productName,
  initialName = "",
  initialPhone = "",
  initialEmail = "",
}: EnquiryModalProps) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Name and Phone number are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/v1/enquiries", {
        productId,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        message: message.trim() || undefined,
      });

      if (response.data.success) {
        setSuccess(true);
      } else {
        setError(response.data.message || "Failed to submit enquiry.");
      }
    } catch (err: any) {
      console.error("Enquiry submission error:", err);
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col border border-neutral-100"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-gradient-to-r from-[var(--customer-primary-alpha-10)] to-white">
                <div>
                  <h3 className="font-bold text-neutral-900 text-base">Product Enquiry</h3>
                  <p className="text-xs text-neutral-500 mt-0.5 truncate max-w-[280px]" title={productName}>
                    For: {productName}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 active:scale-90 transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 flex flex-col items-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center mb-4 text-emerald-600">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-neutral-900 mb-2">Enquiry Sent!</h4>
                    <p className="text-xs text-neutral-500 max-w-[280px] leading-relaxed">
                      We have received your enquiry for <strong>{productName}</strong>. Our team will contact you shortly.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-6 px-6 py-2 bg-[var(--customer-primary-dark)] text-white text-xs font-bold rounded-xl hover:bg-[var(--customer-primary-darker)] transition-colors active:scale-95"
                    >
                      Okay
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-medium">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full rounded-xl border border-neutral-200 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--customer-primary)]/20 focus:border-[var(--customer-primary)] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number"
                        className="w-full rounded-xl border border-neutral-200 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--customer-primary)]/20 focus:border-[var(--customer-primary)] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                        className="w-full rounded-xl border border-neutral-200 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--customer-primary)]/20 focus:border-[var(--customer-primary)] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-1">
                        Message / Query (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask about price, quantity, or specific features..."
                        className="w-full rounded-xl border border-neutral-200 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--customer-primary)]/20 focus:border-[var(--customer-primary)] transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[var(--customer-primary-dark)] text-white hover:bg-[var(--customer-primary-darker)] font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 text-xs tracking-wider uppercase mt-2 cursor-pointer"
                    >
                      {loading ? "Submitting..." : "Submit Enquiry"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
