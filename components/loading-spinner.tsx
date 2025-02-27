interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large"
}

export default function LoadingSpinner({ size = "medium" }: LoadingSpinnerProps) {
  const sizeClass = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  }[size]

  return (
    <div className="flex justify-center p-4">
      <div className={`${sizeClass} border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin`}></div>
    </div>
  )
}

