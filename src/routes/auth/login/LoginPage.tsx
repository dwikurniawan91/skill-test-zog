import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { GoogleIcon } from "@/components/ui/googleIcon"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { Loader2Icon } from "lucide-react"
import zogIcon from "@/assets/zog-icon.png"

export default function LoginPage() {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 h-screen w-full">
      <div className="col-span-1 md:grid hidden place-items-center text-center text-white bg-brand-500 p-10">
        <h1>
          Your <span className="italic">Trusted</span> Digital Transformation Partner
        </h1>
        <div className="flex flex-col items-center justify-center gap-2 mt-auto">
          <p className="italic">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."</p>
          <div className="w-7 h-7 bg-white rounded-full"></div>
          <p>John Doe, CEO, Company Name</p>
        </div>
      </div>
      <div className="col-span-1 grid place-items-center p-20 ">
        <div className="flex flex-col gap-6 w-full min-w-[300px] max-w-[500px]">
          <div className="flex flex-col gap-1">
            <div className="mb-2">
              <img src={zogIcon} className="h-14 w-16" alt="Zero One Group" />
            </div>
            <h3 className="text-gray-700 text-2xl font-bold">Login to your Account</h3>
            <p className="text-gray-700 text-2xl">See what is on your business</p>
          </div>
          <Button variant="outline" className="w-full ">
            <GoogleIcon /> Continue with Google
          </Button>
          <div className="text-gray-400 text-center">
            <p>-----------or Sign in with Email-----------</p>
          </div>
          <form action="" className="flex flex-col gap-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="Email" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input type="password" id="password" placeholder="Password" />
              <div className="flex justify-between mt-1">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="mt-[2px]">
                    Remember me
                  </Label>
                </div>
                <a href="/forgot-password">Forgot password?</a>
              </div>
            </div>
            <Button className="w-full">
              <Loader2Icon className="animate-spin" /> Login
            </Button>
          </form>
        </div>
        <div className="mt-auto">
          <p>
            Not Registered Yet? {""}
            <a className="text-purple-700" href="./">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
