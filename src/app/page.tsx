import PostCard from "@/components/PostCard";
import { getCollection } from "@/lib/db";
import { useState } from "react";

// Definimos el tipo de un post
interface Post {
  _id: string; // Change ObjectId to string
  title: string;
  content: string;
  userId: string;
}

export default async function Home() {
  const postsCollection = await getCollection<Post>("posts");
  const posts = await postsCollection?.find().sort({ $natural: -1 }).toArray();

  if (posts) {
    // Convert _id to string
    const serializedPosts = posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
    }));

    return (
      <div className="grid grid-cols-2 gap-6">
        {serializedPosts.map((post) => (
          <div key={post._id}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
    );
  } else {
    return <p>Failed to fetch the data from database.</p>;
  }
}
