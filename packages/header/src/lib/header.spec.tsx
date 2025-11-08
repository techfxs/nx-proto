import { render } from '@testing-library/react';

import NxProtoHeader from './header';

describe('NxProtoHeader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NxProtoHeader />);
    expect(baseElement).toBeTruthy();
  });
});
