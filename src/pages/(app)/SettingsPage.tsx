import { useState, useRef } from "react";
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
  Loader2,
  Files,
  Upload,
  Plus,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Download,
  Trash2,
  Eye,
  MoreHorizontal
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
import { useUserFiles, useStorageStats } from "@/hooks/use-storage";
import { AuthService } from "@/services/auth-service";
import { StorageService } from "@/services/storage-service";
import { FileUploadClient, formatBytes, getFileInfo } from "@/lib/utils/file-upload.utils";
import { cn } from "@/lib/utils/class.utils";
import { motion, AnimatePresence } from "framer-motion";

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

// File type icon helper
const getFileIcon = (mimetype: string) => {
  if (mimetype.startsWith('image/')) return <Image className="w-5 h-5" />;
  if (mimetype.startsWith('video/')) return <Video className="w-5 h-5" />;
  if (mimetype.startsWith('audio/')) return <Music className="w-5 h-5" />;
  if (mimetype.includes('pdf') || mimetype.includes('document')) return <FileText className="w-5 h-5" />;
  if (mimetype.includes('zip') || mimetype.includes('archive')) return <Archive className="w-5 h-5" />;
  return <FileText className="w-5 h-5" />;
};

// File type color helper
const getFileTypeColor = (mimetype: string) => {
  if (mimetype.startsWith('image/')) return "from-green-400 to-emerald-500";
  if (mimetype.startsWith('video/')) return "from-red-400 to-pink-500";
  if (mimetype.startsWith('audio/')) return "from-purple-400 to-indigo-500";
  if (mimetype.includes('pdf')) return "from-red-500 to-red-600";
  if (mimetype.includes('document')) return "from-blue-400 to-blue-500";
  if (mimetype.includes('zip') || mimetype.includes('archive')) return "from-yellow-400 to-orange-500";
  return "from-gray-400 to-gray-500";
};

export function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useSettingsStore();
  
  // Storage hooks
  const [filesLoading, userFiles, filesError] = useUserFiles();
  const [statsLoading, storageStats, statsError] = useStorageStats();
  
  // File upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  // File upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      const uploadClient = new FileUploadClient();
      
      await uploadClient.upload(file, {
        onProgress: (progress) => {
          setUploadProgress(progress.percentage);
        },
        onSuccess: (uploadedFile) => {
          console.log("File uploaded successfully:", uploadedFile);
          // Refresh files list
          window.location.reload(); // Simple refresh for now
        },
        onError: (error) => {
          setUploadError(error.message);
        },
      });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Delete file handler
  const handleDeleteFile = async (fileId: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const [success, error] = await StorageService.deleteFile(fileId);
      if (error || !success) {
        alert("Failed to delete file: " + error);
      } else {
        // Refresh files list
        window.location.reload(); // Simple refresh for now
      }
    } catch (err) {
      alert("Failed to delete file");
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
            <TabsTrigger value="files">
              <Files className="w-4 h-4" />
              <span>Files</span>
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

          {/* Files Settings */}
          <TabsContent value="files">
            <div className="space-y-6">
              {/* Storage Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Files className="w-5 h-5" />
                      <span>Storage Statistics</span>
                    </div>
                    {storageStats && (
                      <Badge variant="primary">
                        {formatBytes(storageStats.used)} / {formatBytes(storageStats.limit)}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        ))}
                      </div>
                    </div>
                  ) : statsError ? (
                    <div className="text-center py-8">
                      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <p className="text-red-600 dark:text-red-400">{statsError}</p>
                    </div>
                  ) : storageStats ? (
                    <div className="space-y-6">
                      {/* Usage Progress Bar */}
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span>Storage Used</span>
                          <span>{Math.round((storageStats.used / storageStats.limit) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((storageStats.used / storageStats.limit) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Storage Stats Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                            {formatBytes(storageStats.used)}
                          </div>
                          <div className="text-sm text-blue-600 dark:text-blue-400">Used</div>
                        </div>
                        
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                            {formatBytes(storageStats.remaining)}
                          </div>
                          <div className="text-sm text-green-600 dark:text-green-400">Available</div>
                        </div>
                        
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                            {formatBytes(storageStats.limit)}
                          </div>
                          <div className="text-sm text-purple-600 dark:text-purple-400">Total</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Files className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No storage data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Files Grid */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Upload className="w-5 h-5" />
                      <span>Uploaded Files</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {userFiles.length > 0 && (
                        <Badge variant="secondary">{userFiles.length} files</Badge>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.md"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        variant="primary"
                        size="sm"
                        leftIcon={isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      >
                        {isUploading ? `${uploadProgress}%` : "Upload File"}
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-3 mb-2">
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        <span className="text-blue-800 dark:text-blue-200 font-medium">
                          Uploading... {uploadProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Upload Error */}
                  {uploadError && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span className="text-red-800 dark:text-red-200 font-medium">
                          {uploadError}
                        </span>
                        <button
                          onClick={() => setUploadError(null)}
                          className="ml-auto p-1 hover:bg-red-200 dark:hover:bg-red-800 rounded"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Files Loading */}
                  {filesLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                        </div>
                      ))}
                    </div>
                  ) : filesError ? (
                    <div className="text-center py-12">
                      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
                        Error Loading Files
                      </h3>
                      <p className="text-red-500 dark:text-red-400">{filesError}</p>
                    </div>
                  ) : userFiles.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center mx-auto">
                          <Upload className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center animate-bounce">
                          <Plus className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No Files Uploaded
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Upload your first file to get started
                      </p>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="primary"
                        leftIcon={<Upload className="w-4 h-4" />}
                      >
                        Upload Your First File
                      </Button>
                    </div>
                  ) : (
                    /* Files Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <AnimatePresence>
                        {userFiles.map((file, index) => (
                          <motion.div
                            key={file._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 overflow-hidden"
                          >
                            {/* File Header */}
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${getFileTypeColor(file.mimetype)} text-white shadow-lg`}>
                                  {getFileIcon(file.mimetype)}
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleDeleteFile(file._id)}
                                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Delete file"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </button>
                                </div>
                              </div>
                              
                              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1 truncate" title={file.filename}>
                                {file.filename}
                              </h3>
                              
                              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                <span>{formatBytes(file.size)}</span>
                                <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>

                            {/* File Actions */}
                            <div className="px-4 pb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Download className="w-3 h-3 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ViewContainer>
  );
}