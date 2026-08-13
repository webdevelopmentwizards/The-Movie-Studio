"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";

import { store } from "@/store";
import { bootstrapAuth, resetAuth } from "@/store/apps/auth";
import { clearStoredTokens } from "@/services/axiosInstance";

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void store.dispatch(bootstrapAuth());

    function onUnauthorized() {
      clearStoredTokens();
      store.dispatch(resetAuth());
    }

    window.addEventListener("tms-auth-unauthorized", onUnauthorized);
    return () => {
      window.removeEventListener("tms-auth-unauthorized", onUnauthorized);
    };
  }, []);

  return <>{children}</>;
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthBootstrap>{children}</AuthBootstrap>
    </Provider>
  );
}
