<script setup lang="ts">
import type { FormFieldState } from "@primevue/forms";
import type { InputTypeHTMLAttribute } from "vue";

const props = defineProps<{
	name: string;
	iconClass: string;
	label: string;
	type?: InputTypeHTMLAttribute;
	state: FormFieldState | undefined;
	disabled?: boolean;
	formControl?: Record<string, unknown> | undefined;
}>();

const id = useId();
</script>

<template>
	<div class="field">
		<label :for="id" class="sr-only">{{ label }}</label>
		<IconField>
			<InputIcon :class="['pi', iconClass]" />
			<Password v-if="type === 'password'" :name="name" :placeholder="label" toggleMask :id="id" :disabled="disabled" :feedback="false" :form-control="formControl" size="large" />
			<InputText v-else :name="name" :type="type" :placeholder="label" :id="id" :disabled="disabled" :form-control="formControl" size="large" />
		</IconField>
		<Message v-if="state?.invalid" severity="error" size="small" variant="simple">{{ state.error?.message }}</Message>
	</div>
</template>

<style scoped>
.field {
	position: relative;

	.p-message {
		margin-top: 0.2rem;
	}

	@media (min-width: 600px) {
		--margin-for-errors: 10rem;
		width: 100%;
		padding: 0 var(--margin-for-errors);

		.p-message {
			margin-top: 0;
			position: absolute;
			top: 50%;
			right: 0;
			width: var(--margin-for-errors);
			max-width: var(--margin-for-errors);
			transform: translateY(-60%);
			--p-message-simple-content-padding: 0 0 0 0.5rem;
		}
	}

	:deep(.p-inputwrapper), :deep(input) {
		width: 100%;
	}
}
</style>