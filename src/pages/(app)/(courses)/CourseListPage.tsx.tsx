import { useState } from "react";

import { useCourseSearch } from "@/hooks/use-course";
import { Course } from "@/services/course-service";

export function CourseListPage() {
  const [searchInput, setSearchInput] = useState("");
  const [loading, results, error] = useCourseSearch("courses", {
    enabled: true,
    limit: 10,
    offset: 0,
    filter: { search: searchInput.trim() },
  });

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error || !results) {
    return <h1>Error: {error}</h1>;
  }

  return (
    <div>
      <h1>Courses</h1>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      <p>Has more? {results.hasMore}</p>
      <p>Limit: {results.limit}</p>
      <p>Offset: {results.offset}</p>
      <p>Total: {results.total}</p>

      {results.courses.map((course: Course) => (
        <div key={course._id}>
          <h2>Title: {course.title}</h2>
          <p>ID: {course._id}</p>
          <p>Description: {course.description}</p>
          <p>Author: {course.author}</p>
          <p>Category: {course.category}</p>
          <p>Chapter Count: {course.chaptersCount}</p>
          <p>Lang: {course.lang}</p>
          <p>Visibility: {course.visibility}</p>
        </div>
      ))}
    </div>
  );
}
