<script setup lang="ts">
// biome-ignore lint/correctness/noUnusedVariables: Referenced by the Vue template.
const props = withDefaults(
	defineProps<{
		placement?: string;
		size?: "banner" | "rail" | "inline";
	}>(),
	{ placement: "reserved", size: "inline" },
);
</script>

<template>
  <div
    class="TekMemoAdSlot"
    :class="`TekMemoAdSlot--${props.size}`"
    :aria-label="`Reserved placement: ${props.placement}`"
  >
    <span class="TekMemoAdTriangle TekMemoAdTriangle--one" />
    <span class="TekMemoAdTriangle TekMemoAdTriangle--two" />
    <span class="TekMemoAdTriangle TekMemoAdTriangle--three" />
  </div>
</template>
