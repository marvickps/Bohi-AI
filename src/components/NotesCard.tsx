import Image from 'next/image'

export default function NotesCard() {
  return (
    <div className="w-[326.6px] h-[366px] overflow-hidden rounded-[32px] bg-white shadow-lg">
      <div className="relative h-[122px] w-full bg-purple-600">
        <Image
          src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"
          alt="Meeting Notes Header"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex h-[244px] flex-col items-center justify-center p-6">
        <h2 className="mb-2 text-center text-2xl font-semibold text-purple-600">Meeting Notes</h2>
        <p className="text-center text-sm text-gray-500">20/10/2024</p>
      </div>
    </div>
  )
}