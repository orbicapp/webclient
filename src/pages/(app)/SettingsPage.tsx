import { useState } from "react";
import { 
  User, 
  Shield, 
  Palette, 
  Camera,
  Mail,
  Lock,
  Moon,
  Sun,
  Globe,
  Monitor,
  Check,
  X,
  AlertTriangle,
  Send,
  Loader2
} from "lucide-react";

import { ViewContainer } from "@/components/layout/ViewContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Dropdown from "@/components/ui/Dropdown";
import { useAuth } from "@/hooks/use-auth";
import { useSettingsStore } from "@/stores/settings-store";
import { AuthService } from "@/services/auth-service";
import { cn } from "@/lib/utils/class.utils";

// Language options
const languageOptions = [
  { value: "en", label: "English", icon: "🇺🇸" },
  { value: "es", label: "Español", icon: "🇪🇸" },
  { value: "fr", label: "Français", icon: "🇫🇷" },
  { value: "de", label: "Deutsch", icon: "🇩🇪" },
  { value: "it", label: "Italiano", icon: "🇮🇹" },
  { value: "pt", label: "Português", icon: "🇵🇹" },
];

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  badge?: string;
  warning?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({ 
  icon, 
  title, 
  description, 
  children, 
  badge,
  warning = false 
}) => (
  <div className={cn(
    "flex items-center justify-between p-4 rounded-xl border",
    warning 
      ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800" 
      : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
  )}>
    <div className="flex items-center space-x-4 flex-1 min-w-0">
      <div className={cn(
        "p-2 rounded-lg",
        warning 
          ? "bg-orange-500 text-white" 
          : "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
      )}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>
          {badge && <Badge variant="accent" size="sm">{badge}</Badge>}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{description}</p>
      </div>
    </div>
    <div className="flex-shrink-0 ml-4">
      {children}
    </div>
  </div>
);

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, disabled = false }) => (
  <button
    onClick={() => !disabled && onChange(!checked)}
    disabled={disabled}
    className={cn(
      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
      checked 
        ? "bg-primary-600" 
        : "bg-gray-300 dark:bg-gray-600",
      disabled && "opacity-50 cursor-not-allowed"
    )}
  >
    <span
      className={cn(
        "inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200",
        checked ? "translate-x-6" : "translate-x-1"
      )}
    />
  </button>
);

export function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useSettingsStore();
  
  // Local state for settings
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    language: "en",
  });

  // Email verification state
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const handleVerifyEmail = async () => {
    if (!verificationCode.trim()) {
      setVerificationError("Please enter the verification code");
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);

    try {
      const [success, error] = await AuthService.verifyEmail(verificationCode);
      
      if (error || !success) {
        setVerificationError(error || "Verification failed");
      } else {
        setVerificationSuccess(true);
        setVerificationCode("");
        // TODO: Update user state to reflect verified email
      }
    } catch (err) {
      setVerificationError("An unexpected error occurred");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <ViewContainer className="py-8">
      {/* Settings Tabs */}
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="profile" variant="default">
          <TabsList className="mb-8 justify-center">
            <TabsTrigger value="profile">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="account">
              <Shield className="w-4 h-4" />
              <span>Account</span>
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="w-4 h-4" />
              <span>Appearance</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar 
                      size="xl" 
                      src={user?.avatarId ? `https://api.example.com/avatars/${user.avatarId}` : undefined}
                      fallback={user?.displayName?.charAt(0) || "U"}
                      variant="gradient"
                    />
                    <button className="absolute -bottom-2 -right-2 p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors shadow-lg">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Profile Photo
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Upload a photo to personalize your profile
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Upload Photo</Button>
                      <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Display Name"
                    value={profileData.displayName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                    leftIcon={<User className="w-5 h-5" />}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    leftIcon={<Mail className="w-5 h-5" />}
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline">Cancel</Button>
                  <Button variant="primary">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings */}
          <TabsContent value="account">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Account Security</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SettingItem
                    icon={<Lock className="w-5 h-5" />}
                    title="Change Password"
                    description="Update your password to keep your account secure"
                  >
                    <Button variant="outline" size="sm">Change</Button>
                  </SettingItem>

                  {/* Email Verification Section */}
                  <div className="p-4 rounded-xl border bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">Email Verification</h3>
                          <Badge variant={user?.isEmailVerified ? "success" : "warning"}>
                            {user?.isEmailVerified ? "Verified" : "Pending"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user?.isEmailVerified 
                            ? "Your email address has been verified" 
                            : "Verify your email address to secure your account"
                          }
                        </p>
                      </div>
                    </div>

                    {/* Verification form - only show if not verified */}
                    {!user?.isEmailVerified && (
                      <div className="space-y-4">
                        {verificationSuccess ? (
                          <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <span className="text-green-800 dark:text-green-200 font-medium">
                              Email verified successfully!
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="flex space-x-3">
                              <div className="flex-1">
                                <Input
                                  placeholder="Enter verification code"
                                  value={verificationCode}
                                  onChange={(e) => setVerificationCode(e.target.value)}
                                  error={verificationError || undefined}
                                  leftIcon={<Mail className="w-5 h-5" />}
                                />
                              </div>
                              <Button
                                onClick={handleVerifyEmail}
                                disabled={isVerifying || !verificationCode.trim()}
                                variant="primary"
                                leftIcon={isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                              >
                                {isVerifying ? "Verifying..." : "Verify"}
                              </Button>
                            </div>
                            
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Check your email for the verification code. If you didn't receive it, check your spam folder.
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>Appearance & Display</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <SettingItem
                  icon={theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  title="Theme"
                  description="Choose your preferred color scheme"
                >
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={toggleTheme}
                    leftIcon={theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  >
                    {theme === "dark" ? "Light" : "Dark"}
                  </Button>
                </SettingItem>

                <SettingItem
                  icon={<Globe className="w-5 h-5" />}
                  title="Language"
                  description="Select your preferred language"
                >
                  <div className="w-48">
                    <Dropdown
                      value={appearanceSettings.language}
                      options={languageOptions}
                      onChange={(value) => setAppearanceSettings(prev => ({ ...prev, language: value }))}
                    />
                  </div>
                </SettingItem>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ViewContainer>
  );
}