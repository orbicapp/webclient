import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Camera, 
  FileText, 
  Sparkles, 
  Wand2, 
  Globe,
  BookOpen,
  Zap,
  ChevronDown,
  X,
  Check,
  AlertCircle,
  Loader2
} from "lucide-react";

import { ViewContainer } from "@/components/layout/ViewContainer";
import { Card, CardContent } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { CourseCategory } from "@/services/course-service";
import { AIService, GenerateCourseFromFileInput, GenerateCourseFromTextInput } from "@/services/ai-service";
import { FileUploadClient } from "@/lib/utils/file-upload.utils";

// Course categories with icons and descriptions
const courseCategories: Array<{
  value: CourseCategory;
  label: string;
  icon: string;
  description: string;
}> = [
  { value: "mathematics", label: "Mathematics", icon: "📐", description: "Numbers, equations, and logic" },
  { value: "science", label: "Science", icon: "🔬", description: "Physics, chemistry, biology" },
  { value: "technology", label: "Technology", icon: "💻", description: "Programming, AI, digital skills" },
  { value: "language", label: "Language", icon: "🗣️", description: "Communication and linguistics" },
  { value: "history", label: "History", icon: "📚", description: "Past events and civilizations" },
  { value: "art", label: "Art", icon: "🎨", description: "Creative expression and design" },
  { value: "business", label: "Business", icon: "💼", description: "Entrepreneurship and management" },
  { value: "health", label: "Health", icon: "🏥", description: "Wellness and medical knowledge" },
  { value: "other", label: "Other", icon: "✨", description: "Miscellaneous topics" },
];

// Languages with flags
const languages = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "es", label: "Español", flag: "🇪🇸" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
  { value: "it", label: "Italiano", flag: "🇮🇹" },
  { value: "pt", label: "Português", flag: "🇵🇹" },
  { value: "zh", label: "中文", flag: "🇨🇳" },
  { value: "ja", label: "日本語", flag: "🇯🇵" },
];

interface CourseFormData {
  title: string;
  category: CourseCategory | "";
  language: string;
}

