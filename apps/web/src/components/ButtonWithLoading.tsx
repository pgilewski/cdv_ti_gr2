import { Button, Flex } from '@mantine/core';
import { FadeLoader } from 'react-spinners';
import Spinner from 'react-spinkit';

import { RotatingLines } from 'react-loader-spinner';
type Props =
  | {
      text: string;
      onClick: () => void;
      type?: 'button';
      loading?: boolean;
      disabled?: boolean;
      color?: string;
    }
  | {
      text: string;
      onClick?: () => void;
      type?: 'submit';
      loading?: boolean;
      disabled?: boolean;
      color?: string;
    };

const ButtonWithLoading = ({
  text,
  onClick,
  type = 'button',
  loading = false,
  disabled = false,
  color = 'blue',
}: Props) => {
  return (
    <div className="max-w-min relative">
      <Button onClick={onClick} type={type} disabled={loading || disabled} color={color}>
        {loading && (
          <div className="top-1/2 left-1/2 absolute transform -translate-x-1/2 -translate-y-1/2">
            <Flex pr={'6px'}>
              <RotatingLines strokeColor="grey" strokeWidth="5" animationDuration="0.75" width="25" visible={true} />
            </Flex>
          </div>
        )}
        {text}
      </Button>
    </div>
  );
};
export default ButtonWithLoading;
