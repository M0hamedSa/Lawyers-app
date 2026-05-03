"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Scale, Loader2 } from "lucide-react";
import { ActionButton } from "@/components/ui/action-button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, inputClassName } from "@/components/ui/field";
import { signInAction } from "./actions";

export default function LoginPage() {
  const t = useTranslations("Login");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    
    const formData = new FormData(event.currentTarget);
    const result = await signInAction(formData);
    
    if (result.error) {
      setError(t("error"));
      setPending(false);
    } else if (result.success) {
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="flex size-12 items-center justify-center rounded-lg bg-ink-900 text-white">
            <Scale className="size-6" aria-hidden />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-ink-900">
            {t("title")}
          </h2>
          <p className="mt-2 text-center text-sm text-ink-700">
            {t("subtitle")}
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  {error}
                </div>
              )}
              
              <Field label={t("email")}>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={inputClassName}
                  dir="ltr"
                />
              </Field>

              <Field label={t("password")}>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={inputClassName}
                  dir="ltr"
                />
              </Field>

              <ActionButton type="submit" className="w-full justify-center" disabled={pending}>
                {pending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    {t("submit")}
                  </>
                ) : (
                  t("submit")
                )}
              </ActionButton>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
