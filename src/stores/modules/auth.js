import { defineStore } from "pinia";
import { useButtonStore } from "./button";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: localStorage.getItem("isAuthenticated") ?? false,

    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,

    token: localStorage.getItem("token") ?? null,
  }),

  actions: {
    login(params, { setErrors }) {
      useButtonStore().setState(true);

      this.$axios
        .post("customer/login", params)
        .then((response) => {
          this.isAuthenticated = true;

          this.user = response.data.data;

          localStorage.setItem("user", JSON.stringify(response.data.data));

          localStorage.setItem("token", response.data.token);

          localStorage.setItem("isAuthenticated", true);

          this.$router.push("/");
        })
        .catch((error) => {
          if (error.response.status == 422) {
            setErrors(error.response.data.errors);

            useButtonStore().setState(false);
          }
        });
    },

    register(params) {
      this.$axios
        .post("customer/register", params)
        .then((response) => {
          alert(response.data.data.message);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");

      this.isAuthenticated = false;

      this.user = null;
    },
  },
});
