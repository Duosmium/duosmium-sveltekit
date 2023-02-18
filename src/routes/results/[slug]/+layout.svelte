<script lang="ts">
  import type { LayoutServerData } from './$types';
  export let data: LayoutServerData;
</script>

<h1>Results</h1>

This page contains results for tournament <code>{data.slug}</code>.

<slot></slot>