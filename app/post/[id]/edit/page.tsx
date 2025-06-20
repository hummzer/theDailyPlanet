'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [postId, setPostId] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchPost() {
      const { id } = await params;
      setPostId(id);
      const res = await fetch(`/api/post/${id}`);
      const post = await res.json();
      setTitle(post.title);
      setContent(post.content);
      setAuthor(post.author);
    }
    fetchPost();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/post/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, author }),
    });
    router.push(`/post/${postId}`);
  };

  const handleDelete = async () => {
    await fetch(`/api/post/${postId}`, {
      method: 'DELETE' });
    router.push('/');
  };

  return (
    <div className="max-w-lg mx-auto py-8">
      <Link href={`/post/${postId}`} className="btn-back mb-4">
        <FaArrowLeft className="mr-2" /> Back
      </Link>
      <h1 className="text-3xl font-bold mb-6 text-black">Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray bg-white"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Content (use ``` for code, ![alt](url) for images)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full text-black p-2 rounded-lg border border-gray bg-white"
            rows={8}
            style={{ whiteSpace: 'pre-wrap' }}
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray bg-white"
          />
        </div>
        <div className="flex gap-4">
          <button type="submit" className="btn btn-primary flex-1">
            Update Post
          </button>
          <button type="button" onClick={handleDelete} className="btn btn-danger flex-1">
            Delete Post
          </button>
        </div>
      </form>
    </div>
  );
}
