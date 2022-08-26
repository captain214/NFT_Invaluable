import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import LinearProgress from '@material-ui/core/LinearProgress';
import { CollectionLayout } from './collection.layout';
import { getCollection } from '../../../api/api';
import { ErrorPage } from '../../components/error-page';

export const CollectionPage: React.FC = () => {
  const { collectionSlug } = useParams<{ collectionSlug: string }>();
  const { isLoading, isError, data, error } = useQuery(
    ['collection', collectionSlug],
    () => getCollection(collectionSlug),
    {
      retry: false
    }
  );
  if (isLoading) {
    return <LinearProgress color="secondary" />;
  }

  if (isError) {
    // @ts-ignore
    return <ErrorPage errorMsg={error?.message} severity="error" />;
  }

  if (!data) {
    return <ErrorPage errorMsg="unknown error" severity="error" />;
  }

  return <CollectionLayout collection={data} />;
};
