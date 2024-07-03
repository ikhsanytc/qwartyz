import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Eye } from "lucide-react";
import Link from "next/link";

function Page() {
  return (
    <Container center>
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle className="text-center">Register</CardTitle>
        </CardHeader>
        <Separator className="mb-5" />
        <CardContent>
          <div className="flex flex-col gap-4">
            <Input placeholder="Email..." />
            <div className="flex gap-2">
              <Input placeholder="Password..." type="password" />
              <Button size="icon">
                <Eye />
              </Button>
            </div>
          </div>
        </CardContent>
        <Separator className="mb-5" />
        <CardFooter className="flex justify-between">
          <Button>Register</Button>
          <div>
            <Button variant="secondary" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Container>
  );
}

export default Page;