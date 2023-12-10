<script>
	import A from '$lib/components/typography/a.svelte';
	import H1 from '$lib/components/typography/h1.svelte';
	import P from '$lib/components/typography/p.svelte';
	import * as PageHeader from '$lib/components/page-header';
	import { ArrowRight } from 'radix-icons-svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { siteConfig } from '$lib/config/site';
	import { cn } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button';
</script>

<div class="container relative">
	<PageHeader.Root class="pb-8">
		<a
			href="/docs/changelog"
			class="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium"
		>
			🎉 <Separator class="mx-2 h-4" orientation="vertical" />
			<span> New Components - Command & Combobox </span>
			<ArrowRight class="ml-1 h-4 w-4" />
		</a>
		<PageHeader.Heading>Build your component library.</PageHeader.Heading>
		<PageHeader.Description>
			Beautifully designed components that you can copy and paste into your apps. Accessible.
			Customizable. Open Source.
		</PageHeader.Description>
		<p class="text-sm text-orange-700 dark:text-orange-400">
			This is an unofficial port of <a
				href={siteConfig.links.github}
				target="_blank"
				rel="noreferrer"
				class="font-medium underline underline-offset-4">shadcn/ui</a
			>
			to Svelte, and is not affiliated with
			<a
				href={siteConfig.links.github}
				target="_blank"
				rel="noreferrer"
				class="font-medium underline underline-offset-4">@shadcn</a
			>, just inspired by him.
		</p>
		<div class="flex w-full items-center space-x-4 pb-8 pt-4 md:pb-10">
			<a href="/docs" class={cn(buttonVariants())}> Get Started </a>
			<a
				target="_blank"
				rel="noreferrer"
				href={siteConfig.links.github}
				class={cn(buttonVariants({ variant: 'outline' }))}
			>
				GitHub
			</a>
		</div>
	</PageHeader.Root>
	<section
		class="space-y-8 overflow-hidden rounded-lg border-2 border-primary dark:border-muted md:hidden"
	>
		<img
			src="/examples/dashboard-light.png"
			width={1280}
			height={866}
			alt="Dashboard"
			class="block dark:hidden"
		/>
		<img
			src="/examples/dashboard-dark.png"
			width={1280}
			height={866}
			alt="Dashboard"
			class="hidden dark:block"
		/>
	</section>
</div>
