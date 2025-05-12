import Link from "next/link";

// Definimos el tipo para la prop `post`
interface Post {
  _id: string;
  title: string;
  content: string;
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="border border-slate-400 border-dashed p-4 rounded-md h-full">
      <p className="text-slate-600 text-xs">{new Date().toLocaleString()}</p>
      <Link
        href={`/posts/show/${post._id}`}
        className="block text-xl font-semibold mb-4"
      >
        {post.title}
      </Link>
      <p className="text-sm">{post.content}</p>
    </div>
  );
}
