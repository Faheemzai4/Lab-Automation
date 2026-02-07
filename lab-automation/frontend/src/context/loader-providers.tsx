"use client";

import { useEffect } from "react";
import { LoaderProvider, useLoader } from "./loader-context";
import { setupInterceptors } from "../services/api";
import Loader from "../components/loader/loader";

function ProvidersInner({ children }: { children: React.ReactNode }) {
  const { loading, setLoading } = useLoader();

  useEffect(() => {
    setupInterceptors(setLoading);
  }, []);

  return (
    <>
      {loading && <Loader />}
      {children}
    </>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LoaderProvider>
      <ProvidersInner>{children}</ProvidersInner>
    </LoaderProvider>
  );
}
