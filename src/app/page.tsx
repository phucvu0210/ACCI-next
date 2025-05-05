'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { toast } from 'sonner'
import React from 'react'
import { createRequest } from '@/lib/request'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

type FormValues = {
  email: string;
  password: string;
};

export default function Home () {
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const [isLogin, setIsLogin] = React.useState<boolean | null>(null)
  const router = useRouter()
  const { setUser } = useAuthStore()

  const onSubmit = async (values: FormValues) => {
    const response = await createRequest({
      _model: 'NhanVien',
      _method: 'GET',
      _where: { email: values.email, matKhau: values.password },
    })

    if (response && Array.isArray(response) && response.length > 0) {
      const employee = response[0]
      setUser({
        maNV: employee.maNV,
        hoTen: employee.hoTen,
        sdt: employee.sdt,
        email: employee.email,
        matKhau: employee.matKhau,
        ngaySinh: new Date(employee.ngaySinh),
        diaChi: employee.diaChi,
        chucVu: employee.chucVu,
      })
      toast.success('Login successful')
      setIsLogin(true)
      setTimeout(() => router.push('/home'), 1500)
    } else {
      setIsLogin(false)
      toast.error('Login failed. Invalid email or password.')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#fef6e6] w-full text-black">
      <div className="p-8 rounded-xl w-96 bg-white border border-gray-300">
        <h2
          className="text-2xl font-bold text-center mb-6 text-[#F16F33]">Login</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input id="email" placeholder="Email" {...field}
                           className="border-gray-400"/>
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
                    <Input type="password" placeholder="Password" {...field}
                           className="border-gray-400"/>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit"
                    className="w-full bg-[#F16F33] text-white hover:bg-[#d8571f]">
              Login
            </Button>
          </form>
        </Form>

        {isLogin !== null && (
          <p className={`mt-4 text-center font-medium ${isLogin
            ? 'text-green-600'
            : 'text-red-600'}`}>
            {isLogin ? 'Login successful' : 'Login failed. Try again :('}
          </p>
        )}
      </div>
    </div>
  )
}