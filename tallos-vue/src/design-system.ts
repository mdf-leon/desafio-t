import { App } from "vue";

import DInput from "./components/design-system/Input.vue";
import DButton from "./components/design-system/Button.vue";
import DIcon from "./components/design-system/Icon.vue";

export const installDesignSystem = (vue: App) => {
  vue.component("DInput", DInput);
  vue.component("DIcon", DIcon);
  vue.component("DButton", DButton);
};