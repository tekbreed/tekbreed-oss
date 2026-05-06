<script setup lang="ts">
// biome-ignore lint/correctness/noUnusedImports: Referenced by the Vue template.
import { data as posts } from "../../data/blog.data";

// biome-ignore lint/correctness/noUnusedVariables: Referenced by the Vue template.
function formatDate(date: string) {
	return new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}
</script>

<template>
  <div class="TekMemoBlogIndex">
    <article v-for="post in posts" :key="post.url" class="TekMemoBlogItem">
      <h2 class="TekMemoBlogTitle">
        <a :href="post.url">
          {{ post.title }}
        </a>
      </h2>

      <p class="TekMemoBlogDescription">
        {{ post.description }}
      </p>

      <div class="TekMemoBlogFooter">
        <div v-if="post.tags.length" class="TekMemoBlogTags">
          <span v-for="tag in post.tags" :key="tag" class="TekMemoBlogTag">
            {{ tag }}
          </span>
        </div>

        <div class="TekMemoBlogDate">
          {{ formatDate(post.date) }}
        </div>
      </div>
    </article>
  </div>
</template>
