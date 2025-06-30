import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  X, 
  Send, 
  Check, 
  AlertTriangle, 
  Loader2,
  Shield,
  Sparkles
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { AuthService } from "@/services/auth-service";

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  userEmail: string;
}

export function EmailVerificationModal({
  isOpen,
  onClose,
  onVerified,
  userEmail
}: EmailVerificationModalProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      setError("Please enter the verification code");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const [result, verifyError] = await AuthService.verifyEmail(verificationCode);
      
      if (verifyError || !result) {
        setError(verifyError || "Failed to verify code");
        return;
      }

      setSuccess(true);
      
      // Wait a moment to show success, then call onVerified
      setTimeout(() => {
        onVerified();
        onClose();
      }, 1500);
      
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const resetModal = () => {
    setVerificationCode("");
    setError(null);
    setSuccess(false);
    setIsVerifying(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
            <CardContent>
              {/* Close Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {success ? (
                /* Success State */
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 0.6,
                      ease: "easeInOut"
                    }}
                  >
                    <Check className="w-10 h-10 text-white" />
                  </motion.div>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Email Verified!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your account has been successfully verified
                  </p>
                </motion.div>
              ) : (
                /* Verification Form */
                <>
                  {/* Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      className="relative mb-6"
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/25">
                        <Mail className="w-10 h-10 text-white" />
                      </div>
                      
                      {/* Floating sparkles */}
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                          style={{
                            left: `${20 + Math.cos(i * 60 * Math.PI / 180) * 50}px`,
                            top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 50}px`,
                          }}
                          animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                          }}
                        />
                      ))}
                    </motion.div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      Verify Your Email
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      We've sent a verification code to:
                    </p>
                    <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                      <span className="text-blue-800 dark:text-blue-200 font-medium">
                        {userEmail}
                      </span>
                    </div>
                  </div>

                  {/* Verification Form */}
                  <div className="space-y-6">
                    <Input
                      label="Verification Code"
                      placeholder="Enter the 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      error={error || undefined}
                      leftIcon={<Shield className="w-5 h-5" />}
                      variant="glass"
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                    />

                    {/* Info Text */}
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Check your inbox and spam folder.
                        <br />
                        The code expires in 10 minutes.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-3">
                      <Button
                        onClick={handleVerify}
                        disabled={!verificationCode.trim() || isVerifying}
                        variant="primary"
                        size="lg"
                        fullWidth
                        leftIcon={
                          isVerifying ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Check className="w-5 h-5" />
                          )
                        }
                        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-lg shadow-blue-500/25"
                      >
                        {isVerifying ? "Verifying..." : "Verify Email"}
                      </Button>

                      <Button
                        onClick={handleSkip}
                        variant="outline"
                        size="lg"
                        fullWidth
                        className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        Verify Later
                      </Button>
                    </div>

                    {/* Security Note */}
                    <div className="flex items-start space-x-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                          Why verify?
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                          Verification protects your account and allows you to recover access if you forget your password.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}