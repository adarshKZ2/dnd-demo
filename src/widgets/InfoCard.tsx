import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function InfoCard() {
  return (
    <Card className="bg-black text-white shadow-2xs w-full">
      <CardHeader>
        <CardTitle className="text-center">Card Title</CardTitle>
        <CardDescription className="text-white">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis nemo
          sunt dolore rerum nam a nisi reiciendis, minus provident tempora ipsam
          itaque alias omnis voluptates vitae mollitia explicabo ad. Maiores?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged.
        </p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}