export function CreateCoursePage() {
  const [activeTab, setActiveTab] = useState("document");
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    category: "",
    language: "en",
  });
  const [textContent, setTextContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string>("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadClient = new FileUploadClient();

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

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationStatus("Preparing your course...");

    try {
      let jobId: string;

      if (activeTab === "text") {
        if (!textContent.trim()) {
          throw new Error("Please enter some content to generate a course from");
        }

        const input: GenerateCourseFromTextInput = {
          content: textContent,
          title: formData.title || undefined,
          category: formData.category || undefined,
          lang: formData.language,
        };

        const [result, error] = await AIService.generateCourseFromText(input);
        if (error || !result) {
          throw new Error(error || "Failed to start course generation");
        }
        jobId = result;
      } else {
        // Document or camera
        if (!selectedFile) {
          throw new Error("Please select a file or take a photo");
        }

        setGenerationStatus("Uploading file...");
        
        // Upload file first
        const uploadedFile = await uploadClient.upload(selectedFile, {
          onProgress: (progress) => {
            setGenerationStatus(`Uploading... ${progress.percentage}%`);
          },
        });

        setGenerationStatus("Processing with AI...");

        const input: GenerateCourseFromFileInput = {
          fileId: uploadedFile._id,
          title: formData.title || undefined,
          category: formData.category || undefined,
          lang: formData.language,
        };

        const [result, error] = await AIService.generateCourseFromfile(input);
        if (error || !result) {
          throw new Error(error || "Failed to start course generation");
        }
        jobId = result;
      }

      setGenerationStatus("AI is creating your course...");
      
      // TODO: Navigate to generation status page or show progress
      console.log("Course generation started with job ID:", jobId);
      
    } catch (error) {
      console.error("Generation failed:", error);
      setGenerationStatus("");
      // TODO: Show error message
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedCategory = courseCategories.find(cat => cat.value === formData.category);
  const selectedLanguage = languages.find(lang => lang.value === formData.language);

  const canGenerate = () => {
    if (activeTab === "text") {
      return textContent.trim().length > 0;
    }
    return selectedFile !== null;
  };

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
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
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
                left: `${20 + Math.cos(i * 60 * Math.PI / 180) * 40}px`,
                top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 40}px`,
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
          Create with AI
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Transform your knowledge into an interactive course. Upload a document, capture content, or write your ideas.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {/* Course Details Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card variant="gradient" className="mb-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200/50 dark:border-gray-700/50">
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Course Title */}
                <div className="md:col-span-1">
                  <Input
                    label="Course Title"
                    placeholder="Auto-generated if empty"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    leftIcon={<BookOpen className="w-5 h-5" />}
                    variant="glass"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <button
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{selectedCategory?.icon || "✨"}</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {selectedCategory?.label || "Auto-generated if empty"}
                      </span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showCategoryDropdown && (
                      <motion.div
                        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200/50 dark:border-gray-700/50 z-50 max-h-80 overflow-y-auto"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-2">
                          {/* Clear selection option */}
                          <button
                            onClick={() => {
                              setFormData(prev => ({ ...prev, category: "" }));
                              setShowCategoryDropdown(false);
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <span className="text-lg">✨</span>
                            <div className="text-left">
                              <div className="font-medium text-gray-900 dark:text-gray-100">Auto-generate</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">Let AI choose the best category</div>
                            </div>
                          </button>
                          
                          {courseCategories.map((category) => (
                            <button
                              key={category.value}
                              onClick={() => {
                                setFormData(prev => ({ ...prev, category: category.value }));
                                setShowCategoryDropdown(false);
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <span className="text-lg">{category.icon}</span>
                              <div className="text-left">
                                <div className="font-medium text-gray-900 dark:text-gray-100">{category.label}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{category.description}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Language Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <button
                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{selectedLanguage?.flag}</span>
                      <span className="text-gray-900 dark:text-gray-100">{selectedLanguage?.label}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showLanguageDropdown && (
                      <motion.div
                        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200/50 dark:border-gray-700/50 z-50 max-h-60 overflow-y-auto"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-2">
                          {languages.map((language) => (
                            <button
                              key={language.value}
                              onClick={() => {
                                setFormData(prev => ({ ...prev, language: language.value }));
                                setShowLanguageDropdown(false);
                              }}
                              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <span className="text-lg">{language.flag}</span>
                              <span className="font-medium text-gray-900 dark:text-gray-100">{language.label}</span>
                              {formData.language === language.value && (
                                <Check className="w-4 h-4 text-purple-600 ml-auto" />
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
          <Card variant="glass" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50">
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm">
                  <TabsTrigger value="document" className="flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Document</span>
                  </TabsTrigger>
                  <TabsTrigger value="camera" className="flex items-center space-x-2">
                    <Camera className="w-4 h-4" />
                    <span>Photo</span>
                  </TabsTrigger>
                  <TabsTrigger value="text" className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Text</span>
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
                          Upload Document
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          PDF, Word, Text, or Markdown files
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
                              <div className="font-medium text-green-900 dark:text-green-100">{selectedFile.name}</div>
                              <div className="text-sm text-green-600 dark:text-green-400">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
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
                          Take Photo
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Capture notes, whiteboards, or documents
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
                              <div className="font-medium text-blue-900 dark:text-blue-100">Photo captured</div>
                              <div className="text-sm text-blue-600 dark:text-blue-400">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
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
                      Course Content
                    </label>
                    <textarea
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="Write your course content here... Share your knowledge, explain concepts, provide examples, and create engaging learning material."
                      className="w-full h-64 px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:border-purple-400 dark:focus:border-purple-500 focus:outline-none focus:ring-0 transition-all duration-200 resize-none text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {textContent.length} characters
                      </div>
                      {textContent.length > 100 && (
                        <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                          <Check className="w-4 h-4" />
                          <span className="text-sm">Good length for AI processing</span>
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
                  leftIcon={isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                >
                  {isGenerating ? "Creating Course..." : "Generate Course with AI"}
                </Button>

                {generationStatus && (
                  <motion.div
                    className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200 dark:border-purple-800"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                      <span className="text-purple-900 dark:text-purple-100 font-medium">
                        {generationStatus}
                      </span>
                    </div>
                  </motion.div>
                )}

                {!canGenerate() && !isGenerating && (
                  <div className="mt-4 flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">
                      {activeTab === "text" 
                        ? "Please enter some content to generate a course" 
                        : "Please upload a file or take a photo"}
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
              title: "Smart Processing",
              description: "AI analyzes your content and creates structured lessons automatically"
            },
            {
              icon: <BookOpen className="w-8 h-8" />,
              title: "Interactive Content",
              description: "Generates quizzes, exercises, and engaging learning activities"
            },
            {
              icon: <Globe className="w-8 h-8" />,
              title: "Multi-language",
              description: "Create courses in multiple languages with automatic translation"
            }
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