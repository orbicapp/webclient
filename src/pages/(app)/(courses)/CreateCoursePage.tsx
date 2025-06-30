import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Camera,
  FileText,
  Sparkles,
  Wand2,
  Globe,
  BookOpen,
  Zap,
  X,
  Check,
  AlertCircle,
  Loader2,
  CheckCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ViewContainer } from "@/components/layout/ViewContainer";
import { Card, CardContent } from "@/components/ui/Card";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/Tabs";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Dropdown, { DropdownOption } from "@/components/ui/Dropdown";
import { CourseCategory } from "@/services/course-service";
import {
  AIService,
  GenerateCourseFromFileInput,
  GenerateCourseFromTextInput,
  CourseGenerationStatus,
} from "@/services/ai-service";
import { FileUploadClient } from "@/lib/utils/file-upload.utils";
import { useI18n } from "@/hooks/use-i18n";
import { useAuth } from "@/hooks/use-auth";

// Course categories with icons and descriptions
const courseCategories: DropdownOption[] = [
  {
    value: "mathematics",
    label: "Mathematics",
    icon: "📐",
    description: "Numbers, equations, and logic",
  },
  {
    value: "science",
    label: "Science",
    icon: "🔬",
    description: "Physics, chemistry, biology",
  },
  {
    value: "technology",
    label: "Technology",
    icon: "💻",
    description: "Programming, AI, digital skills",
  },
  {
    value: "language",
    label: "Language",
    icon: "🗣️",
    description: "Communication and linguistics",
  },
  {
    value: "history",
    label: "History",
    icon: "📚",
    description: "Past events and civilizations",
  },
  {
    value: "art",
    label: "Art",
    icon: "🎨",
    description: "Creative expression and design",
  },
  {
    value: "business",
    label: "Business",
    icon: "💼",
    description: "Entrepreneurship and management",
  },
  {
    value: "health",
    label: "Health",
    icon: "🏥",
    description: "Wellness and medical knowledge",
  },
  {
    value: "other",
    label: "Other",
    icon: "✨",
    description: "Miscellaneous topics",
  },
];

// Languages with flags
const languages: DropdownOption[] = [
  { value: "en", label: "English", icon: "🇺🇸" },
  { value: "es", label: "Español", icon: "🇪🇸" },
  { value: "fr", label: "Français", icon: "🇫🇷" },
  { value: "de", label: "Deutsch", icon: "🇩🇪" },
  { value: "it", label: "Italiano", icon: "🇮🇹" },
  { value: "pt", label: "Português", icon: "🇵🇹" },
  { value: "zh", label: "中文", icon: "🇨🇳" },
  { value: "ja", label: "日本語", icon: "🇯🇵" },
];

interface CourseFormData {
  title: string;
  category: CourseCategory | "";
  language: string;
}

