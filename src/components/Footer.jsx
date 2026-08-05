export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-6">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} VTL Travel. All rights reserved.
      </div>
    </footer>
  )
}

