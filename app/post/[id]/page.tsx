import Link from 'next/link';
import Image from 'next/image';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

const prisma = new PrismaClient();

async function getPost(id: string) {
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    notFound();
  }
  const post = await prisma.post.findUnique({
    where: { id },
  });
  return post;
}

function parseContent(content: string) {
  const lines = content.split('\n');
  const result: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];

  lines.forEach((line, index) => {
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        result.push(
          <pre key={`code-${index}`}>
            <code>{codeContent.join('\n')}</code>
          </pre>
        );
        codeContent = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      return;
    }

    const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imageMatch) {
      const [, alt, src] = imageMatch;
      result.push(
        <Image
          key={`img-${index}`}
          src={src}
          alt={alt}
          width={672}
          height={400}
          className="max-w-full h-auto rounded-md my-2"
        />
      );
      return;
    }

    result.push(
      <p key={`text-${index}`} style={{ whiteSpace: 'pre-wrap' }}>
        {line || '\u00A0'}
      </p>
    );
  });

  return result;
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === 'create' || !/^[0-9a-fA-F]{24}$/.test(id)) {
    notFound();
  }
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Link href="/" className="btn-back mb-4">
        <FaArrowLeft className="mr-2" /> Back
      </Link>
      <h1 className="text-3xl font-bold mb-4 text-black">{post.title}</h1>
      <p className="text-gray mb-2">By {post.author}</p>
      <p className="text-gray text-sm mb-4">
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div className="text-black mb-6">{parseContent(post.content)}</div>
      <div className="flex gap-4">
        <Link href={`/post/${post.id}/edit`} className="btn btn-primary">
          Edit Post
        </Link>
        <Link href="/" className="btn btn-primary">
          Back to Posts
        </Link>
      </div>
    </div>
  );
}
