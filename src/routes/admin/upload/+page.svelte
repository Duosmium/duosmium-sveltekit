<!--<form method="POST" enctype="multipart/form-data">-->
<!--	<label for="yaml">Upload YAML file:</label>-->
<!--	<input type="file" name="yaml" id="yaml" accept=".yaml,.yml" multiple />-->
<!--	<br />-->
<!--	<input type="submit" value="Submit" />-->
<!--</form>-->

<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { formSchema, type FormSchema } from './schema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { redirect } from '@sveltejs/kit';
	import { page } from '$app/stores';
	function uploadToast() {
		redirect(303, $page.url);
	}

	export let form: SuperValidated<FormSchema>;
</script>

<div class="container relative">
	<div class="pt-12">
		<h1 class="text-center tracking-tight font-bold text-4xl">Upload Results</h1>
		<Form.Root method="POST" {form} schema={formSchema} enctype="multipart/form-data" let:config>
			<Form.Field {config} name="yaml">
				<Form.Item>
					<Form.Label>Files</Form.Label>
					<Form.Input type="file" multiple accept=".yaml,.yml" />
					<Form.Description>Upload SciolyFF YAML here.</Form.Description>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Button on:click={uploadToast}>Submit</Form.Button>
		</Form.Root>
	</div>
</div>
