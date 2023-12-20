<script lang="ts">
  import InfoBadge from './info-badge.svelte';
  let className: string | undefined | null = undefined;
  export { className as class };
</script>

<InfoBadge
  text="Trialed"
  description="Placings in this event did not count towards total team score because of unforeseen circumstances during the competition."
  class={className}
/>