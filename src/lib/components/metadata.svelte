<script lang="ts">
	import { page } from '$app/stores';
	import { siteConfig } from '$lib/config/site';

	export let title: string = siteConfig.name;

	$: title = $page.data?.title ? `${$page.data.title} - ${siteConfig.name}` : siteConfig.name;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={siteConfig.description} />
	<meta name="keywords" content={siteConfig.keywords} />
	<meta name="author" content="Duosmium Results" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={siteConfig.url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={siteConfig.description} />
	<!--	<meta name="twitter:image" content="https://shadcn-svelte.com/og.png" />-->
	<meta name="twitter:image:alt" content={siteConfig.name} />
	<!--	<meta name="twitter:creator" content="huntabyte" />-->
	<!--	<meta property="og:title" content={title} />-->
	<!--	<meta property="og:type" content="article" />-->
	<!--	<meta property="og:url" content={siteConfig.url + $page.url.pathname} />-->
	<!--	<meta property="og:image" content="https://shadcn-svelte.com/og.png" />-->
	<!--	<meta property="og:image:alt" content={siteConfig.name} />-->
	<!--	<meta property="og:image:width" content="1200" />-->
	<!--	<meta property="og:image:height" content="630" />-->
	<!--	<meta property="og:description" content={siteConfig.description} />-->
	<!--	<meta property="og:site_name" content={siteConfig.name} />-->
	<meta property="og:locale" content="EN_US" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="manifest" href="/site.webmanifest" />
	<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
	<meta name="msapplication-TileColor" content="#603cba" />
	<meta name="theme-color" content="#ffffff" />
</svelte:head>
