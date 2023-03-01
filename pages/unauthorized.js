import React from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

export default function Unauthorized() {
  const router = useRouter();
  const { message } = router.query;

  return (
    <Layout title="Unauthorized Page">
      <h1 className="text-xl">Access Denied</h1>
      {/* //the message it's coming from the query string to access the query string use use router  hook and extract the message from the query  */}
      {message && <div className="mb-4 text-red-500">{message}</div>}
    </Layout>
  );
}
