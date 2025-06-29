/**
 * GraphQL mutations
 */

import { gql } from "@apollo/client";

// ==================== AI Module ====================
export const GENERATE_COURSE_FROM_TEXT_MUTATION = gql`
  mutation GenerateCourseFromText($input: GenerateCourseFromTextInput!) {
    generateCourseFromText(input: $input)
  }
`;

export const GENERATE_COURSE_FROM_FILE_MUTATION = gql`
  mutation GenerateCourseFromFile($input: GenerateCourseFromFileInput!) {
    generateCourseFromFile(input: $input)
  }
`;

// ==================== Auth Module ====================
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      sessionId
      user {
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
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterUserInput!) {
    register(input: $input) {
      accessToken
      refreshToken
      sessionId
      user {
        _id
        email
        displayName
        username
        isEmailVerified
        createdAt
        updatedAt
      }
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
      sessionId
      user {
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
  }
`;

export const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail($code: String!) {
    verifyEmail(code: $code)
  }
`;

export const REQUEST_PASSWORD_RESET_MUTATION = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email)
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($code: String!, $newPassword: String!) {
    resetPassword(code: $code, newPassword: $newPassword)
  }
`;

// ==================== Chapters Module ====================
export const CREATE_CHAPTER_MUTATION = gql`
  mutation CreateChapter($input: CreateChapterInput!) {
    createChapter(input: $input) {
      _id
      title
      description
      order
      courseId
      createdAt
    }
  }
`;

export const UPDATE_CHAPTER_MUTATION = gql`
  mutation UpdateChapter($id: ID!, $input: UpdateChapterInput!) {
    updateChapter(id: $id, input: $input) {
      _id
      title
      description
      order
      updatedAt
    }
  }
`;

export const DELETE_CHAPTER_MUTATION = gql`
  mutation DeleteChapter($id: ID!) {
    deleteChapter(id: $id)
  }
`;

export const REORDER_CHAPTERS_MUTATION = gql`
  mutation ReorderChapters($courseId: ID!, $chapterIds: [ID!]!) {
    reorderChapters(courseId: $courseId, chapterIds: $chapterIds) {
      _id
      order
    }
  }
`;

// ==================== Courses Module ====================
export const CREATE_COURSE_MUTATION = gql`
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
      _id
      title
      description
      category
      lang
      visibility
      thumbnailId
      bannerId
      createdAt
    }
  }
`;

export const UPDATE_COURSE_MUTATION = gql`
  mutation UpdateCourse($id: ID!, $input: UpdateCourseInput!) {
    updateCourse(id: $id, input: $input) {
      _id
      title
      description
      category
      lang
      visibility
      thumbnailId
      bannerId
      updatedAt
    }
  }
`;

export const UPDATE_COURSE_VISIBILITY_MUTATION = gql`
  mutation UpdateCourseVisibility($id: ID!, $visibility: CourseVisibility!) {
    updateCourseVisibility(id: $id, visibility: $visibility) {
      _id
      visibility
    }
  }
`;

export const DELETE_COURSE_MUTATION = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`;

// ==================== Game Module ====================
export const START_LEVEL_MUTATION = gql`
  mutation StartLevel($input: StartGameSessionInput!) {
    startLevel(input: $input) {
      _id
      userId
      courseId
      chapterId
      levelId
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

export const SUBMIT_ANSWER_MUTATION = gql`
  mutation SubmitAnswer($input: SubmitAnswerInput!) {
    submitAnswer(input: $input) {
      isCorrect
      livesRemaining
      correctAnswer
      isLastQuestion
    }
  }
`;

export const ABANDON_SESSION_MUTATION = gql`
  mutation AbandonSession($sessionId: String!) {
    abandonSession(sessionId: $sessionId)
  }
`;

// ==================== Levels Module ====================
export const CREATE_LEVEL_MUTATION = gql`
  mutation CreateLevel($input: CreateLevelInput!) {
    createLevel(input: $input) {
      _id
      title
      description
      order
      chapterId
      courseId
      createdAt
    }
  }
`;

export const UPDATE_LEVEL_MUTATION = gql`
  mutation UpdateLevel($id: ID!, $input: UpdateLevelInput!) {
    updateLevel(id: $id, input: $input) {
      _id
      title
      description
      order
      updatedAt
    }
  }
`;

export const DELETE_LEVEL_MUTATION = gql`
  mutation DeleteLevel($id: ID!) {
    deleteLevel(id: $id)
  }
`;

export const REORDER_LEVELS_MUTATION = gql`
  mutation ReorderLevels($chapterId: ID!, $levelIds: [ID!]!) {
    reorderLevels(chapterId: $chapterId, levelIds: $levelIds) {
      _id
      order
    }
  }
`;

// ==================== Progress Module ====================
export const INITIALIZE_COURSE_PROGRESS_MUTATION = gql`
  mutation InitializeCourseProgress($courseId: ID!) {
    initializeCourseProgress(courseId: $courseId) {
      _id
      userId
      courseId
      levelProgress {
        levelId
        completed
        bestScore
        bestStars
        attempts
        totalTimeSpent
        firstCompletedAt
        lastCompletedAt
      }
      chapterProgress {
        chapterId
        completedLevels
        totalLevels
        totalStars
        maxPossibleStars
        isCompleted
        isUnlocked
        completedAt
      }
      totalScore
      totalStars
      totalTimeSpent
      completedLevels
      totalLevels
      completedChapters
      totalChapters
      isCompleted
      completedAt
      createdAt
      createdAt
      updatedAt
    }
  }
`;

// ==================== Sessions Module ====================
export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const LOGOUT_ALL_SESSIONS_MUTATION = gql`
  mutation LogoutAllSessions {
    logoutAllSessions
  }
`;

// ==================== Storage Module ====================
export const CREATE_FILE_MUTATION = gql`
  mutation CreateFile($payload: CreateFileDto!) {
    createFile(payload: $payload) {
      _id
      filename
      mimetype
      size
      uploadId
      clientToken
    }
  }
`;

export const COMPLETE_FILE_MUTATION = gql`
  mutation CompleteFile($payload: CompleteFileDto!) {
    completeFile(payload: $payload) {
      _id
      filename
      mimetype
      size
      createdAt
    }
  }
`;

export const DELETE_FILE_MUTATION = gql`
  mutation DeleteFile($id: String!) {
    deleteFile(id: $id)
  }
`;

// ==================== Users Module ====================
export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateUserInput!) {
    updateProfile(input: $input) {
      _id
      displayName
      avatarId
      updatedAt
    }
  }
`;
