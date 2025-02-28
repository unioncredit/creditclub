import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import React from "react";

import { getPostBySlug, getPostSlugs, markdownToHtml } from "@/lib/blog";
import { Columned } from "@/components/shared/Columned";
import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { Container } from "@/components/shared/Container";
import { Post } from "@/interfaces/post";
import { BlogBody } from "@/components/blog/BlogBody";
import { Address } from "viem";
import { ClubPromoBanner } from "@/components/shared/ClubPromoBanner";

export const getStaticPaths = (async () => {
  const slugs = getPostSlugs();

  return {
    paths: slugs.map((slug) => ({
      params: {
        slug,
      }
    })),
    fallback: false,
  }
}) satisfies GetStaticPaths;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const post = getPostBySlug(slug);

  return {
    props: {
      post,
      content: await markdownToHtml(post.content || ""),
    },
  };
};

export default function BlogPostSingle({
  post,
  content,
}: {
  post: Post;
  content: string;
}) {
  const clubAddress = process.env.NEXT_PUBLIC_CLUB_PROMO_ADDRESS! as Address;

  return (
    <>
      <Head>
        <title>Blog - {post.title}</title>
      </Head>

      <main>
        <Columned width={1020} className="py-8">
          <Header />
          <ClubPromoBanner clubAddress={clubAddress} />
          <Container className="mt-4 font-mono">
            <div className="max-w-[750px] m-auto py-4">
              <header className="border-b-2 border-black pb-2">
                <h1 className="text-2xl font-medium">{post.title}</h1>
                <p className="text-slate-500">{post.date}</p>
              </header>

              <img src={post.coverImage} alt="Cover Image" />

              <BlogBody content={content} />
            </div>
          </Container>
          <Footer />
        </Columned>
      </main>
    </>
  );
}
