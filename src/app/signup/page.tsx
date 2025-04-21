import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Sign up for OneClient to manage your clients and projects
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="your@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
          <div className="space-y-2">
            <Label>Account Type</Label>
            <RadioGroup defaultValue="freelancer" className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="freelancer" id="freelancer" />
                <Label htmlFor="freelancer" className="font-normal">Freelancer (manage up to 10 clients)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="agency-owner" id="agency-owner" />
                <Label htmlFor="agency-owner" className="font-normal">Agency Owner (add team members)</Label>
              </div>
              <div className="flex items-center space-x-2 opacity-50" aria-disabled="true">
                <RadioGroupItem value="client" id="client" disabled />
                <Label htmlFor="client" className="font-normal">Client (invitation only)</Label>
              </div>
            </RadioGroup>
          </div>
          <Button className="w-full">Create Account</Button>
          <p className="text-xs text-center text-muted-foreground">
            By clicking "Create Account", you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 