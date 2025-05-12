import { deletePost } from "@/actions/posts";
import { getCollection } from "@/lib/db";
import { ObjectId } from "mongodb";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

// Tipo mínimo esperado para un post
interface Post {
  _id: ObjectId;
  title: string;
  userId: ObjectId;
}

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Verifica si hay usuario antes de continuar
  if (!user || typeof user.id !== "string") {
    return <p>Error: usuario no autenticado.</p>;
  }

  const postsCollection = await getCollection<Post>("posts");
  const userPosts = await postsCollection
    ?.find({ userId: ObjectId.createFromHexString(user.id) })
    .sort({ $natural: -1 })
    .toArray();

  if (!userPosts) return <p>Error al obtener los datos.</p>;

  if (userPosts.length === 0) return <p>No tienes publicaciones.</p>;

  return (
    <div>
      <h1 className="title">Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th className="w-3/6">Título</th>
            <th className="w-1/6 sr-only">Ver</th>
            <th className="w-1/6 sr-only">Editar</th>
            <th className="w-1/6 sr-only">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {userPosts.map((post) => (
            <tr key={post._id.toString()}>
              <td className="w-3/6">{post.title}</td>
              <td className="w-1/6 text-blue-500">
                <Link href={`/posts/show/${post._id.toString()}`}>Ver</Link>
              </td>
              <td className="w-1/6 text-green-500">
                <Link href={`/posts/edit/${post._id.toString()}`}>Editar</Link>
              </td>
              <td className="w-1/6 text-red-500">
                <form action={deletePost}>
                  <input
                    type="hidden"
                    name="postId"
                    defaultValue={post._id.toString()}
                  />
                  <button type="submit">Eliminar</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
