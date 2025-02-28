export default function WidgetBuilder({ id }: { id: number }) {
  return <div id={`widget-${id}`}></div>;
}
