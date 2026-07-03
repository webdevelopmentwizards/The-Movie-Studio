import Head from "next/head";

import LoginSignUpPage from "@/components/Auth/LoginSignUpPage";

export default function AuthPage() {
  return (
    <>
      <Head>
        <title>Log In / Sign Up — The Movie Studio</title>
        <meta
          name="description"
          content="Log in or create your Movie Studio account to stream independent films and exclusive premieres."
        />
      </Head>
      <LoginSignUpPage />
    </>
  );
}
