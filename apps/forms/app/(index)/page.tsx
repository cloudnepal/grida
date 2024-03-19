import { GridaLogo } from "@/components/grida-logo";
import { GitHubLogoIcon, SlashIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { CheckIcon } from "@radix-ui/react-icons";

export default function Home() {
  return (
    <main>
      <Header />
      <div className="p-24">
        <div className="h-64" />
        <section>
          <div>
            <div className="flex flex-col">
              <h1 className="text-6xl font-bold py-10">
                Forms for
                <br />
                developers
              </h1>
              <p className="text-lg opacity-80 max-w-sm">
                Grida Forms is a{" "}
                <code className="underline">headless & api-first</code> form
                builder for developers
              </p>
            </div>
            <button className="mt-20 px-3 py-2 bg-neutral-800 rounded border border-neutral-800">
              Start your project
            </button>
          </div>
        </section>
        <div className="h-64" />
        <section>
          <div>
            <h2 className="text-4xl font-semibold text-center py-10">
              Deliver an optimized User Experience{" "}
            </h2>
          </div>
          <div className="mt-20">
            <div className="columns-3 grid-rows-2 space-y-8">
              <FeatureCard
                title={"Smart Customer Identity"}
                excerpt={
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                }
              />
              <FeatureCard
                title={"Connect Customer Identity"}
                excerpt={
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                }
              />
              <FeatureCard
                title={"Smart Customer Identity"}
                excerpt={
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                }
              />
              <FeatureCard
                title={"Smart Customer Identity"}
                excerpt={
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                }
              />
              <FeatureCard
                title={"Smart Customer Identity"}
                excerpt={
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                }
              />
              <FeatureCard
                title={"Smart Customer Identity"}
                excerpt={
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                }
              />
            </div>
          </div>
        </section>
        <div className="h-96" />
        <section>
          <div className="py-20 flex flex-col items-center gap-7">
            <h2 className="text-4xl font-semibold">
              Predictable pricing, designed to scale
            </h2>
            <p className="opacity-50">
              Start building for free, collaborate with a team, then scale to
              millions of users.
            </p>
          </div>
          <div className="columns-1 xl:columns-4 gap-10 w-full">
            <PricingCard
              plan={"Free"}
              price={"$0"}
              excerpt="Try Grida forms for free"
            />
            <PricingCard
              plan={"Pro"}
              price={"$20"}
              excerpt="Get start Grida forms for Pro"
              inverted
            />
            <PricingCard
              plan={"Business"}
              price={"$60"}
              excerpt="Get start Grida forms for Business"
            />
            <PricingCard
              plan={"Enterprise"}
              price={"Contact"}
              excerpt="Get start Grida forms for Enterprise"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({ title, excerpt }: { title: string; excerpt: string }) {
  return (
    <div className="flex flex-col gap-7">
      <div className="w-7 h-7 bg-gray-200" />
      <div className="flex flex-col gap-1 max-w-52">
        <span className="text-md font-medium">{title}</span>
        <p className=" text-sm font-normal opacity-50">{excerpt}</p>
      </div>
    </div>
  );
}

async function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 p-24 flex justify-between items-center">
      <div className="flex">
        <span className="flex items-center gap-2">
          <Link href="https://grida.co" target="_blank">
            <GridaLogo />
          </Link>
          <SlashIcon width={20} height={20} />
          <Link href="/">
            <span className="text-2xl font-bold dark:text-white">Forms</span>
          </Link>
        </span>
      </div>
      <div className="flex gap-10 items-center">
        <Link href="https://github.com/gridaco/grida/tree/main/apps/forms">
          <button className="flex justify-center items-center">
            <GitHubLogoIcon className="fill-black" width={24} height={24} />
          </button>
        </Link>
        <Link href="/sign-in">
          <button>Sign in</button>
        </Link>
        <Link href="/sign-in">
          <button className="px-4 py-2 rounded bg-black text-white dark:bg-white dark:text-black">
            Get Started
          </button>
        </Link>
      </div>
    </header>
  );
}

function PricingCard({
  plan,
  price,
  excerpt,
  inverted,
}: {
  //
  plan: string;
  price: string;
  excerpt: string;
  inverted?: boolean;
}) {
  return (
    <div
      data-inverted={inverted}
      className="flex-1 flex flex-col p-7 bg-neutral-900 border border-neutral-500/50 gap-8 rounded-lg
      data-[inverted='true']:invert
      "
    >
      <div className="flex flex-col gap-1">
        <span className="text-3xl font-semibold">{plan}</span>
        <span className=" text-sm font-normal opacity-50">{excerpt}</span>
      </div>
      <div>
        <span className="text-[48px] font-medium">{price}</span>
        <span className="ml-2 text-sm font-normal opacity-50">/month</span>
      </div>
      <hr className=" opacity-15" />
      <div className="flex flex-col gap-5">
        <PricingFeatureRow />
        <PricingFeatureRow />
        <PricingFeatureRow />
        <PricingFeatureRow />
        <PricingFeatureRow />
      </div>
      <button className=" text-lg font-medium px-5 py-3 rounded bg-neutral-800">
        Start for free
      </button>
    </div>
  );
}

function PricingFeatureRow() {
  return (
    <div className="flex items-center w-full gap-2">
      <CheckIcon />
      <span className="flex-1">Responses Included</span>
      <span className=" opacity-50">50</span>
    </div>
  );
}
