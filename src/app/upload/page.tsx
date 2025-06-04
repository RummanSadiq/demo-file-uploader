'use client'

import { handleFileUpload } from '@/actions/uploadFile';
import { redirect } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';

const Page = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await handleFileUpload(formData)

        if (result.success) {
          setMessage({ type: 'success', text: 'File uploaded successfully!' })
          formRef.current?.reset()
          setTimeout(() => {
            redirect('/')
          }, 150)
        } else {
          setMessage({ type: 'error', text: result.error ?? '' })
        }
      } catch (error) {
        console.error('Form submission error:', error)
        setMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
      }
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Thumbnail Uploader</h1>
      <p className="text-gray-600 mb-6">Upload your images to generate thumbnails.</p>

      {/* Message Display */}
      {message && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success'
          ? 'bg-green-100 text-green-700 border border-green-300'
          : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
          {message.text}
        </div>
      )}

      <form action={handleSubmit} ref={formRef} className="flex flex-col items-center gap-3">
        <input
          name='file'
          type="file"
          accept="image/*"
          className="border border-gray-300 p-2 rounded cursor-pointer disabled:opacity-50"
          required
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending}
          className={`border border-gray-300 p-2 px-5 rounded cursor-pointer transition-colors ${isPending
            ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-900'
            : 'hover:bg-gray-50'
            }`}
        >
          {isPending ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  )
}

export default Page