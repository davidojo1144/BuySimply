<script setup lang="ts">
import { computed, ref } from "vue";

type LoginResponse = {
  message: string;
  accessToken: string;
  staff: {
    id: number;
    name: string;
    email: string;
    role: "superAdmin" | "admin" | "staff";
  };
};

function isLoginResponse(data: unknown): data is LoginResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "accessToken" in data &&
    typeof (data as { accessToken?: unknown }).accessToken === "string"
  );
}

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const isPasswordVisible = ref(false);
const isLoading = ref(false);
const loginError = ref("");
const loginSuccess = ref("");

const backendUrl = computed(
  () => import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000",
);

async function submitLogin() {
  loginError.value = "";
  loginSuccess.value = "";

  if (!email.value || !password.value) {
    loginError.value = "Email and password are required.";
    return;
  }

  isLoading.value = true;

  try {
    const response = await fetch(`${backendUrl.value}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const data = (await response.json()) as
      | LoginResponse
      | { message?: string };

    if (!response.ok) {
      loginError.value = data.message ?? "Unable to sign in.";
      return;
    }

    if (!isLoginResponse(data)) {
      loginError.value = "Invalid login response.";
      return;
    }

    const token = data.accessToken;

    if (rememberMe.value) {
      localStorage.setItem("auth_token", token);
    } else {
      sessionStorage.setItem("auth_token", token);
    }

    loginSuccess.value = "Login successful.";
  } catch {
    loginError.value = "Network error while trying to sign in.";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen lg:flex">
    <section
      class="hidden w-1/2 flex-col items-center justify-center gap-6 bg-[#f8efff] px-10 py-7 lg:flex"
    >
      <div class="w-full">
        <img src="/team-achieve-logo.svg" alt="Team Achieve" />
      </div>

      <div
        class="h-[380px] w-full max-w-[620px] rounded-2xl bg-gradient-to-br from-[#d7d7d7] to-[#bfcde0]"
        role="img"
        aria-label="Team Achieve banner placeholder image"
      ></div>

      <div class="text-center">
        <h2 class="m-0 font-serif text-[2rem] text-[#5a1f8f]">Team Achieve</h2>
        <p class="mt-2.5 font-serif text-[1.4rem] text-[#303030]">
          Your perfect solution for funding your desires
        </p>
      </div>
    </section>

    <section
      class="mx-auto flex w-full max-w-[760px] flex-col justify-center px-6 py-10 lg:w-1/2 lg:max-w-[720px] lg:px-10 lg:py-14"
    >
      <div class="mb-6 flex justify-center lg:hidden">
        <img
          class="max-w-[82%]"
          src="/team-achieve-logo.svg"
          alt="Team Achieve"
        />
      </div>

      <h1
        class="m-0 text-center font-serif text-[3rem] text-[#5a1f8f] lg:text-[3.2rem]"
      >
        Welcome Back
      </h1>
      <p
        class="mb-8 mt-3 text-center text-[1.1rem] text-[#666666] lg:text-[1.35rem]"
      >
        Enter your email address and password to access your account.
      </p>

      <form class="flex flex-col gap-3" @submit.prevent="submitLogin">
        <label
          for="email"
          class="text-lg font-medium text-[#2d2d2d] lg:text-[1.4rem]"
        >
          Email Address <span class="text-[#e54747]">*</span>
        </label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="Enter your email"
          class="h-14 w-full rounded-[10px] border border-[#d2d2d2] px-4 text-base outline-none placeholder:text-[#a2a2a2] focus:border-[#5a1f8f] lg:text-[1.2rem]"
        />

        <label
          for="password"
          class="text-lg font-medium text-[#2d2d2d] lg:text-[1.4rem]"
        >
          Password <span class="text-[#e54747]">*</span>
        </label>
        <div class="flex">
          <input
            id="password"
            v-model="password"
            :type="isPasswordVisible ? 'text' : 'password'"
            placeholder="Enter your password"
            class="h-14 w-full rounded-l-[10px] border border-r-0 border-[#d2d2d2] px-4 text-base outline-none placeholder:text-[#a2a2a2] focus:border-[#5a1f8f] lg:text-[1.2rem]"
          />
          <button
            type="button"
            class="w-24 rounded-r-[10px] border border-[#d2d2d2] bg-white text-sm text-[#6e6e6e]"
            @click="isPasswordVisible = !isPasswordVisible"
          >
            {{ isPasswordVisible ? "Hide" : "Show" }}
          </button>
        </div>

        <div class="mt-1 flex items-center justify-between">
          <label class="inline-flex items-center gap-2 text-base">
            <input
              v-model="rememberMe"
              type="checkbox"
              class="h-[18px] w-[18px]"
            />
            <span>Remember me</span>
          </label>
          <a href="#" class="font-semibold text-[#5a1f8f] no-underline"
            >Forgot Password?</a
          >
        </div>

        <p v-if="loginError" class="m-0 text-sm text-[#cc2e2e]">
          {{ loginError }}
        </p>
        <p v-if="loginSuccess" class="m-0 text-sm text-[#1a8f3e]">
          {{ loginSuccess }}
        </p>

        <button
          class="mt-1 h-14 rounded-[10px] border-none bg-[#5a1f8f] text-xl font-bold text-white disabled:cursor-not-allowed disabled:opacity-75"
          type="submit"
          :disabled="isLoading"
        >
          {{ isLoading ? "Signing in..." : "Sign in" }}
        </button>
      </form>

      <p class="mt-5 text-center text-[1.5rem] text-[#5a5a5a]">
        Don't have an account?
        <a href="#" class="font-semibold text-[#5a1f8f] no-underline"
          >Sign up</a
        >
      </p>
    </section>
  </div>
</template>
