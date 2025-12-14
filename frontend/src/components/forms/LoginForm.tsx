import { Link, useNavigate } from "react-router";
import { useLogin } from "../../hooks/useAuth";

import { z } from "zod";
import { useForm } from "@tanstack/react-form";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

const LoginForm = () => {
  const loginMutation = useLogin();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      loginMutation.mutate(value, {
        onSuccess: () => navigate("/"),
      });
    },
  });

  const isLoading = loginMutation.isPending;

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="text-4xl font-medium p-6">Login</h1>
      
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
        className="space-y-6"
      >
        <div className="flex items-center justify-end mb-8">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-base border-none underline"
          >
            <Link to="/register">Register</Link>
          </Button>
        </div>

        <FieldGroup>
          <form.Field
            name="email"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}> 
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="example@email.com"
                    autoComplete="email"
                  />
                  <FieldDescription>
                    Enter your email address
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>

        <FieldGroup>
          <form.Field
            name="password"
            children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}> 
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <FieldDescription>
                    Password must be at least 6 characters.
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>

        <Button
          type="submit"
          variant="default"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Login"}
        </Button>
        {loginMutation.isError && <p>Error: {loginMutation.error.message}</p>}
      </form>
    </div>
  );
};

export default LoginForm;