import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CanvasStyleLandingPage } from '../components/CanvasStyleLandingPage';
import { getAcrylicStyleLandingData } from '../data/acrylicStyleLandingData';
import { NotFoundPage } from './NotFoundPage';

export const AcrylicStylePage: React.FC = () => {
  const { styleSlug } = useParams<{ styleSlug: string }>();
  const data = styleSlug ? getAcrylicStyleLandingData(styleSlug) : undefined;

  useEffect(() => {
    if (data) {
      document.title = `${data.pageTitle} | Canvas India`;
    }
  }, [data]);

  if (!data) {
    return <NotFoundPage />;
  }

  return <CanvasStyleLandingPage data={data} material="acrylic" />;
};
