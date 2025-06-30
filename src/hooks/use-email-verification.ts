import { useState, useEffect } from "react";
import { useAuth } from "./use-auth";

interface UseEmailVerificationReturn {
  shouldShowModal: boolean;
  showModal: () => void;
  hideModal: () => void;
  handleVerified: () => void;
}

export const useEmailVerification = (): UseEmailVerificationReturn => {
  const { user, isAuthenticated } = useAuth();
  const [modalShown, setModalShown] = useState(false);
  const [forceHide, setForceHide] = useState(false);

  // Check if we should show the modal
  const shouldShowModal = 
    isAuthenticated && 
    user && 
    !user.isEmailVerified && 
    !modalShown && 
    !forceHide;

  const showModal = () => {
    setModalShown(true);
  };

  const hideModal = () => {
    setModalShown(false);
    setForceHide(true);
    
    // Reset force hide after some time to allow showing again later
    setTimeout(() => {
      setForceHide(false);
    }, 24 * 60 * 60 * 1000); // 24 hours
  };

  const handleVerified = () => {
    setModalShown(false);
    setForceHide(true);
    // Note: The user object should be updated by the auth system
    // after successful verification
  };

  // Auto-show modal when conditions are met
  useEffect(() => {
    if (shouldShowModal) {
      // Small delay to ensure the app has fully loaded
      const timer = setTimeout(() => {
        showModal();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [shouldShowModal]);

  // Reset state when user changes or logs out
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setModalShown(false);
      setForceHide(false);
    }
  }, [isAuthenticated, user]);

  return {
    shouldShowModal: modalShown,
    showModal,
    hideModal,
    handleVerified,
  };
};