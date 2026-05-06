<script setup lang="ts">
// biome-ignore lint/correctness/noUnusedImports: Referenced by the Vue template.
import { useData, withBase } from "vitepress";

// biome-ignore lint/correctness/noUnusedVariables: Referenced by the Vue template.
const { isDark } = useData();
</script>

<template>
  <a class="TekMemoSidebarBrand" :href="withBase('/')">
    <img
      class="TekMemoSidebarBrandIcon"
      :src="withBase(isDark ? '/tekmemo.svg' : '/tekmemo.svg')"
      alt="TekMemo"
    />

    <span class="TekMemoSidebarBrandContent">
      <span class="TekMemoSidebarBrandName">TekMemo</span>
      <span class="TekMemoSidebarBrandLabel">Memory runtime</span>
    </span>
  </a>
</template>
