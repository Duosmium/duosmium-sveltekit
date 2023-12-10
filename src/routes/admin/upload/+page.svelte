<!--<form method="POST" enctype="multipart/form-data">-->
<!--	<label for="yaml">Upload YAML file:</label>-->
<!--	<input type="file" name="yaml" id="yaml" accept=".yaml,.yml" multiple />-->
<!--	<br />-->
<!--	<input type="submit" value="Submit" />-->
<!--</form>-->


<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import { formSchema, type FormSchema } from "./schema";
	import type { SuperValidated } from "sveltekit-superforms";

	export let form: SuperValidated<FormSchema>;
</script>

<!--TODO: fix validation/data input errors-->

<div class="container">
	<div class="pt-12">
		<Form.Root method="POST" {form} schema={formSchema} let:config>
			<Form.Field {config} name="yaml">
				<Form.Item>
					<Form.Label>Files</Form.Label>
					<Form.Input type="file" multiple accept=".yaml,.yml" />
					<Form.Description>Upload SciolyFF YAML files here.</Form.Description>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<Form.Button>Submit</Form.Button>
		</Form.Root>
	</div>
</div>



