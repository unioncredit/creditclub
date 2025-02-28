import Head from "next/head";
import { GetStaticProps } from "next";
import Link from "next/link";
import { Address } from "viem";

import { Columned } from "@/components/shared/Columned";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { Container } from "@/components/shared/Container";
import { getAllPosts } from "@/lib/blog";
import { Post } from "@/interfaces/post";
import { ClubPromoBanner } from "@/components/shared/ClubPromoBanner";

export const getStaticProps = (async () => {
  const posts = getAllPosts();

  return { props: { posts } }
}) satisfies GetStaticProps<{ posts: Post[] }>

export default function BlogPage({
  posts,
}: {
  posts: Post[];
}) {
  const clubAddress = process.env.NEXT_PUBLIC_CLUB_PROMO_ADDRESS! as Address;

  return (
    <>
      <Head>
        <title>CreditClub - Blog</title>
      </Head>

      <main>
        <Columned width={1020} className="py-8">
          <Header />
          <ClubPromoBanner clubAddress={clubAddress} />
          <Container className="mt-4 px-32 font-mono">
            <div className="max-w-[750px] m-auto py-4">
              <ol>
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-lg font-medium">{post.title}</h2>
                      <p>{post.excerpt}</p>
                      <p className="text-sm mt-1 text-slate-500">{post.date}</p>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </Container>
          <Footer />
        </Columned>
      </main>
    </>
  );
}
