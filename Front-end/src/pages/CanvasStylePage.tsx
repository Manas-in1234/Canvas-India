import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CanvasStyleLandingPage } from '../components/CanvasStyleLandingPage';
import { getCanvasStyleLandingData } from '../data/canvasStyleLandingData';
import { NotFoundPage } from './NotFoundPage';

export const CanvasStylePage: React.FC = () => {
  const { styleSlug } = useParams<{ styleSlug: string }>();
  const data = styleSlug ? getCanvasStyleLandingData(styleSlug) : undefined;

  useEffect(() => {
    if (data) {
      document.title = `${data.pageTitle} | Canvas India`;
    }
  }, [data]);

  if (!data) {
    return <NotFoundPage />;
  }

  return <CanvasStyleLandingPage data={data} />;
};