// Progress component for generation status
const GenerationProgress: React.FC<{
  status: CourseGenerationStatus;
  onGoToCourse: (courseId: string) => void;
  onRetry: () => void;
}> = ({ status, onGoToCourse, onRetry }) => {
  const { t } = useI18n();

  const getStatusIcon = () => {
    switch (status.status) {
      case "pending":
        return <Loader2 className="w-8 h-8 animate-spin text-blue-500" />;
      case "processing":
        return <Loader2 className="w-8 h-8 animate-spin text-purple-500" />;
      case "completed":
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case "failed":
        return <AlertCircle className="w-8 h-8 text-red-500" />;
      default:
        return <Loader2 className="w-8 h-8 animate-spin text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case "pending":
        return "from-blue-500 to-indigo-600";
      case "processing":
        return "from-purple-500 to-pink-600";
      case "completed":
        return "from-green-500 to-emerald-600";
      case "failed":
        return "from-red-500 to-pink-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getStatusText = () => {
    switch (status.status) {
      case "pending":
        return t("createCourse.generation.status.preparing");
      case "completed":
        return t("createCourse.generation.status.completed");
      case "failed":
        return t("createCourse.generation.status.failed");
      default:
        return t("createCourse.generation.status.processing");
    }
  };

  return (
    <motion.div
      className="text-center space-y-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Status Icon */}
      <motion.div
        className="relative mx-auto"
        animate={
          status.status === "processing"
            ? {
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div
          className={`w-24 h-24 bg-gradient-to-br ${getStatusColor()} rounded-3xl flex items-center justify-center mx-auto shadow-2xl`}
        >
          {getStatusIcon()}
        </div>

        {/* Floating sparkles for processing */}
        {status.status === "processing" && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: `${20 + Math.cos((i * 60 * Math.PI) / 180) * 50}px`,
                  top: `${20 + Math.sin((i * 60 * Math.PI) / 180) * 50}px`,
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
          </>
        )}
      </motion.div>

      {/* Status Text */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {getStatusText()}
        </h3>
        {status.message && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {status.message}
          </p>
        )}
      </div>

      {/* Progress Bar */}
      {(status.status === "pending" || status.status === "processing") && (
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>{t("createCourse.generation.status.progress")}</span>
            <span>{Math.round(status.progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <motion.div
              className={`bg-gradient-to-r ${getStatusColor()} h-3 rounded-full transition-all duration-500`}
              initial={{ width: 0 }}
              animate={{ width: `${status.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Course Info */}
      {status.title && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {status.title}
          </h4>
          {status.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {status.description}
            </p>
          )}
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="capitalize">{status.category}</span>
            <span>•</span>
            <span>{status.lang.toUpperCase()}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {status.status === "failed" && status.error && (
        <motion.div
          className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 max-w-md mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-red-800 dark:text-red-200 font-medium mb-1">
                Error en la generación
              </p>
              <p className="text-red-600 dark:text-red-400 text-sm">
                {status.error}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
        {status.status === "completed" && status.courseId && (
          <Button
            onClick={() => onGoToCourse(status.courseId!)}
            variant="primary"
            size="lg"
            leftIcon={<ExternalLink className="w-5 h-5" />}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            {t("createCourse.generation.status.goToCourse")}
          </Button>
        )}

        {status.status === "failed" && (
          <Button
            onClick={onRetry}
            variant="primary"
            size="lg"
            leftIcon={<RefreshCw className="w-5 h-5" />}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {t("createCourse.generation.status.retry")}
          </Button>
        )}
      </div>

      {/* Timestamps */}
      {(status.createdAt || status.completedAt) && (
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          {status.createdAt && (
            <div>
              {t("createCourse.timestamps.startedAt")}
              {new Date(status.createdAt).toLocaleString()}
            </div>
          )}
          {status.completedAt && (
            <div>
              {t("createCourse.timestamps.createdAt")}
              {new Date(status.completedAt).toLocaleString()}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export function CreateCoursePage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("document");
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    category: "",
    language: "en",
  });
  const [textContent, setTextContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationJobId, setGenerationJobId] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] =
    useState<CourseGenerationStatus | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadClient = new FileUploadClient();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Polling function to check generation status
  const pollGenerationStatus = async (jobId: string) => {
    try {
      const [status, error] = await AIService.getCourseGenerationStatus(jobId);

      if (error) {
        console.error("Error polling generation status:", error);
        setGenerationError(error);
        stopPolling();
        return;
      }

      if (status) {
        setGenerationStatus(status);

        // Stop polling if generation is complete or failed
        if (status.status === "completed" || status.status === "failed") {
          stopPolling();
          setIsGenerating(false);
        }
      }
    } catch (err) {
      console.error("Error in polling:", err);
      setGenerationError(
        err instanceof Error ? err.message : "Error checking status"
      );
      stopPolling();
    }
  };

  // Start polling
  const startPolling = (jobId: string) => {
    // Initial call
    pollGenerationStatus(jobId);

    // Set up interval for every 3 seconds
    pollingIntervalRef.current = setInterval(() => {
      pollGenerationStatus(jobId);
    }, 3000);
  };

  // Stop polling
  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setActiveTab("document"); // Switch to document tab after capture
    }
  };

  const resetGenerationState = () => {
    setGenerationJobId(null);
    setGenerationStatus(null);
    setGenerationError(null);
    setIsGenerating(false);
    stopPolling();
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    resetGenerationState();

    try {
      let jobId: string;

      if (activeTab === "text") {
        if (!textContent.trim()) {
          throw new Error(t("createCourse.generate.requirements.text"));
        }

        const input: GenerateCourseFromTextInput = {
          content: textContent,
          title: formData.title || undefined,
          category: formData.category || undefined,
          lang: formData.language,
        };

        const [result, error] = await AIService.generateCourseFromText(input);
        if (error || !result) {
          throw new Error(error || t("createCourse.unknownError"));
        }
        jobId = result;
      } else {
        // Document or camera
        if (!selectedFile) {
          throw new Error(t("createCourse.generate.requirements.file"));
        }

        // Upload file first
        const uploadedFile = await uploadClient.upload(selectedFile, {
          onProgress: (progress) => {
            console.log(`Uploading... ${progress.percentage}%`);
          },
        });

        const input: GenerateCourseFromFileInput = {
          fileId: uploadedFile._id,
          title: formData.title || undefined,
          category: formData.category || undefined,
          lang: formData.language,
        };

        const [result, error] = await AIService.generateCourseFromfile(input);
        if (error || !result) {
          throw new Error(error || t("createCourse.unknownError"));
        }
        jobId = result;
      }

      // Start polling for status updates
      setGenerationJobId(jobId);
      startPolling(jobId);
    } catch (error) {
      console.error("Generation failed:", error);
      setGenerationError(
        error instanceof Error ? error.message : t("createCourse.unknownError")
      );
      setIsGenerating(false);
    }
  };

  const handleGoToCourse = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  const handleRetry = () => {
    resetGenerationState();
  };

  const canGenerate = () => {
    if (!user?.isEmailVerified) return false;

    if (activeTab === "text") {
      return textContent.trim().length > 0;
    }
    return selectedFile !== null;
  };

  // Show generation progress if we have a job ID or status
  if (generationJobId || generationStatus) {
    return (
      <ViewContainer className="py-8">
        <div className="max-w-2xl mx-auto">
          <Card
            variant="glass"
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50"
          >
            <CardContent>
              {generationStatus ? (
                <GenerationProgress
                  status={generationStatus}
                  onGoToCourse={handleGoToCourse}
                  onRetry={handleRetry}
                />
              ) : (
                <div className="text-center py-12">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {t("createCourse.starting.title")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t("createCourse.starting.description")}
                  </p>
                </div>
              )}

              {generationError && (
                <motion.div
                  className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="text-red-800 dark:text-red-200 font-medium">
                        {t("createCourse.generation.error")}
                      </p>
                      <p className="text-red-600 dark:text-red-400 text-sm">
                        {generationError}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={handleRetry}
                      variant="outline"
                      size="sm"
                      leftIcon={<RefreshCw className="w-4 h-4" />}
                    >
                      {t("common.tryAgain")}
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </ViewContainer>
    );
  }

  return (
    <ViewContainer className="py-8">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative inline-block mb-6">
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/25"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Wand2 className="w-10 h-10 text-white" />
          </motion.div>

          {/* Floating sparkles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                left: `${20 + Math.cos((i * 60 * Math.PI) / 180) * 40}px`,
                top: `${20 + Math.sin((i * 60 * Math.PI) / 180) * 40}px`,
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
        </div>

        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
          {t("createCourse.title")}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          {t("createCourse.subtitle")}
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {/* Course Details Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card
            variant="gradient"
            className="mb-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200/50 dark:border-gray-700/50"
          >
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Course Title */}
                <div className="md:col-span-1">
                  <Input
                    label={t("createCourse.courseDetails.title")}
                    placeholder={t(
                      "createCourse.courseDetails.titlePlaceholder"
                    )}
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    leftIcon={<BookOpen className="w-5 h-5" />}
                    variant="glass"
                  />
                </div>

                {/* Category Dropdown */}
                <div>
                  <Dropdown
                    label={t("createCourse.courseDetails.category")}
                    placeholder={t(
                      "createCourse.courseDetails.categoryPlaceholder"
                    )}
                    value={formData.category}
                    options={courseCategories}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: value as CourseCategory,
                      }))
                    }
                    variant="glass"
                    showClearOption
                    clearOptionLabel={t(
                      "createCourse.courseDetails.autoGenerate"
                    )}
                    clearOptionIcon="✨"
                    clearOptionDescription={t(
                      "createCourse.courseDetails.autoGenerateDescription"
                    )}
                  />
                </div>

                {/* Language Dropdown */}
                <div>
                  <Dropdown
                    label={t("createCourse.courseDetails.language")}
                    value={formData.language}
                    options={languages}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, language: value }))
                    }
                    variant="glass"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Input Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card
            variant="glass"
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50"
          >
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                defaultValue="document"
                variant="fancy"
              >
                <TabsList className="mb-8 justify-center">
                  <TabsTrigger value="document">
                    <Upload className="w-4 h-4" />
                    <span>{t("createCourse.tabs.document")}</span>
                  </TabsTrigger>
                  <TabsTrigger value="camera">
                    <Camera className="w-4 h-4" />
                    <span>{t("createCourse.tabs.camera")}</span>
                  </TabsTrigger>
                  <TabsTrigger value="text">
                    <FileText className="w-4 h-4" />
                    <span>{t("createCourse.tabs.text")}</span>
                  </TabsTrigger>
                </TabsList>

                {/* Document Upload Tab */}
                <TabsContent value="document" className="space-y-6">
                  <div className="text-center">
                    <motion.div
                      className="relative inline-block"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.md"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full max-w-md mx-auto p-12 border-3 border-dashed border-purple-300 dark:border-purple-600 rounded-3xl hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30"
                      >
                        <Upload className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                          {t("createCourse.document.title")}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {t("createCourse.document.description")}
                        </p>
                      </button>
                    </motion.div>

                    {selectedFile && (
                      <motion.div
                        className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-green-900 dark:text-green-100">
                                {selectedFile.name}
                              </div>
                              <div className="text-sm text-green-600 dark:text-green-400">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                MB
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedFile(null)}
                            className="p-2 hover:bg-green-200 dark:hover:bg-green-800 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </TabsContent>

                {/* Camera Tab */}
                <TabsContent value="camera" className="space-y-6">
                  <div className="text-center">
                    <motion.div
                      className="relative inline-block"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleCameraCapture}
                        className="hidden"
                      />
                      <button
                        onClick={() => cameraInputRef.current?.click()}
                        className="w-full max-w-md mx-auto p-12 border-3 border-dashed border-blue-300 dark:border-blue-600 rounded-3xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30"
                      >
                        <Camera className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                          {t("createCourse.camera.title")}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {t("createCourse.camera.description")}
                        </p>
                      </button>
                    </motion.div>

                    {selectedFile && (
                      <motion.div
                        className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                              <Camera className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-blue-900 dark:text-blue-100">
                                Foto capturada
                              </div>
                              <div className="text-sm text-blue-600 dark:text-blue-400">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                MB
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedFile(null)}
                            className="p-2 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </TabsContent>

                {/* Text Input Tab */}
                <TabsContent value="text" className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      {t("createCourse.text.title")}
                    </label>
                    <textarea
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder={t("createCourse.text.placeholder")}
                      className="w-full h-64 px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:border-purple-400 dark:focus:border-purple-500 focus:outline-none focus:ring-0 transition-all duration-200 resize-none text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {textContent.length}{" "}
                        {t("createCourse.text.charactersCount")}
                      </div>
                      {textContent.length > 100 && (
                        <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                          <Check className="w-4 h-4" />
                          <span className="text-sm">
                            {t("createCourse.text.goodLength")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Generate Button */}
              <div className="mt-8 text-center">
                <Button
                  onClick={handleGenerate}
                  disabled={!canGenerate() || isGenerating}
                  size="lg"
                  className="px-12 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  leftIcon={
                    isGenerating ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Sparkles className="w-6 h-6" />
                    )
                  }
                >
                  {!user?.isEmailVerified
                    ? t("createCourse.generate.verify")
                    : isGenerating
                    ? t("createCourse.generate.generating")
                    : t("createCourse.generate.button")}
                </Button>

                {!canGenerate() && !isGenerating && (
                  <div className="mt-4 flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">
                      {activeTab === "text"
                        ? t("createCourse.generate.requirements.text")
                        : t("createCourse.generate.requirements.file")}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Features Info */}
        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {[
            {
              icon: <Zap className="w-8 h-8" />,
              title: t("createCourse.features.intelligentProcessing.title"),
              description: t(
                "createCourse.features.intelligentProcessing.description"
              ),
            },
            {
              icon: <BookOpen className="w-8 h-8" />,
              title: t("createCourse.features.interactiveContent.title"),
              description: t(
                "createCourse.features.interactiveContent.description"
              ),
            },
            {
              icon: <Globe className="w-8 h-8" />,
              title: t("createCourse.features.multiLanguage.title"),
              description: t("createCourse.features.multiLanguage.description"),
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </ViewContainer>
  );
}
