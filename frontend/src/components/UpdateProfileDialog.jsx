import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { supabase, mapUser } from '@/lib/supabase'
import { toast } from 'sonner'
import { setUser } from '@/redux/authSlice'
import { Loader as Loader2 } from 'lucide-react'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false)
    const { user } = useSelector(store => store.auth)
    const dispatch = useDispatch()

    const [input, setInput] = useState({
        fullname: user?.fullname || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        bio: user?.profile?.bio || '',
        skills: user?.profile?.skills?.join(', ') || '',
        file: null
    })

    useEffect(() => {
        if (user && open) {
            setInput({
                fullname: user.fullname || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                bio: user.profile?.bio || '',
                skills: user.profile?.skills?.join(', ') || '',
                file: null
            })
        }
    }, [user, open])

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0]
        setInput({ ...input, file })
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                toast.error('Please log in to update your profile')
                return
            }

            const skillsArray = input.skills
                ? input.skills.split(',').map(s => s.trim()).filter(Boolean)
                : []

            let resumeDataUrl = user?.profile?.resume || ''
            let fileName = user?.profile?.resumeOriginalName || ''

            if (input.file) {
                fileName = input.file.name
                resumeDataUrl = await new Promise((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onload = () => resolve(reader.result)
                    reader.onerror = reject
                    reader.readAsDataURL(input.file)
                })
            }

            const { data: updatedRow, error } = await supabase
                .from('users')
                .update({
                    fullname: input.fullname,
                    email: input.email,
                    phone_number: input.phoneNumber,
                    bio: input.bio,
                    skills: skillsArray,
                    resume: resumeDataUrl,
                    resume_original_name: fileName
                })
                .eq('id', session.user.id)
                .select()
                .single()

            if (error) {
                toast.error(error.message || 'Update failed')
                return
            }

            dispatch(setUser(mapUser(updatedRow)))
            toast.success('Profile updated successfully')
        } catch (error) {
            toast.error(error.message || 'Update failed')
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <Dialog open={open}>
            <DialogContent className='sm:max-w-[425px]' onInteractOutside={() => setOpen(false)}>
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitHandler}>
                    <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor='fullname' className='text-right'>Name</Label>
                            <Input id='fullname' name='fullname' value={input.fullname} onChange={changeEventHandler} className='col-span-3' />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor='email' className='text-right'>Email</Label>
                            <Input id='email' name='email' value={input.email} onChange={changeEventHandler} className='col-span-3' />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor='phoneNumber' className='text-right'>Phone</Label>
                            <Input id='phoneNumber' name='phoneNumber' value={input.phoneNumber} onChange={changeEventHandler} className='col-span-3' />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor='bio' className='text-right'>Bio</Label>
                            <Input id='bio' name='bio' value={input.bio} onChange={changeEventHandler} className='col-span-3' />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor='skills' className='text-right'>Skills</Label>
                            <Input id='skills' name='skills' value={input.skills} onChange={changeEventHandler} className='col-span-3' placeholder='e.g. React, Node, MongoDB' />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor='file' className='text-right'>Resume</Label>
                            <Input id='file' name='file' type='file' accept='application/pdf' onChange={fileChangeHandler} className='col-span-3' />
                        </div>
                    </div>
                    <DialogFooter>
                        {loading
                            ? <Button className='w-full my-4' disabled><Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait</Button>
                            : <Button type='submit' className='w-full my-4'>Save Changes</Button>
                        }
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProfileDialog
