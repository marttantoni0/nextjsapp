"use client";

import { useFormState } from "react-dom";

interface BlogFormState {
  title?: string;
  content?: string;
  errors?: {
    title?: string;
    content?: string;
  };
}

interface Post {
  _id?: string;
  title?: string;
  content?: string;
}

interface BlogFormProps {
  handler: (
    prevState: BlogFormState,
    formData: FormData
  ) => Promise<BlogFormState>;
  post?: Post;
}

export default function BlogForm({ handler, post }: BlogFormProps) {
  const [state, action] = useFormState<BlogFormState, FormData>(handler, {});

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="postId" defaultValue={post?._id} />

      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          defaultValue={state?.title || post?.title || ""}
        />
        {state?.errors?.title && <p className="error">{state.errors.title}</p>}
      </div>

      <div>
        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          rows={6}
          defaultValue={state?.content || post?.content || ""}
        ></textarea>
        {state?.errors?.content && (
          <p className="error">{state.errors.content}</p>
        )}
      </div>

      <button className="btn-primary" disabled={false}>
        Submit
      </button>
    </form>
  );
}
