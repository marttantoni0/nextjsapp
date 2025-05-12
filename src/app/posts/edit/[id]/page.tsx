import PostCard from "@/components/PostCard";
import { supabase } from "@/lib/supabase";

interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
}

interface ShowPageProps {
  params: {
    id: string;
  };
}

export default async function Show({ params }: ShowPageProps) {
  const { id } = params;

  const { data: post, error } = await supabase()
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !post) {
    return <p>Failed to fetch the data</p>;
  }

  return (
    <div className="container w-1/2">
      <PostCard post={post} />
    </div>
  );
}
