import { createContentLoader } from "vitepress";

export type BlogPost = {
	title: string;
	description: string;
	date: string;
	author: string;
	tags: string[];
	url: string;
};

declare const data: BlogPost[];

export { data };

export default createContentLoader("blog/*.md", {
	transform(posts): BlogPost[] {
		return posts
			.filter((post) => {
				const isIndexPage = post.url === "/blog/" || post.url === "/blog.html";
				const isDraft = post.frontmatter.draft === true;

				return !isIndexPage && !isDraft;
			})
			.sort((a, b) => {
				return (
					+new Date(b.frontmatter.date as string) -
					+new Date(a.frontmatter.date as string)
				);
			})
			.map((post) => ({
				title: post.frontmatter.title as string,
				description: post.frontmatter.description as string,
				date: post.frontmatter.date as string,
				author: (post.frontmatter.author as string) ?? "TekBreed",
				tags: (post.frontmatter.tags as string[]) ?? [],
				url: post.url.replace(/\.html$/, ""),
			}));
	},
});
