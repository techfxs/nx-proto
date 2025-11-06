import { render } from '@testing-library/react';

import MwUi from './mw-ui';

describe('MwUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MwUi />);
    expect(baseElement).toBeTruthy();
  });
});
