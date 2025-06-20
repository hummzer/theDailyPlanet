import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getPosts() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return posts;
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-black text-center">Blog Posts</h1>
      {posts.length === 0 ? (
        <p className="text-lg text-gray text-center">No posts found</p>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <div key={post.id} className="card">
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/post/${post.id}`} className="text-black hover:text-silver">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray mb-2">By {post.author}</p>
              <p className="text-gray text-sm">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
      <Link href="/post/create" className="btn btn-primary block w-full max-w-xs mx-auto mt-6 text-center">
        Create New Post
      </Link>
    </div>
  );
}
