import React from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { DesignSystemPreview } from '../components/DesignSystemPreview';

export const DesignSystemView: React.FC = () => {
  usePageTitle('Design System');
  return <DesignSystemPreview />;
};

export default DesignSystemView;
