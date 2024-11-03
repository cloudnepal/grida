import { TransparencyGridIcon } from "@radix-ui/react-icons";

export function RGBAChip({
  rgba,
}: {
  rgba: { r: number; g: number; b: number; a: number };
}) {
  return (
    <div className="relative w-6 h-6 rounded-sm border border-gray-300 overflow-hidden">
      <div
        className="absolute w-full h-full"
        style={{
          backgroundColor: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`,
        }}
      />
      <TransparencyGridIcon className="absolute w-full h-full -z-10" />
    </div>
  );
}
