import { POSTS, type Post } from "virtual:blog";
import { Arrow } from "../components/Icons";
import { Frame } from "./GuidePage";

const longDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

/** One post: its heading, byline, cover-sized screenshots and body. */
export function BlogPost({ post }: { post: Post }) {
  return (
    <Frame
      crumbs={[
        ["TodoCity", "/"],
        ["Blog", "/blog"],
        [post.h1, null],
      ]}
    >
      <article className="post">
        <header className="doc-head">
          <p className="eyebrow">Blog</p>
          <h1>{post.h1}</h1>
          <p className="post-byline">
            <span>{post.author}</span>
            <span aria-hidden> · </span>
            <time dateTime={post.date}>{longDate(post.date)}</time>
            <span aria-hidden> · </span>
            <span>{post.minutes} min read</span>
          </p>
        </header>
        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </Frame>
  );
}

/** Every post, newest first. */
export function BlogIndex() {
  return (
    <Frame
      crumbs={[
        ["TodoCity", "/"],
        ["Blog", null],
      ]}
    >
      <header className="doc-head doc-hub-head">
        <p className="eyebrow">Blog</p>
        <h1>The TodoCity blog</h1>
        <p className="doc-answer">Notes from the person building TodoCity: what's new, how it compares, and why it works the way it does.</p>
      </header>
      <section className="post-list" aria-label="Posts">
        {POSTS.map((p) => (
          <a key={p.slug} href={p.path} className="post-card">
            <img src={p.image} alt="" loading="lazy" decoding="async" />
            <span className="post-card-text">
              <span className="doc-kind">
                <time dateTime={p.date}>{longDate(p.date)}</time> · {p.minutes} min read
              </span>
              <span className="doc-card-title">{p.h1}</span>
              <span className="doc-card-text">{p.excerpt}</span>
              <span className="doc-card-go">
                Read <Arrow />
              </span>
            </span>
          </a>
        ))}
      </section>
    </Frame>
  );
}

export { POSTS };
