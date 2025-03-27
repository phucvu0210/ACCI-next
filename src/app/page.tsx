"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { toast } from "sonner"

type FormValues = {
  phone: string;
  password: string;
};

export default function Home() {
  const form = useForm<FormValues>();
  
  const onSubmit = async(values: FormValues) => {
    if (values.phone === 'admin' && values.password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      toast("Login as admin")
      setTimeout(() => window.location.href = 'http://localhost:5555', 2000)
    }
  }
  
  return (
    <div>
      <div className='p-5 rounded-3xl border w-96 bg-white shadow-2xl'>
        <Form { ... form }>
          <form onSubmit={ form.handleSubmit(onSubmit) } className='space-y-4'>
            <FormField
              control={ form.control }
              name="phone"
              render={ ({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input id="phone" placeholder="Phone number" { ... field } />
                  </FormControl>
                </FormItem>
              ) }
            />
            
            <FormField
              control={ form.control }
              name="password"
              render={ ({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Password" { ... field } />
                  </FormControl>
                </FormItem>
              ) }
            />
            
            <Button type="submit" className="w-full font-semibold py-5">
              Login
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
