import { useParams } from "react-router-dom";

import { useCourse } from "@/hooks/use-course";
import { useCourseLevels } from "@/hooks/use-level";
import { Level } from "@/services/level-service";
import { useCourseChapters } from "@/hooks/use-chapter";
import { Chapter } from "@/services/chapter-service";

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [loading, course, error] = useCourse(courseId!);
  const [levelsLoading, levels] = useCourseLevels(courseId!);
  const [chaptersLoading, chapters] = useCourseChapters(courseId!);

  if (loading || levelsLoading || chaptersLoading) {
    return <h1>Loading...</h1>;
  }

  if (error || !course) {
    return <h1>Error: {error}</h1>;
  }

  return (
    <div>
      <h1>Course</h1>
      <p>Title: {course.title}</p>
      <p>Description: {course.description}</p>
      <p>Author: {course.author}</p>
      <p>Category: {course.category}</p>
      <p>Chapters Count: {course.chaptersCount}</p>
      <p>Lang: {course.lang}</p>
      <p>Visibility: {course.visibility}</p>

      <hr />

      <h2>Chapters</h2>
      {chapters?.map((chapter: Chapter) => (
        <div key={chapter._id}>
          <h3>Chapter: {chapter.title}</h3>
          <p>ID: {chapter._id}</p>
          <p>Description: {chapter.description}</p>
          <p>Order: {chapter.order}</p>
          <p>Course Id: {chapter.courseId}</p>
        </div>
      ))}

      <hr />

      <h2>Levels</h2>
      {levels?.map((level: Level) => (
        <div key={level._id}>
          <h3>Level: {level.title}</h3>
          <p>ID: {level._id}</p>
          <p>Description: {level.description}</p>
          <p>Order: {level.order}</p>
          <p>Chapter Id: {level.chapterId}</p>
        </div>
      ))}
    </div>
  );
}

export default CourseDetailPage;
