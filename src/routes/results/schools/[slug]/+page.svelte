<script lang="ts">
  import type { PageServerData } from './$types';
  export let data: PageServerData;
</script>

<h1>Schools by Letter</h1>

This page lists schools starting with the letter <code>{data.slug}</code>.