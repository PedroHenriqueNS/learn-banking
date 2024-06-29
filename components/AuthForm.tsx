'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useTransition } from 'react'

import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomInput from './CustomInput'
import { authFormSchema } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getLoggedInUser, signIn, signUp } from '@/lib/actions/user.actions'



const AuthForm = ({ type }: { type: 'sign-in' | 'sign-up' }) => {
    const router = useRouter()

    const [user, setUser] = useState(null)
    const [isLoading, startFunction] = useTransition()

    const formSchema = authFormSchema(type)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    const onSubmit = (data: z.infer<typeof formSchema>) => {
        try {
            startFunction((async () => {
                if (type === 'sign-up') {
                    const newUser = await signUp(data)

                    setUser(newUser)
                }

                if (type === 'sign-in') {
                    const response = await signIn({
                        email: data.email,
                        password: data.password
                    })

                    if (response) router.push('/')
                }
            }))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className='auth-form'>
            <header className='flex flex-col gap-5 md:gap-8'>
                <Link
                    href='/'
                    className='flex cursor-pointer items-center gap-1'
                >
                    <Image
                        src='/icons/logo.svg'
                        width={34}
                        height={34}
                        alt='Horizon logo'
                    />
                    <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>Horizon</h1>
                </Link>

                <div className='flex flex-col gap-1 md:gap-3'>
                    <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
                        {user
                            ? 'Link Account'
                            : type === 'sign-in'
                                ? 'Sign In'
                                : 'Sign Up'
                        }
                        <p className='text-16 font-normal text-gray-600'>
                            {user
                                ? 'Link your account to get started'
                                : 'Please enter your details'
                            }
                        </p>
                    </h1>
                </div>
            </header>
            {user ? (
                <div className='flex flex-col gap-4'>
                    {/* PlaidLink */}
                </div>
            ) : (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {type === 'sign-up' && (
                                <>
                                    <div className="flex gap-4">
                                        <CustomInput
                                            control={form.control}
                                            name="firstName"
                                            label='First Name'
                                            placeholder='Enter your first name'
                                            disabled={isLoading}
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="lastName"
                                            label='Last Name'
                                            placeholder='Enter your last name'
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <CustomInput
                                        control={form.control}
                                        name="address1"
                                        label='Address'
                                        placeholder='Enter your specific address'
                                        disabled={isLoading}
                                    />
                                    <CustomInput
                                        control={form.control}
                                        name="city"
                                        label='City'
                                        placeholder='Enter your city'
                                        disabled={isLoading}
                                    />
                                    <div className="flex gap-4">
                                        <CustomInput
                                            control={form.control}
                                            name="state"
                                            label='State'
                                            placeholder='Example: NY'
                                            disabled={isLoading}
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="postalcode"
                                            label='Postal Code'
                                            placeholder='Example: 11101'
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <CustomInput
                                            control={form.control}
                                            name="dateOfBirth"
                                            label='Date of Birth'
                                            placeholder='YYYY-MM-DD'
                                            disabled={isLoading}
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="ssn"
                                            label='SSN'
                                            placeholder='Example: 1234'
                                            disabled={isLoading}
                                        />
                                    </div>
                                </>
                            )}

                            <CustomInput
                                control={form.control}
                                name="email"
                                label='Email'
                                placeholder='Enter your email'
                                type="e-mail"
                                disabled={isLoading}
                            />
                            <CustomInput
                                control={form.control}
                                name="password"
                                label='Password'
                                placeholder='Enter your password'
                                type="password"
                                disabled={isLoading}
                            />

                            <div className='flex flex-col gap-4'>
                                <Button type="submit" disabled={isLoading} className='form-btn'>
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={20} className='animate-spin' /> &nbsp;Loading...
                                        </>
                                    ) : type === 'sign-in'
                                        ? 'Sign in' : 'Sign up'}
                                </Button>
                            </div>
                        </form>
                    </Form>

                    <footer className='flex justify-center gap-1'>
                        <p className='text-14 font-normal text-gray-600'>
                            {type === 'sign-in'
                                ? "Don't have an account?"
                                : "Already have an account?"
                            }
                        </p>
                        <Link href={type === 'sign-in' ? '/sign-up' : 'sign-in'} className='form-link'>
                            {type === 'sign-in' ? 'Sign up' : 'Sign in'}
                        </Link>
                    </footer>
                </>
            )}
        </section>
    )
}

export default AuthForm