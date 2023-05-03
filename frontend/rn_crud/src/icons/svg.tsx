import Svg, { Path } from 'react-native-svg'

export function SvgSync(props: any):JSX.Element {
  return (
    <Svg viewBox = '0 0 24 24' {...props}>
      <Path d="M7.3 23.7L2.6 19l4.7-4.7 1.4 1.4L6.4 18H16c3.3 0 6-2.7 6-6V9h2v3c0 4.4-3.6 8-8 8H6.4l2.3 2.3-1.4 1.4zM2 15H0v-3c0-4.4 3.6-8 8-8h9.6l-2.3-2.3L16.7.3 21.4 5l-4.7 4.7-1.4-1.4L17.6 6H8c-3.3 0-6 2.7-6 6v3z" />
    </Svg>
  );
};