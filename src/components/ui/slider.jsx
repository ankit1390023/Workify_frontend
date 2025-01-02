import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}>
    
    {/* Track Styling with smoother background color */}
    <SliderPrimitive.Track
      className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-300 dark:bg-gray-600 transition-all duration-300 ease-out">
      <SliderPrimitive.Range className="absolute h-full bg-blue-600 transition-all duration-300 ease-out" />
    </SliderPrimitive.Track>
    
    {/* Thumb Styling with hover and transition effect */}
    <SliderPrimitive.Thumb
      className="block h-6 w-6 rounded-full border-2 border-blue-500 bg-blue-500 shadow-xl transition-all duration-200 ease-out transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
