import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

function NotFound() {
  return (
    <Container center>
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle className="text-center">Not Found</CardTitle>
        </CardHeader>
        <Separator className="mb-5" />
        <CardContent>
          <h1 className="text-center">
            The page you are looking for is not found!
          </h1>
        </CardContent>
        <Separator className="mb-5" />
        <CardFooter>
          <Button asChild>
            <Link href="/">Back</Link>
          </Button>
        </CardFooter>
      </Card>
    </Container>
  );
}

export default NotFound;
