'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { toast } from "sonner";
import React from "react";
import { createRequest } from "@/lib/request";
import { useRouter } from "next/navigation";
import { useAuthStore } from '@/store/auth';
import { GlowEffect } from '@/components/motion-primitives/glow-effect';
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import { twMerge } from "tailwind-merge";

type FormValues = {
  email: string;
  password: string;
};

export default function Home() {
  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isLogin, setIsLogin] = React.useState<boolean | null>(null);
  const router = useRouter();
  const { setUser } = useAuthStore();

  const onSubmit = async (values: FormValues) => {
    const response = await createRequest({
      _model: 'NhanVien',
      _method: 'GET',
      _where: { email: values.email, matKhau: values.password },
    });

    if (response && Array.isArray(response) && response.length > 0) {
      const employee = response[0]; // Lấy thông tin nhân viên đầu tiên
      setUser({
        maNV: employee.maNV,
        hoTen: employee.hoTen,
        sdt: employee.sdt,
        email: employee.email,
        matKhau: employee.matKhau,
        ngaySinh: new Date(employee.ngaySinh), // Chuyển đổi DateTime thành Date
        diaChi: employee.diaChi,
        chucVu: employee.chucVu,
      });
      toast.success("Login successful");
      setIsLogin(true);
      setTimeout(() => router.push('/home'), 1500); // Điều hướng đến trang Home
    } else {
      setIsLogin(false);
      toast.error("Login failed. Invalid email or password.");
    }
  };

  return (
    <div className="relative">
      <GlowEffect
        colors={['#FF5733', '#33FF57', '#3357FF', '#F1C40F']}
        mode="colorShift"
        blur="medium"
        scale={0.98}
      />
      <div className="relative p-5 rounded-3xl w-96 bg-[#18181A] shadow-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input id="email" placeholder="Email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full font-semibold py-5 mt-3">
              Login
            </Button>
          </form>
        </Form>
      </div>

      {isLogin !== null && (
        <div className={twMerge("absolute translate-y-10 text-center w-full")}>
          <TextShimmer className={twMerge(!isLogin && "text-red-400")}>
            {isLogin ? "Login successful" : "Login failed. Try again :("}
          </TextShimmer>
        </div>
      )}
    </div>
  );
}