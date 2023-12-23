<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { formSchema, type FormSchema } from './schema';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let form: SuperValidated<FormSchema>;
</script>

<div class="container relative">
	<h1 class="text-center tracking-tight font-bold text-4xl pt-12">Log In</h1>
	<Form.Root
		method="POST"
		{form}
		schema={formSchema}
		let:config
		class="xs:w-[80vw] md:w-[60vw] xl:w-[40vw] mx-auto"
	>
		<Form.Field {config} name="email">
			<Form.Item>
				<Form.Label>Email</Form.Label>
				<Form.Input />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Field {config} name="password">
			<Form.Item>
				<Form.Label>Password</Form.Label>
				<Form.Input type="password" />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<Form.Button>Submit</Form.Button>
	</Form.Root>
</div>
