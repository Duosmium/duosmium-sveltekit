<script lang="ts">
	import { page } from '$app/stores';
	import { siteConfig } from '$lib/config/site';
	import { cn } from '$lib/utils';
	import { Icons } from '../icons';
	import { docsConfig } from '$lib/config/docs';
</script>

<div class="mr-4 hidden md:flex">
	<a href="/" class="mr-6 flex items-center space-x-2">
		<Icons.logo class="h-6 w-6" />
		<span class="hidden font-bold sm:inline-block text-[15px] lg:text-base">
			{siteConfig.name}
		</span>
	</a>
	<nav class="flex items-center space-x-6 text-sm font-medium">
		{#each docsConfig.mainNav as mainNavItem}
			<a
				href={mainNavItem.href}
				class={cn(
					'transition-colors hover:text-foreground/80',
					$page.url.pathname === mainNavItem.href ? 'text-foreground' : 'text-foreground/60'
				)}
			>
				{mainNavItem.title}
			</a>
		{/each}
		<!--		<a-->
		<!--			href="/docs"-->
		<!--			class={cn(-->
		<!--				'transition-colors hover:text-foreground/80',-->
		<!--				$page.url.pathname === '/docs' ? 'text-foreground' : 'text-foreground/60'-->
		<!--			)}-->
		<!--		>-->
		<!--			Documentation-->
		<!--		</a>-->
		<!--		<a-->
		<!--			href="/docs/components"-->
		<!--			class={cn(-->
		<!--				'transition-colors hover:text-foreground/80',-->
		<!--				$page.url.pathname.startsWith('/docs/components') ? 'text-foreground' : 'text-foreground/60'-->
		<!--			)}-->
		<!--		>-->
		<!--			Components-->
		<!--		</a>-->
		<!--		<a-->
		<!--			href="/themes"-->
		<!--			class={cn(-->
		<!--				'transition-colors hover:text-foreground/80',-->
		<!--				$page.url.pathname.startsWith('/themes') ? 'text-foreground' : 'text-foreground/60'-->
		<!--			)}-->
		<!--		>-->
		<!--			Themes-->
		<!--		</a>-->
		<!--		<a-->
		<!--			href="/examples"-->
		<!--			class={cn(-->
		<!--				'transition-colors hover:text-foreground/80',-->
		<!--				$page.url.pathname.startsWith('/examples') ? 'text-foreground' : 'text-foreground/60'-->
		<!--			)}-->
		<!--		>-->
		<!--			Examples-->
		<!--		</a>-->
		<!--		<a-->
		<!--			href={siteConfig.links.github}-->
		<!--			target="_blank"-->
		<!--			rel="noopener noreferrer"-->
		<!--			class={cn('hidden text-foreground/60 transition-colors hover:text-foreground/80 xl:block')}-->
		<!--		>-->
		<!--			GitHub-->
		<!--		</a>-->
	</nav>
</div>
