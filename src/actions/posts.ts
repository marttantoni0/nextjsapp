"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BlogPostSchema } from "@/lib/rules";
import { createClient } from "@/utils/supabase/server";

// Crear un nuevo post
export async function createPost(state: any, formData: FormData) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("Error fetching user:", userError);
    return redirect("/");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  const validatedFields = BlogPostSchema.safeParse({ title, content });

  if (!validatedFields.success) {
    return {
      errors: {
        title: validatedFields.error.flatten().fieldErrors.title?.[0],
        content: validatedFields.error.flatten().fieldErrors.content?.[0],
      },
      title,
      content,
    };
  }

  const { error: insertError } = await supabase.from("posts").insert({
    title: validatedFields.data.title,
    content: validatedFields.data.content,
    user_id: userData.user.id,
  });

  if (insertError) {
    return {
      errors: {
        title: "Error creating post",
      },
      title,
      content,
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

// Actualizar un post existente
export async function updatePost(state: any, formData: FormData) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) return redirect("/");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const postId = formData.get("postId") as string;

  const validatedFields = BlogPostSchema.safeParse({ title, content });

  if (!validatedFields.success) {
    return {
      errors: {
        title: validatedFields.error.flatten().fieldErrors.title?.[0],
        content: validatedFields.error.flatten().fieldErrors.content?.[0],
      },
      title,
      content,
    };
  }

  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (fetchError || !post || post.user_id !== userData.user.id) return redirect("/");

  const { error: updateError } = await supabase
    .from("posts")
    .update({
      title: validatedFields.data.title,
      content: validatedFields.data.content,
    })
    .eq("id", postId);

  if (updateError) {
    return {
      errors: {
        title: "Error updating post",
      },
      title,
      content,
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

// Eliminar un post
export async function deletePost(formData: FormData) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) return redirect("/");

  const postId = formData.get("postId") as string;

  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (fetchError || !post || post.user_id !== userData.user.id) return redirect("/");

  await supabase.from("posts").delete().eq("id", postId);

  revalidatePath("/dashboard");
}
