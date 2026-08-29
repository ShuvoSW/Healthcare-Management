/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface RegisterFormProps {
  redirectPath?: string;
}

const registerAction = async (payload: IRegisterPayload) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        password: payload.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || "Registration failed",
      };
    }

    return {
      success: true,
      message: data?.message || "Registration successful",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong while registering",
    };
  }
};

const RegisterForm = ({ redirectPath }: RegisterFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterPayload) => registerAction(payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      try {
        const result = await mutateAsync(value);

        if (!result.success) {
          setServerError(result.message || "Registration failed");
          return;
        }

        if (redirectPath) {
          window.location.href = redirectPath;
          return;
        }

        window.location.href = "/login";
      } catch (error: any) {
        setServerError(error?.message || "Registration failed");
      }
    },
  });

  return (
    <Card className="mx-auto w-full max-w-md shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Sign up to access your healthcare dashboard.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          method="POST"
          action="#"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="name" validators={{ onChange: registerZodSchema.shape.name }}>
            {(field) => (
              <AppField
                field={field}
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
              />
            )}
          </form.Field>

          <form.Field name="email" validators={{ onChange: registerZodSchema.shape.email }}>
            {(field) => (
              <AppField
                field={field}
                label="Email"
                type="email"
                placeholder="Enter your email"
              />
            )}
          </form.Field>

          <form.Field name="password" validators={{ onChange: registerZodSchema.shape.password }}>
            {(field) => (
              <AppField
                field={field}
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                append={
                  <Button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                }
              />
            )}
          </form.Field>

          <form.Field
            name="confirmPassword"
            validators={{ onChange: registerZodSchema.shape.confirmPassword }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                append={
                  <Button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                }
              />
            )}
          </form.Field>

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Creating account..."
                disabled={!canSubmit}
              >
                Create Account
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline underline-offset-4">
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
