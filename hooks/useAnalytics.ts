import { NextRouter } from 'next/router';
import Analytics, { type PageViewProps } from '../lib/analytics';
import { useEffect, useState } from 'react';

function isEqualShallow(a: any, b: any) {
  for (var key in a) {
    if (!(key in b) || a[key] !== b[key]) {
      return false;
    }
  }
  for (var key in b) {
    if (!(key in a) || a[key] !== b[key]) {
      return false;
    }
  }
  for (var key in a.properties) {
    if (!(key in b.properties) || a.properties[key] !== b.properties[key]) {
      return false;
    }
  }
  for (var key in b.properties) {
    if (!(key in a.properties) || a.properties[key] !== b.propeties[key]) {
      return false;
    }
  }

  return true;
}

export interface UsePageViewProps extends PageViewProps {
  router: NextRouter;
}
const usePageView = ({
  router,
  Auth0Id,
  category,
  name,
  properties,
}: UsePageViewProps) => {
  const analytics = Analytics({ router });
  const [pageViewProps, setPageViewProps] = useState<
    { pathname: string } & PageViewProps
  >({
    pathname: '',
    Auth0Id,
    category,
    name,
    properties,
  });

  useEffect(() => {
    console.log({ pathname: router.pathname });
    const sameProps = !isEqualShallow(
      { pathname: router.asPath, Auth0Id, category, name, properties },
      pageViewProps,
    );
    console.log({ sameProps });
    //if (Auth0Id && category && name && router.pathname) {
    if (!sameProps) {
      console.log({ Auth0Id, category, name, properties });

      setPageViewProps({
        pathname: router.asPath,
        Auth0Id,
        category,
        name,
        properties,
      });
      analytics.pageview({ Auth0Id, category, name, properties });
    }
    //}
  }, [Auth0Id, category, name, properties, pageViewProps, analytics, router]);
};

export default usePageView;
