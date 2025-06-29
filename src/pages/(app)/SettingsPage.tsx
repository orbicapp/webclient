import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff,
  Camera,
  Mail,
  Lock,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Zap,
  Crown,
  Settings as SettingsIcon,
  ChevronRight,
  Check,
  X,
  AlertTriangle,
  Info
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
import { cn } from "@/lib/utils/class.utils";

// Settings categories
const settingsCategories = [
  { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
  { id: "account", label: "Account", icon: <Shield className="w-5 h-5" /> },
  { id: "appearance", label: "Appearance", icon: <Palette className="w-5 h-5" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
  { id: "privacy", label: "Privacy", icon: <Eye className="w-5 h-5" /> },
  { id: "data", label: "Data", icon: <Download className="w-5 h-5" /> },
];

// Language options
const languageOptions = [
  { value: "en", label: "English", icon: "🇺🇸" },
  { value: "es", label: "Español", icon: "🇪🇸" },
  { value: "fr", label: "Français", icon: "🇫🇷" },
  { value: "de", label: "Deutsch", icon: "🇩🇪" },
  { value: "it", label: "Italiano", icon: "🇮🇹" },
  { value: "pt", label: "Português", icon: "🇵🇹" },
];

// Theme options
const themeOptions = [
  { value: "light", label: "Light", icon: <Sun className="w-4 h-4" /> },
  { value: "dark", label: "Dark", icon: <Moon className="w-4 h-4" /> },
  { value: "system", label: "System", icon: <Monitor className="w-4 h-4" /> },
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
    "flex items-center justify-between p-4 rounded-xl border transition-all duration-200",
    warning 
      ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800" 
      : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
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
    <motion.span
      className={cn(
        "inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200",
        checked ? "translate-x-6" : "translate-x-1"
      )}
      layout
    />
  </button>
);

export function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useSettingsStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Local state for settings
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    bio: "",
    location: "",
    website: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    achievements: true,
    weeklyDigest: false,
    marketing: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showProgress: true,
    showAchievements: true,
    allowMessages: true,
    dataCollection: true,
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: theme,
    language: "en",
    soundEffects: true,
    animations: true,
    compactMode: false,
  });

  return (
    <ViewContainer className="py-8">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account preferences and privacy settings
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card variant="gradient">
            <CardContent>
              <nav className="space-y-2">
                {settingsCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={cn(
                      "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200",
                      activeTab === category.id
                        ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
                    {category.icon}
                    <span className="font-medium">{category.label}</span>
                    <ChevronRight className={cn(
                      "w-4 h-4 ml-auto transition-transform",
                      activeTab === category.id && "rotate-90"
                    )} />
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} variant="default">
            {/* Profile Settings */}
            <TabsContent value="profile">
              <Card variant="gradient">
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
                    <Input
                      label="Location"
                      placeholder="City, Country"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      leftIcon={<Globe className="w-5 h-5" />}
                    />
                    <Input
                      label="Website"
                      placeholder="https://yourwebsite.com"
                      value={profileData.website}
                      onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                      leftIcon={<Globe className="w-5 h-5" />}
                    />
                  </div>

                  <Input
                    label="Bio"
                    as="textarea"
                    rows={3}
                    placeholder="Tell us about yourself..."
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  />

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
                <Card variant="gradient">
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

                    <SettingItem
                      icon={<Smartphone className="w-5 h-5" />}
                      title="Two-Factor Authentication"
                      description="Add an extra layer of security to your account"
                      badge="Recommended"
                    >
                      <Button variant="primary" size="sm">Enable</Button>
                    </SettingItem>

                    <SettingItem
                      icon={<Mail className="w-5 h-5" />}
                      title="Email Verification"
                      description="Verify your email address"
                    >
                      <Badge variant="success">Verified</Badge>
                    </SettingItem>
                  </CardContent>
                </Card>

                <Card variant="gradient">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Crown className="w-5 h-5" />
                      <span>Subscription</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-purple-500 rounded-lg">
                          <Crown className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Free Plan</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Access to basic features</p>
                        </div>
                      </div>
                      <Button variant="accent">Upgrade to Pro</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance">
              <Card variant="gradient">
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

                  <SettingItem
                    icon={appearanceSettings.soundEffects ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    title="Sound Effects"
                    description="Play sounds for interactions and notifications"
                  >
                    <ToggleSwitch
                      checked={appearanceSettings.soundEffects}
                      onChange={(checked) => setAppearanceSettings(prev => ({ ...prev, soundEffects: checked }))}
                    />
                  </SettingItem>

                  <SettingItem
                    icon={<Zap className="w-5 h-5" />}
                    title="Animations"
                    description="Enable smooth animations and transitions"
                  >
                    <ToggleSwitch
                      checked={appearanceSettings.animations}
                      onChange={(checked) => setAppearanceSettings(prev => ({ ...prev, animations: checked }))}
                    />
                  </SettingItem>

                  <SettingItem
                    icon={<Monitor className="w-5 h-5" />}
                    title="Compact Mode"
                    description="Use a more condensed layout"
                  >
                    <ToggleSwitch
                      checked={appearanceSettings.compactMode}
                      onChange={(checked) => setAppearanceSettings(prev => ({ ...prev, compactMode: checked }))}
                    />
                  </SettingItem>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications">
              <Card variant="gradient">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SettingItem
                    icon={<Mail className="w-5 h-5" />}
                    title="Email Notifications"
                    description="Receive notifications via email"
                  >
                    <ToggleSwitch
                      checked={notificationSettings.emailNotifications}
                      onChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </SettingItem>

                  <SettingItem
                    icon={<Smartphone className="w-5 h-5" />}
                    title="Push Notifications"
                    description="Receive push notifications on your device"
                  >
                    <ToggleSwitch
                      checked={notificationSettings.pushNotifications}
                      onChange={(checked) => setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))}
                    />
                  </SettingItem>

                  <SettingItem
                    icon={<BookOpen className="w-5 h-5" />}
                    title="Course Updates"
                    description="Get notified about new content and updates"
                  >
                    <ToggleSwitch
                      checked={notificationSettings.courseUpdates}
                      onChange={(checked) => setNotificationSettings(prev => ({ ...prev, courseUpdates: checked }))}
                    />
                  </SettingItem>

                  <SettingItem
                    icon={<Crown className="w-5 h-5" />}
                    title="Achievements"
                    description="Celebrate your learning milestones"
                  >
                    <ToggleSwitch
                      checked={notificationSettings.achievements}
                      onChange={(checked) => setNotificationSettings(prev => ({ ...prev, achievements: checked }))}
                    />
                  </SettingItem>

                  <SettingItem
                    icon={<Mail className="w-5 h-5" />}
                    title="Weekly Digest"
                    description="Summary of your weekly progress"
                  >
                    <ToggleSwitch
                      checked={notificationSettings.weeklyDigest}
                      onChange={(checked) => setNotificationSettings(prev => ({ ...prev, weeklyDigest: checked }))}
                    />
                  </SettingItem>

                  <SettingItem
                    icon={<Info className="w-5 h-5" />}
                    title="Marketing Communications"
                    description="Receive updates about new features and offers"
                  >
                    <ToggleSwitch
                      checked={notificationSettings.marketing}
                      onChange={(checked) => setNotificationSettings(prev => ({ ...prev, marketing: checked }))}
                    />
                  </SettingItem>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy">
              <Card variant="gradient">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>Privacy & Visibility</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SettingItem
                    icon={<User className="w-5 h-5" />}
                    title="Profile Visibility"
                    description="Control who can see your profile"
                  >
                    <div className="w-48">
                      <Dropdown
                        value={privacySettings.profileVisibility}
                        options={[
                          { value: "public", label: "Public", description: "Everyone can see" },
                          { value: "friends", label: "Friends Only", description: "Only friends can see" },
                          { value: "private", label: "Private", description: "Only you can see" },
                        ]}
                        onChange={(value) => setPrivacySettings(prev => ({ ...prev, profileVisibility: value }))}
                      />
                    </div>
                  </SettingItem>

                  <SettingItem
                    icon={<Crown className="w-5 h-5" />}
                    title="Show Progress"
                    description="Display your learning progress publicly"
                  >
                    <ToggleSwitch
                      checked={privacySettings.showProgress}
                      onChange={(checked) => setPrivacySettings(prev => ({ ...prev, showProgress: checked }))}
                    />
                  </SettingItem>

                  <SettingItem
                    icon={<Crown className="w-5 h-5" />}
                    title="Show Achievements"
                    description="Display your badges and achievements"
                  >
                    <ToggleSwitch
                      checked={privacySettings.showAchievements}
                      onChange={(checked) => setPrivacySettings(prev => ({ ...prev, showAchievements: checked }))}
                    />
                  </SettingItem>

                  <SettingItem
                    icon={<Mail className="w-5 h-5" />}
                    title="Allow Messages"
                    description="Let other users send you messages"
                  >
                    <ToggleSwitch
                      checked={privacySettings.allowMessages}
                      onChange={(checked) => setPrivacySettings(prev => ({ ...prev, allowMessages: checked }))}
                    />
                  </SettingItem>

                  <SettingItem
                    icon={<Info className="w-5 h-5" />}
                    title="Data Collection"
                    description="Help improve the platform with usage analytics"
                  >
                    <ToggleSwitch
                      checked={privacySettings.dataCollection}
                      onChange={(checked) => setPrivacySettings(prev => ({ ...prev, dataCollection: checked }))}
                    />
                  </SettingItem>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Management */}
            <TabsContent value="data">
              <div className="space-y-6">
                <Card variant="gradient">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Download className="w-5 h-5" />
                      <span>Data Export</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <SettingItem
                      icon={<Download className="w-5 h-5" />}
                      title="Download Your Data"
                      description="Export all your course data, progress, and settings"
                    >
                      <Button variant="outline" size="sm">Export Data</Button>
                    </SettingItem>

                    <SettingItem
                      icon={<Download className="w-5 h-5" />}
                      title="Download Certificates"
                      description="Get PDF copies of your course completion certificates"
                    >
                      <Button variant="outline" size="sm">Download</Button>
                    </SettingItem>
                  </CardContent>
                </Card>

                <Card variant="gradient">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                      <AlertTriangle className="w-5 h-5" />
                      <span>Danger Zone</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SettingItem
                      icon={<Trash2 className="w-5 h-5" />}
                      title="Delete Account"
                      description="Permanently delete your account and all associated data"
                      warning
                    >
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        Delete Account
                      </Button>
                    </SettingItem>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Delete Account
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </p>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                className="flex-1"
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Delete Account
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </ViewContainer>
  );
}