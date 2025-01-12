<script setup lang="ts">
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { Paprika } from "~/lib/paprika/client";
import { loginDetailsAreValid } from "~/lib/utils/valiation";

const settings = useSettings();

const formSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1, { message: "Password is required" }),
});

const generalFormError = ref<{ message: string }>();

const isSubmitting = ref(false);

const submitHandler = async (event: FormSubmitEvent) => {
	const { valid, values } = event;
	if (!valid) return;
	isSubmitting.value = true;
	try {
		const formValues = values as z.infer<typeof formSchema>; // We can safely cast since we
		// know that if valid is true then the form has been validated by the form schema
		if (await loginDetailsAreValid(formValues)) {
			settings.value = {
				email: values.email,
				auth: Paprika.getAuth(formValues),
			};
		} else {
			generalFormError.value = {
				message: "Email and/or password is wrong",
			};
		}
	} catch (error) {
		generalFormError.value = {
			message: "An unknown error occurred. Sorry about that :(",
		};
	}
	isSubmitting.value = false;
};

const initialValues = reactive<z.infer<typeof formSchema>>({
	email: settings.value.email,
	password: "",
});

const resolver = zodResolver(formSchema);
</script>

<template>
	<Form v-slot="$form" :initialValues="initialValues" :resolver @submit="submitHandler">
		<div class="fields">
			<LoginFormField
				name="email"
				icon-class="pi-at" 
				label="Email Address"
				:state="$form.email"
				:disabled="isSubmitting"
			/>
			<LoginFormField
				name="password"
				icon-class="pi-key" 
				label="Password"
				type="password"
				:state="$form.password"
				:disabled="isSubmitting"
			/>
		</div>
		<Button type="submit" severity="secondary" label="Login" :disabled="isSubmitting" />
		<div class="submissionFeedback">
			<ProgressSpinner v-if="isSubmitting" />
			<Message v-else-if="generalFormError" severity="error" size="large" variant="simple">{{ generalFormError.message }}</Message>
		</div>
	</Form>
</template>

<style scoped>
.p-form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	align-items: center;
	width: min(100%, 45rem);

	.fields {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
	}
	.submissionFeedback {
		min-height: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;

		.p-progressspinner {
			max-height: 2rem;
		}
	}
}
</style>