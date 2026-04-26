export default function Skeleton({
  width = '100%',
  height = 14,
  rounded = 6,
}: {
  width?: number | string;
  height?: number | string;
  rounded?: number;
}) {
  return (
    <span
      className="bo-skel"
      style={{ inlineSize: width, blockSize: height, borderRadius: rounded }}
      aria-hidden="true"
    />
  );
}
