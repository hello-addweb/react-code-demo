import Link from 'next/link';

const dummyPosts = [
  { slug: 'post-1', title: 'First Post', content: 'Content of the first post' },
  { slug: 'post-2', title: 'Second Post', content: 'Content of the second post' },
  { slug: 'post-3', title: 'Third Post', content: 'Content of the third post' },
];

const PostList = () => {
  return (
    <ul>
      {dummyPosts.map(post => (
        <li key={post.slug}>
          <Link href={`/post/${post.slug}`}>
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default PostList;