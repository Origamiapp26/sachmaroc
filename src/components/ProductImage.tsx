import Image from "next/image";

interface ProductImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export default function ProductImage({
  src,
  alt,
  fill,
  width,
  height,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 50vw, 33vw",
}: ProductImageProps) {
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 400}
      height={height ?? 500}
      className={className}
      priority={priority}
      sizes={sizes}
    />
  );
}
