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
      courseId
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
      courseId
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
      author
      title
      description
      lang
      category
      chaptersCount
      thumbnailId
      bannerId
      visibility
      isApproved
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
        author
        title
        description
        lang
        category
        chaptersCount
        thumbnailId
        bannerId
        visibility
        isApproved
        createdAt
        updatedAt
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
        author
        title
        description
        lang
        category
        chaptersCount
        thumbnailId
        bannerId
        visibility
        isApproved
        createdAt
        updatedAt
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
        author
        title
        description
        lang
        category
        chaptersCount
        thumbnailId
        bannerId
        visibility
        isApproved
        createdAt
        updatedAt
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
      userId
      levelId
      chapterId
      courseId
      lives
      startTime
      endTime
      status
      stars
      score
      maxScore
      createdAt
      updatedAt
    }
  }
`;

export const GET_LEVEL_COMPLETION_QUERY = gql`
  query LevelCompletion($sessionId: ID!) {
    levelCompletion(sessionId: $sessionId) {
      levelId
      courseId
      chapterId
      score
      maxScore
      stars
      correctAnswers
      totalQuestions
      timeSpent
      isNewHighScore
      nextLevelId
      isChapterCompleted
      isCourseCompleted
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
      chapterId
      courseId
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

export const GET_COURSE_LEVELS_QUERY = gql`
  query CourseLevels($courseId: ID!) {
    courseLevels(courseId: $courseId) {
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
      isCompleted
      completedAt
      totalChapters
      completedChapters
      totalLevels
      completedLevels
      totalScore
      totalStars
      totalTimeSpent
      createdAt
      updatedAt
      chapterProgress {
        chapterId
        isCompleted
        isUnlocked
        completedLevels
        totalLevels
        totalStars
        maxPossibleStars
        completedAt
      }
      levelProgress {
        levelId
        completed
        bestScore
        bestStars
        totalTimeSpent
        attempts
        firstCompletedAt
        lastCompletedAt
      }
    }
  }
`;

export const GET_MY_PLAYING_COURSES_QUERY = gql`
  query MyPlayingCourses {
    myPlayingCourses {
      _id
      courseId
      userId
      isCompleted
      completedAt
      totalChapters
      completedChapters
      totalLevels
      completedLevels
      totalScore
      totalStars
      totalTimeSpent
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
      isCompleted
      completedAt
      totalChapters
      completedChapters
      totalLevels
      completedLevels
      totalScore
      totalStars
      totalTimeSpent
      createdAt
      updatedAt
    }
  }
`;

export const GET_MY_COURSES_WITH_PROGRESS_QUERY = gql`
  query MyCoursesWithProgress {
    myCoursesWithProgress {
      course {
        _id
        author
        title
        description
        lang
        category
        chaptersCount
        thumbnailId
        bannerId
        visibility
        isApproved
        createdAt
        updatedAt
      }

      progress {
        _id
        courseId
        userId
        isCompleted
        completedAt
        totalChapters
        completedChapters
        totalLevels
        completedLevels
        totalScore
        totalStars
        totalTimeSpent
        createdAt
        updatedAt
      }
    }
  }
`;

// ==================== Stats Module ====================

export const GET_MY_STATS_QUERY = gql`
  query MyStats {
    myStats {
      totalCoursesCompleted
      totalLevelsCompleted
      totalTimeSpent
      totalLivesLost
      totalStarsEarned
      totalScore
      currentStreak
      longestStreak
      categoryStats {
        category
        coursesCompleted
        levelsCompleted
        totalStars
        totalScore
      }
      dailyActivity {
        date
        levelsCompleted
        timeSpent
        starsEarned
        score
      }
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
      username
      email
      displayName
      isEmailVerified
      avatarId
      createdAt
      updatedAt
    }
  }
`;
