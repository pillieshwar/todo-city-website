// The blog posts, built at build time by scripts/blog-content.mjs.
declare module "virtual:blog" {
  export interface Post {
    /** "best-todo-app-2027" */
    slug: string;
    /** "/blog/best-todo-app-2027" */
    path: string;
    title: string;
    h1: string;
    description: string;
    excerpt: string;
    /** "YYYY-MM-DD" */
    date: string;
    author: string;
    /** The cover image, under public/ ("/blog/img/today.webp"). */
    image: string;
    /** Reading time. */
    minutes: number;
    html: string;
  }
  /** Every post, newest first. */
  export const POSTS: Post[];
}
