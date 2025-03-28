"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { toast } from "sonner"
import React from "react";
import { createRequest } from "@/lib/request";
import { GlowEffect } from '@/components/motion-primitives/glow-effect';
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import { twMerge } from "tailwind-merge";

type FormValues = {
  phone: string;
  password: string;
};

export default function Home() {
  const form = useForm<FormValues>();
  const [isLogin, setIsLogin] = React.useState<boolean | null>(null)
  
  const onSubmit = async(values: FormValues) => {
    if (values.phone === 'admin' && values.password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      toast("Login as admin")
      setTimeout(() => window.open(process.env.NEXT_PUBLIC_ADMIN_DASHBOARD, '_blank'), 1500);
      return
    }
    
    const users = await createRequest({ _model: 'user', _method: "GET", _where: values, ... values })
    
    if (Array.isArray(users) && users.length > 0) {
      console.log(form.reset)
      form.reset({ phone: '', password: '' })
      setIsLogin(true)
      
      return
    }
    
    setIsLogin(false)
  }
  
  console.log(isLogin)
  
  return (
    <div className='relative'>
      <GlowEffect
        colors={ ['#FF5733', '#33FF57', '#3357FF', '#F1C40F'] }
        mode='colorShift'
        blur='medium'
        scale={ 0.98 }
      />
      <div className='relative p-5 rounded-3xl w-96 bg-[#18181A] shadow-2xl'>
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
            
            <Button type="submit" className="w-full font-semibold py-5 mt-3">
              Login
            </Button>
          </form>
        </Form>
      </div>
      
      { isLogin !== null && <div className={ twMerge('absolute translate-y-10 text-center w-full') }>
        <TextShimmer className={ twMerge(!isLogin && 'text-red-400') }>
          { isLogin ? "Login successful" : "Login failed. Try again :(" }
        </TextShimmer>
      </div> }
    </div>
  );
}