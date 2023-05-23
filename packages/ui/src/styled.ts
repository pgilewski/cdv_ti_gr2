// Solution for issue https://github.com/styled-components/styled-components/issues/3437

/* eslint-disable no-restricted-imports */
import styled, { StyledInterface } from 'styled-components';

export * from 'styled-components';

export default (typeof styled.div === 'function'
  ? styled
  : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    styled.default) as StyledInterface;
