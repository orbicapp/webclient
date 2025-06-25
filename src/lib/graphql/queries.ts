/**
 * GraphQL queries
 */

import { gql } from "@apollo/client";

// ==================== AI Module ====================
export const GET_COURSE_GENERATION_STATUS_QUERY = gql`
  query GetCourseGenerationStatus($jobId: String!) {
    getCourseGenerationStatus(jobId: $jobId) {
      jobId
      status
      progress
      message
      error
      courseId
      createdAt
      completedAt
    }
  }
`;

export const PREVIEW_GENERATED_COURSE_QUERY = gql`
  query PreviewGeneratedCourse($jobId: String!) {
    previewGeneratedCourse(jobId: $jobId) {
      course {
        _id
        title
        description
        category
        lang
      }
      chapterCount
      sampleChapters {
        _id
        title
        description
      }
      sampleLevel {
        _id
        title
        description
        questions {
          type
          question
        }
      }
    }
  }
`;

// ==================== Auth Module ====================
// (None)

// ==================== Chapters Module ====================
export const GET_CHAPTER_QUERY = gql`
  query Chapter($id: ID!) {
    chapter(id: $id) {
      _id
      title
      description
      order
      levelsCount
      createdAt
      updatedAt
    }
  }
`;

export const GET_COURSE_CHAPTERS_QUERY = gql`
  query CourseChapters($courseId: ID!) {
    courseChapters(courseId: $courseId) {
      _id
      title
      description
      order
      levelsCount
      createdAt
      updatedAt
    }
  }
`;

// ==================== Courses Module ====================
export const GET_COURSE_QUERY = gql`
  query Course($id: ID!) {
    course(id: $id) {
      _id
      title
      description
      category
      lang
      visibility
      isApproved
      thumbnailId
      bannerId
      author
      createdAt
      updatedAt
    }
  }
`;

export const GET_COURSES_QUERY = gql`
  query Courses($filter: CourseFilterInput, $limit: Int, $offset: Int) {
    courses(filter: $filter, limit: $limit, offset: $offset) {
      courses {
        _id
        title
        description
        category
        lang
        visibility
        thumbnailId
        createdAt
      }
      total
      limit
      offset
      hasMore
    }
  }
`;

export const GET_MY_COURSES_QUERY = gql`
  query MyCourses($limit: Int, $offset: Int) {
    myCourses(limit: $limit, offset: $offset) {
      courses {
        _id
        title
        description
        category
        lang
        visibility
        thumbnailId
        createdAt
      }
      total
      limit
      offset
      hasMore
    }
  }
`;

export const GET_PUBLIC_COURSES_QUERY = gql`
  query PublicCourses($limit: Int, $offset: Int) {
    publicCourses(limit: $limit, offset: $offset) {
      courses {
        _id
        title
        description
        category
        lang
        visibility
        thumbnailId
        createdAt
      }
      total
      limit
      offset
      hasMore
    }
  }
`;

// ==================== Game Module ====================
export const GET_CURRENT_GAME_SESSION_QUERY = gql`
  query CurrentGameSession {
    currentGameSession {
      _id
      levelId
      chapterId
      courseId
      userId
      status
      startTime
      endTime
      score
      maxScore
      stars
      lives
      currentQuestionIndex
      createdAt
      updatedAt
    }
  }
`;

export const GET_LEVEL_PROGRESS_QUERY = gql`
  query LevelProgress($levelId: ID!) {
    levelProgress(levelId: $levelId) {
      levelId
      isCompleted
      bestScore
      bestStars
      totalTimeSpent
      attempts
      recentAttempts {
        sessionId
        score
        stars
        timeSpent
        completedAt
      }
    }
  }
`;

export const GET_COURSE_GAME_PROGRESS_QUERY = gql`
  query CourseGameProgress($courseId: ID!) {
    courseGameProgress(courseId: $courseId) {
      courseId
      isCompleted
      totalChapters
      completedChapters
      totalLevels
      completedLevels
      totalStars
      maxPossibleStars
      completionPercentage
      chapterProgress {
        chapterId
        title
        isCompleted
        isLocked
        totalLevels
        completedLevels
        totalStars
        maxPossibleStars
      }
    }
  }
`;

export const GET_MY_STATS_QUERY = gql`
  query MyStats {
    myStats {
      currentStreak
      longestStreak
      totalCoursesCompleted
      totalLevelsCompleted
      totalScore
      totalStarsEarned
      totalTimeSpent
      totalLivesLost
      categoriesStats {
        category
        coursesCompleted
        levelsCompleted
        totalScore
        totalStars
      }
    }
  }
`;

export const GET_LEVEL_COMPLETION_QUERY = gql`
  query LevelCompletion($sessionId: ID!) {
    levelCompletion(sessionId: $sessionId) {
      chapterId
      courseId
      levelId
      score
      maxScore
      stars
      timeSpent
      correctAnswers
      totalQuestions
      isChapterCompleted
      isCourseCompleted
      isNewHighScore
      nextLevelId
    }
  }
`;

// ==================== Levels Module ====================
export const GET_LEVEL_QUERY = gql`
  query Level($id: ID!) {
    level(id: $id) {
      _id
      title
      description
      order
      questions {
        type
        question
        ... on MultipleChoiceQuestion {
          options {
            text
            isCorrect
          }
        }
        ... on FreeChoiceQuestion {
          acceptedAnswers
        }
        ... on TrueFalseQuestion {
          correctAnswer
        }
        ... on PairsQuestion {
          pairs {
            left
            right
          }
        }
        ... on SequenceQuestion {
          correctSequence
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_CHAPTER_LEVELS_QUERY = gql`
  query ChapterLevels($chapterId: ID!) {
    chapterLevels(chapterId: $chapterId) {
      _id
      title
      description
      order
      createdAt
      updatedAt
    }
  }
`;

// ==================== Progress Module ====================
export const GET_COURSE_PROGRESS_QUERY = gql`
  query CourseProgress($courseId: ID!) {
    courseProgress(courseId: $courseId) {
      _id
      courseId
      userId
      completed
      currentChapter
      currentLevel
      totalScore
      totalMaxScore
      createdAt
      updatedAt
    }
  }
`;

export const GET_MY_PLAYING_COURSES_QUERY = gql`
  query MyPlayingCourses {
    myPlayingCourses {
      _id
      courseId
      userId
      completed
      currentChapter
      currentLevel
      totalScore
      totalMaxScore
      createdAt
      updatedAt
    }
  }
`;

export const GET_MY_COMPLETED_COURSES_QUERY = gql`
  query MyCompletedCourses {
    myCompletedCourses {
      _id
      courseId
      userId
      completed
      currentChapter
      currentLevel
      totalScore
      totalMaxScore
      createdAt
      updatedAt
    }
  }
`;

// ==================== Storage Module ====================
export const GET_USER_FILES_QUERY = gql`
  query GetUserFiles {
    getUserFiles {
      _id
      filename
      mimetype
      size
      createdAt
    }
  }
`;

export const GET_FILE_BY_ID_QUERY = gql`
  query GetFileById($id: String!) {
    getFileById(id: $id) {
      _id
      filename
      mimetype
      size
      createdAt
    }
  }
`;

export const GET_USER_STORAGE_STATS_QUERY = gql`
  query GetUserStorageStats {
    getUserStorageStats {
      used
      remaining
      limit
    }
  }
`;

// ==================== Users Module ====================
export const GET_ME_QUERY = gql`
  query Me {
    me {
      _id
      email
      displayName
      username
      isEmailVerified
      avatarId
      createdAt
      updatedAt
    }
  }
`;
