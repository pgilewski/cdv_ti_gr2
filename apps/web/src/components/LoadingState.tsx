import { Flex } from '@mantine/core';
import { RotatingLines } from 'react-loader-spinner';

const LoadingState = () => {
  return (
    <Flex justify={'center'}>
      <RotatingLines strokeColor="grey" strokeWidth="5" animationDuration="0.75" width="25" visible={true} />
    </Flex>
  );
};
export default LoadingState;
