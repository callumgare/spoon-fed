<script setup lang="ts">
import type { Popover } from "primevue";
import packageJson from "../package.json";
const popoverElm = ref();
const popupVisibility = ref();
</script>

<template>
  <div class="AccountSafetyInfo">
    <Button
      variant="link"
      severity="secondary"
      icon="pi pi-question-circle"
      iconPos="right"
      label="Are my account details safe?"
      @click="popoverElm?.toggle"
    />
    <Popover ref="popoverElm" class="accountSafety">
      <p>
        We take the security of your account details very seriously. They are only ever stored in your browser and never on Spoon Fed's servers. If you logout they are wiped from your browser and Spoon Fed will have no more access to them.
      </p>
      <p>
        <Button @click="(event) => { popupVisibility = true; popoverElm.hide(event) }">More technical details</Button>
      </p>
    </Popover>
    <Dialog v-model:visible="popupVisibility" modal header="Account Security" class="accountSafety">
      <p>
        Ideally your Paprika account details would be sent directly from your browser to Paprika's servers however since Paprika's API does not support <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS">CORS</a> this is not possible. Therefore Spoon Fed proxies the requests though it's own servers. Your credentials are forwarded on immediately to Paprika and are never stored. Please note however Spoon Fed does anonymously cache responses from Paprika's API both client-side and server-server for some amount of time in order to be a good API citizen by avoiding sending too many identical requests to Paprika's servers. 
      </p>
      <p>
        Spoon Fed is a personal project built by <a href="callum.gare.au">Callum Gare</a> simply because they wanted such an app for their own use and there are no commercial interests. The entire project is open-source and <a :href="packageJson.repository">available on GitHub</a>.
      </p>
      <p>Contact <a href="mailto:callum@gare.au">Callum Gare</a> for any comments or inquiries.
      </p>
    </Dialog>
  </div>
</template>

<style scoped>
.AccountSafetyInfo {
  .p-button {
    color: var(--p-text-muted-color)
  }
}
</style>
<style>
.p-popover.accountSafety, .p-dialog.accountSafety {
  max-width: 30rem;
  margin: 0.5rem 3rem;

  .p-popover-content, .p-dialog-content {
    line-height: 1.5;
    > *:first-child {
      margin-top: 0
    }
    > *:last-child {
      margin-bottom: 0
    }
  }
}
.p-popover.accountSafety {
  .p-popover-content {
    padding: 1.5rem;
  }
}
.p-dialog.accountSafety {
  .p-dialog-content {
    padding: 0 1.5rem 2em;
  }
}
</style>