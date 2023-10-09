<template>
  <div class="container my-5 w-3/4 mx-auto">
    <h2 class="text-xl mb-5">
      Editando permissões de
      <strong v-if="underEditUser" v-text="underEditUser.username" />
    </h2>

    <h2 v-if="isSuccess" class="text-2xl my-5 text-green-500">
      Permissions updated successfully!
    </h2>

    <form class="grid grid-cols-1 gap-3" @submit.prevent="save">
      <label
        v-if="underEditUser"
        v-for="permission in permissionsList"
        :key="permission"
        class="flex gap-2 items-center"
      >
        <!-- :checked="underEditUser.permissions.includes(permission.name)" -->
        <!-- @click="
            underEditUser.permissions.includes(permission.name)
              ? underEditUser.permissions.splice(
                  underEditUser.permissions.indexOf(permission.name),
                  1
                )
              : underEditUser.permissions.push(permission.name)
          " -->
        <input
          :name="'edit-permission-' + permission"
          type="checkbox"
          :checked="
            underEditUser && underEditUser.permissions.includes(permission)
          "
          @click="togglePermission(permission)"
        />

        {{ permission }}
      </label>

      <DButton type="submit" class="mt-5" :disabled="saving">Salvar</DButton>
    </form>
  </div>
</template>

<script lang="ts">
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      saving: false,
      isSuccess: false,
      permissionsList: [
        "changePermissions",
        "createUser",
        "readUser",
        "updateUser",
        "deleteUser",
      ],
    };
  },

  async beforeRouteEnter(to, _, next) {
    next((vm: any) => {
      vm.fetchUserUnderEdit(to.params.username);
    });
  },

  computed: {
    ...mapGetters(["underEditUser", "permissions"]),
  },

  watch: {
    underEditUser: {
      handler(newValue) {
        if (newValue) {
          // Handle changes to underEditUser if necessary
          // For now, this is just a placeholder. You can fetch or handle other necessary logic here.
        }
      },
      deep: true,
    },
  },

  methods: {
    ...mapActions(["fetchUserUnderEdit", "updateUserPermissions"]),

    togglePermission(permissionName) {
      if (this.underEditUser) {
        if (this.underEditUser.permissions.includes(permissionName)) {
          this.underEditUser.permissions.splice(
            this.underEditUser.permissions.indexOf(permissionName),
            1
          );
        } else {
          this.underEditUser.permissions.push(permissionName);
        }
      }
    },

    async save() {
      this.saving = true;
      this.isSuccess = false; // Reset the flag every time we save

      const payload = {
        username: this.underEditUser.username,
        permissions: this.underEditUser.permissions,
      };

      try {
        await this.updateUserPermissions(payload);
        this.isSuccess = true; // Set to true when successfully updated
      } catch (error) {
        console.error("Failed to update permissions:", error);
      }

      this.saving = false;
    },
  },
};
</script>
