import { render } from '@testing-library/react';

import NxProtoFooter from './footer';

describe('NxProtoFooter', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NxProtoFooter />);
    expect(baseElement).toBeTruthy();
  });
});
